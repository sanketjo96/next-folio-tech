import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.headers['x-user-header'];

  if (data) {
    const user = JSON.parse(data as string);

    //TODO: MAKE DB Call to get user and send in response
    res.status(200).json({
      message: "Success",
      success: true,
      user: user ?? {}
    });
  } else {
    res.status(200).json({
      message: "User is missing from header",
      data: data ?? null,
      success: true,
    });
  }

}

export default handler;