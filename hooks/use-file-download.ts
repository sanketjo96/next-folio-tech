import { useCallback } from "react"

export const useFileDownload = (url: string): [() => void] => {
  const downloadFile = useCallback(async () => {
    const fileUrl = url;
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = "Sanket_FE_JS.pdf"; // Optional, set a custom file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [url])

  return [downloadFile];
}