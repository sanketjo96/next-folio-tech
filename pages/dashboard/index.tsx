import { User } from "@/components/context/UserContext";
import { useLoggedInUser } from "@/components/providers/UserProvider";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useGetAPI } from "@/hooks/use-get-api";

export default function Page() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [data] = useGetAPI<{ user: User }>("/api/user");
  const { user, setUser } = useLoggedInUser();

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data, setUser]);

  if (!user) router.push("/");

  return (
    <div className="container max-w-3xl">
      <h1>
        {t("hello")} <span className="font-bold">{user?.email}</span>
      </h1>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};
