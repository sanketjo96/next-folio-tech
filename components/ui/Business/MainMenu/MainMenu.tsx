import Link from "next/link";
import { useTranslation } from "next-i18next";
import { User } from "@/components/context/UserContext";
import { useMediaQuery } from "@/hooks/use-media.query";
import { Login } from "./Login";
import { useLoggedInUser } from "@/components/providers/UserProvider";

export type MainMenuProps = {
  user: User | null;
};

export const AppNavLinks = ({ user }: MainMenuProps) => {
  const { t } = useTranslation("common");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { setUser } = useLoggedInUser();
  return (
    <>
      {!isDesktop && (
        <li className="align-left hover:text-orange-600">
          <Link href="/">{t("home")}</Link>
        </li>
      )}
      <li className="hover:text-orange-600">
        <Link href="/posts">{t("post")}</Link>
      </li>
      <li className="hover:text-orange-600">
        <Link href="/projects">{t("projects")}</Link>
      </li>
      <li className="hover:text-orange-600">
        <Link href="/contacts">{t("contacts")}</Link>
      </li>

      <Login user={user} setUser={setUser}></Login>

      {user?.email ? (
        <li className="hover:text-orange-600">
          <Link href="/dashboard">{t("dashboard")}</Link>
        </li>
      ) : null}
    </>
  );
};

export const MainMenu = ({ user }: MainMenuProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    isDesktop && (
      <ul className="flex items-center gap-4 font-light">
        <AppNavLinks user={user}></AppNavLinks>
      </ul>
    )
  );
};
