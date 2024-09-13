import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

type handleLoginType = (req: NextApiRequest, res: NextApiResponse) => void;

const handleLogout: handleLoginType = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = JSON.parse(res.getHeader('x-user-header') as string);

  if (!user) {
    console.log(req.method)
    res.status(401).json({
      message: 'User is not logged in',
      success: false,
    });
  }

  const cookie = serialize('auth2-token', '', {
    maxAge: -1,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ message: 'Logged out successful', success: true, })
}


const methodMap: Record<string, handleLoginType> = {
  'POST': handleLogout
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method) {
    return methodMap[req.method](req, res);
  }
}

export default handler;