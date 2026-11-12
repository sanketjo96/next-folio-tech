import { NextApiRequest, NextApiResponse } from "next";
import * as jose from 'jose'
import { serialize } from "cookie";
import { USER } from "@/lib/data/user";
import { jwtConfig } from "@/lib/routes/jwtConfig";
import { isValidPassword } from "@/lib/auth/password";
import { LoginFormSchema } from "@/lib/schema/schemas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed', success: false });
  }

  const parsed = LoginFormSchema.safeParse(req.body);
  const user = parsed.success ? USER.get(parsed.data.email) : undefined;

  // Same response for unknown user and wrong password, so emails can't be probed.
  if (!parsed.success || !user || !isValidPassword(parsed.data.password)) {
    return res.status(401).json({ message: 'Invalid email or password', success: false });
  }

  const accessToken = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(jwtConfig.secret);

  const cookie = serialize('auth2-token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
  return res.status(200).json({ message: 'Logged in successful', success: true })
}

export default handler;
