import { useEffect, useState } from "react";

export const useGetAPI = <T>(url: string): [T | null, boolean, any] => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErr, setIsErr] = useState(null);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.success) {
          setData(data as T);
        } else {
          setData(null);
        }
      } catch (e) {
        setIsErr(e as any)
        setData(null);
      }
    };

    fetchAPI();
  }, [url, setData]);

  return [data, isLoading, isErr]
}