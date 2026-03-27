import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, type, subject, message, ref, lang } = req.body

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'MKS Contact Form <onboarding@resend.dev>',
      to: 'mgmt@mynovaproduction.com',
      replyTo: email,
      subject: `[${ref}] ${type || 'Inquiry'} — ${subject}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; color: #333;">
          <h2 style="font-weight: 400; border-bottom: 1px solid #eee; padding-bottom: 12px;">
            New Inquiry — ${ref}
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #888; width: 120px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #888;">Type</td><td style="padding: 8px 0;">${type || 'General'}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Subject</td><td style="padding: 8px 0;">${subject}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Language</td><td style="padding: 8px 0;">${(lang || 'en').toUpperCase()}</td></tr>
          </table>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap;">
            ${message}
          </div>
          <p style="color: #aaa; font-size: 12px; margin-top: 24px;">
            Ref: ${ref} &middot; Submitted via michaelkimsheng.com
          </p>
        </div>
      `,
    })

    return res.status(200).json({ success: true, ref })
  } catch (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
