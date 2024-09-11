import { EmailInputs } from "@/components/ui/Business/Contact/ContactForm";
import { EmailTemplate } from "@/components/ui/Business/Email/template";
import { formatDate } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (req.body.message) {
      const { name, email, message }: EmailInputs = req.body.message;
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['sanketjoshi96@gmail.com'],
        subject: `New Enquiry from next folio - ${formatDate(new Date().toLocaleDateString())}`,
        react: EmailTemplate({ name: `${email} - [${name}]`, message }),
      });

      if (error) {
        return res.status(400).json(error);
      }
      res.status(201).json(data);
    }
  }
}

export default handler;