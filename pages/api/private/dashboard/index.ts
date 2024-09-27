import { SkillMetricMap, SkillSet } from "@/content/skills/mock";
import { NextApiRequest, NextApiResponse } from "next";


const handler = (req: NextApiRequest, res: NextApiResponse<SkillSet[]>) => {
  res.status(200).json(SkillMetricMap)
}

export default handler;