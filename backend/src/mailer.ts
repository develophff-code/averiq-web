import nodemailer from 'nodemailer';

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
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) {
    console.log('[Mailer] SMTP not configured. Lead notification logged to console:');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"Averiq Web" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      replyTo: payload.email,
      subject: `[Nuevo Lead Averiq] ${payload.serviceInterest.toUpperCase()} — ${payload.fullName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0c1322; color: #f1f5f9; border-radius: 12px;">
          <h2 style="color: #00d2ff; margin-top: 0;">Nuevo Contacto Web Averiq</h2>
          <p><strong>Nombre:</strong> ${payload.fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${payload.email}" style="color: #38bdf8;">${payload.email}</a></p>
          <p><strong>Teléfono / WhatsApp:</strong> ${payload.phone || 'No especificado'}</p>
          <p><strong>Empresa:</strong> ${payload.company || 'No especificada'}</p>
          <p><strong>Servicio de Interés:</strong> <span style="background: #1e293b; padding: 4px 8px; border-radius: 6px; color: #38bdf8;">${payload.serviceInterest}</span></p>
          <p><strong>Idioma de Origen:</strong> ${payload.locale.toUpperCase()}</p>
          <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;" />
          <h3 style="color: #e2e8f0;">Mensaje:</h3>
          <p style="background: #1e293b; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${payload.message}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('[Mailer] Lead notification email sent successfully.');
  } catch (error) {
    console.error('[Mailer] Error sending notification email:', error);
  }
}
