import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed', success: false });
  }

  // Set by middleware.ts only after the token has been verified.
  if (!req.headers['x-user-header']) {
    return res.status(401).json({ message: 'User is not logged in', success: false });
  }

  const cookie = serialize('auth2-token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
  return res.status(200).json({ message: 'Logged out successful', success: true })
}

export default handler;
