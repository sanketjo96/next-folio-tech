import { useTranslation } from "react-i18next";
import { DownloadIcon, FileTextIcon } from "@radix-ui/react-icons";
import { useFileDownload } from "@/hooks/use-file-download";
import { useEffect } from "react";

export const ResumeDownloader = () => {
  const { t } = useTranslation("home");
  const [downloadFile] = useFileDownload(
    "https://drive.google.com/uc?export=download&id=1uzadlIy4kqjwy6wsZcQdWBUyiBIXvlkQ"
  );

  return (
    <section className="flex flex-col mt-10">
      <div className="flex items-center justify-start">
        <h2 className="text-xl font-bold ">{t("resumeCallTitle")}</h2>
      </div>

      <div className="flex justify-between items-center">
        <p className="max-w-md font-light text-muted-foreground">
          {t("resumeCallBody")}
        </p>
        <div className="flex flex-col justify-start items-center gap-2 m-3">
          <FileTextIcon
            onClick={downloadFile}
            className="size-12 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 dark:text-orange-300"
          ></FileTextIcon>
          <div className="flex items-center gap-2">
            <span
              onClick={downloadFile}
              className="text-sm cursor-pointer text-muted-foreground  hover:text-blue-600 dark:hover:text-blue-300"
            >
              Sanket_FE_JS.docx
            </span>
            <DownloadIcon
              onClick={downloadFile}
              className="size-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 dark:text-orange-300"
            ></DownloadIcon>
          </div>
        </div>
      </div>
    </section>
  );
};
