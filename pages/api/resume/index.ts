import { downloadPDF } from "@/lib/common/pdfFileDownload";
import { resumePath, resumeURL } from "@/lib/constants/resume";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await downloadPDF(resumeURL, resumePath)
    .then(() => {
      res.status(200).json({
        message: 'PDF downloaded and saved successfully.',
        success: true,
      })
    })
    .catch((error) => {
      console.error(`Error saving the PDF: ${error.message}`);
      res.status(500).json({
        message: 'Something went wrong while downloading resume',
        success: true,
      });

    });
}

export default handler;