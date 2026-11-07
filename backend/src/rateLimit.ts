import { createHash } from 'node:crypto';
import type { ClientRateLimitInfo, Options, Store } from 'express-rate-limit';
import { db } from './db.js';

export class PostgresRateLimitStore implements Store {
  readonly localKeys = false;
  private windowMs = 0;

  constructor(readonly prefix: string) {}

  init(options: Options): void {
    this.windowMs = options.windowMs;
  }

  private storageKey(key: string): string {
    return this.prefix + createHash('sha256').update(key).digest('hex');
  }

  async increment(key: string): Promise<ClientRateLimitInfo> {
    const storageKey = this.storageKey(key);
    // Retain active windows and discard counters unused for more than a day.
    await db.$executeRaw`DELETE FROM "rate_limits"
      WHERE "reset_at" < CURRENT_TIMESTAMP - INTERVAL '1 day'`;
    const [result] = await db.$queryRaw<Array<{ totalHits: number; resetTime: Date }>>`
      INSERT INTO "rate_limits" ("key", "hits", "reset_at")
      VALUES (${storageKey}, 1, CURRENT_TIMESTAMP + ${this.windowMs} * INTERVAL '1 millisecond')
      ON CONFLICT ("key") DO UPDATE SET
        "hits" = CASE WHEN "rate_limits"."reset_at" <= CURRENT_TIMESTAMP
          THEN 1 ELSE "rate_limits"."hits" + 1 END,
        "reset_at" = CASE WHEN "rate_limits"."reset_at" <= CURRENT_TIMESTAMP
          THEN CURRENT_TIMESTAMP + ${this.windowMs} * INTERVAL '1 millisecond'
          ELSE "rate_limits"."reset_at" END
      RETURNING "hits" AS "totalHits", "reset_at" AS "resetTime"
    `;
    return result;
  }

  async decrement(key: string): Promise<void> {
    const storageKey = this.storageKey(key);
    await db.$executeRaw`UPDATE "rate_limits" SET "hits" = GREATEST(0, "hits" - 1)
      WHERE "key" = ${storageKey}`;
  }

  async resetKey(key: string): Promise<void> {
    const storageKey = this.storageKey(key);
    await db.$executeRaw`DELETE FROM "rate_limits" WHERE "key" = ${storageKey}`;
  }
}
