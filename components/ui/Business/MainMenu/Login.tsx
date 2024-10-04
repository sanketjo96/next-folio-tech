import { User } from "@/components/context/UserContext";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export type LoginProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const Login = ({ user, setUser }: LoginProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const onLogoutHandler = () => {
    const loggedOut = async () => {
      try {
        const response = await fetch("/api/auth2/logout", {
          method: "POST",
        });

        const data = await response.json();
        if (data.success) {
          setUser(null);
          router.push("/");
        }
      } catch (e) {
        console.log("Error during logged out");
      }
    };

    loggedOut();
  };
  return (
    <li className="hover:text-orange-600 cursor-pointer">
      <span
        onClick={() =>
          !user?.email ? router.push("/login") : onLogoutHandler()
        }
      >
        {!user?.email ? t("login") : t("logout")}
      </span>
    </li>
  );
};
