import { EmailTemplate } from "@/components/ui/Business/Email/template";
import { ContactFormSchema } from "@/lib/schema/schemas";
import { formatDate } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from 'resend';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed', success: false });
  }

  // Validate on the server too: the browser-side check can be skipped.
  const parsed = ContactFormSchema.safeParse(req.body?.message);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid contact details', success: false });
  }

  const { name, email, message } = parsed.data;
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ message: 'Contact form is not configured', success: false });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['sanketjoshi96@gmail.com'],
    replyTo: email,
    subject: `New Enquiry from next folio - ${formatDate(new Date().toLocaleDateString())}`,
    react: EmailTemplate({ name: `${email} - [${name}]`, message }),
  });

  if (error) {
    // Don't echo provider error details back to the browser.
    console.error('Contact email failed:', error.name);
    return res.status(502).json({ message: 'Could not send message', success: false });
  }
  return res.status(201).json(data);
}

export default handler;
