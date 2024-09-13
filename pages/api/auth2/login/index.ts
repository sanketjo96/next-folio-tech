import { NextApiRequest, NextApiResponse } from "next";
import * as jose from 'jose'
import { serialize } from "cookie";
import { USER } from "@/lib/data/user";
import { jwtConfig } from "@/lib/routes/jwtConfig";

type handleLoginType = (req: NextApiRequest, res: NextApiResponse) => void;

const handleLogin: handleLoginType = async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.body.email;
  const user = USER.get(email);

  if (!user) {
    res.status(401).json({
      message: 'User not found',
      success: false,
    });
  }

  const accessToken = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(jwtConfig.secret);

  const cookie = serialize('auth2-token', accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ message: 'Logged in successful', success: true, })
}


const methodMap: Record<string, handleLoginType> = {
  'POST': handleLogin
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method) {
    return methodMap[req.method](req, res);
  }
}

export default handler;