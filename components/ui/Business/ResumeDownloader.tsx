import { useTranslation } from "react-i18next";
import { DownloadIcon, FileTextIcon } from "@radix-ui/react-icons";

export const ResumeDownloader = () => {
  const { t } = useTranslation("home");

  return (
    <section className="flex flex-col mt-10">
      <div className="flex items-center justify-start">
        <h2 className="text-xl font-bold ">{t("resumeCallTitle")}</h2>
      </div>

      <div className="flex gap-4 mt-2">
        <p className="max-w-md font-light text-muted-foreground">
          {t("resumeCallBody")}
        </p>
        <div className="flex flex-col justify-start items-center gap-2 m-3">
          <FileTextIcon className="size-10 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 dark:text-orange-300"></FileTextIcon>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">
              Sanket_FE_JS.docx
            </span>
            <DownloadIcon className="size-5 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 dark:text-orange-300"></DownloadIcon>
          </div>
        </div>
      </div>
    </section>
  );
};
