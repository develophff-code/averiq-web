import { Resend } from 'resend';

export interface LeadEmailPayload {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  serviceInterest: string;
  message: string;
  locale: string;
}

export async function sendLeadNotification(payload: LeadEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL || 'contacto.averiq@gmail.com';
  const fromEmail = process.env.EMAIL_FROM || 'Averiq Web <onboarding@resend.dev>';

  if (!apiKey) {
    console.log('[Mailer] RESEND_API_KEY not configured. Lead notification logged to console:');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: fromEmail,
      to: [notifyEmail],
      replyTo: payload.email,
      subject: `⚡ [Nuevo Lead Averiq] ${payload.serviceInterest.toUpperCase()} — ${payload.fullName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #080C14; color: #F1F5F9; border-radius: 16px; border: 1px solid #1E293B; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00D2FF 0%, #0062FF 100%); padding: 24px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">AVERIQ</h1>
            <p style="color: #E0F2FE; margin: 4px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">Nuevo Lead Recibido desde la Web</p>
          </div>
          
          <div style="padding: 28px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr style="border-bottom: 1px solid #1E293B;">
                <td style="padding: 10px 0; color: #94A3B8; font-size: 13px; width: 140px;">Nombre:</td>
                <td style="padding: 10px 0; color: #FFFFFF; font-size: 14px; font-weight: 600;">${payload.fullName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #1E293B;">
                <td style="padding: 10px 0; color: #94A3B8; font-size: 13px;">Email:</td>
                <td style="padding: 10px 0; color: #38BDF8; font-size: 14px;"><a href="mailto:${payload.email}" style="color: #38BDF8; text-decoration: none;">${payload.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #1E293B;">
                <td style="padding: 10px 0; color: #94A3B8; font-size: 13px;">WhatsApp / Tel:</td>
                <td style="padding: 10px 0; color: #10B981; font-size: 14px; font-weight: 600;">${payload.phone || 'No especificado'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #1E293B;">
                <td style="padding: 10px 0; color: #94A3B8; font-size: 13px;">Empresa:</td>
                <td style="padding: 10px 0; color: #FFFFFF; font-size: 14px;">${payload.company || 'No especificada'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #1E293B;">
                <td style="padding: 10px 0; color: #94A3B8; font-size: 13px;">Solución de Interés:</td>
                <td style="padding: 10px 0; color: #00D2FF; font-size: 13px; font-weight: bold;">
                  <span style="background: rgba(0, 210, 255, 0.15); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(0, 210, 255, 0.3);">${payload.serviceInterest}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #94A3B8; font-size: 13px;">Idioma Web:</td>
                <td style="padding: 10px 0; color: #94A3B8; font-size: 13px; text-transform: uppercase;">${payload.locale}</td>
              </tr>
            </table>

            <div style="background: #0F172A; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-top: 10px;">
              <div style="color: #94A3B8; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Mensaje / Consulta:</div>
              <div style="color: #E2E8F0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${payload.message}</div>
            </div>
          </div>
          
          <div style="background: #05080E; padding: 16px; text-align: center; border-top: 1px solid #1E293B; font-size: 11px; color: #64748B;">
            Averiq — Inteligencia que funciona | Notificación automática de sistema
          </div>
        </div>
      `
    });

    console.log('[Mailer Resend] Lead notification email sent successfully:', result);
  } catch (error) {
    console.error('[Mailer Resend Error] Failed to send email via Resend:', error);
  }
}
