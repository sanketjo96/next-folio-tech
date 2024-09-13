import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const user = JSON.parse(res.getHeader('x-user-header') as string);

  //TODO: MAKE DB Call to get user and send in response

  res.status(200).json({
    success: true,
    user
  });
}

export default handler;