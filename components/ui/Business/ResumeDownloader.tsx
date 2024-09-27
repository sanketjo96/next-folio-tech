import { useTranslation } from "next-i18next";
import { DownloadIcon, FileTextIcon } from "@radix-ui/react-icons";
import { useFileDownload } from "@/hooks/use-file-download";

export const ResumeDownloader = () => {
  const { t } = useTranslation("home");
  const [downloadFile] = useFileDownload(
    "https://drive.google.com/uc?export=download&id=1uzadlIy4kqjwy6wsZcQdWBUyiBIXvlkQ"
  );

  return (
    <section className="flex flex-col md:flex-row items-center mt-10">
      <div className="flex-1">
        <h2 className="text-xl font-bold ">{t("resumeCallTitle")}</h2>
        <p className="mt-2 font-light text-muted-foreground">
          {t("resumeCallBody")}
        </p>
      </div>

      <div className="mt-4 p-8 flex flex-col items-center justify-center gap-2 w-[175px]">
        <FileTextIcon
          onClick={downloadFile}
          className="size-12 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 dark:text-orange-300"
        />
        <div className="flex gap-2">
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
    </section>
  );
};
