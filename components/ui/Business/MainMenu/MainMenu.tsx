import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { User } from "@/components/context/UserContext";
import { useMediaQuery } from "@/hooks/use-media.query";
import { Login } from "./Login";
import { useLoggedInUser } from "@/components/providers/UserProvider";
import { cn } from "@/lib/utils";

export type MainMenuProps = {
  user: User | null;
};

export const navItemClass = (active: boolean) =>
  cn(
    "block rounded-full px-3.5 py-1.5 text-sm transition-colors",
    active
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-accent hover:text-foreground"
  );

type NavItemProps = {
  href: string;
  label: string;
  tour?: string;
};

const NavItem = ({ href, label, tour }: NavItemProps) => {
  const { pathname } = useRouter();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <li data-tour={tour}>
      <Link
        href={href}
        className={navItemClass(active)}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </Link>
    </li>
  );
};

export const AppNavLinks = ({ user }: MainMenuProps) => {
  const { t } = useTranslation("common");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { setUser } = useLoggedInUser();
  return (
    <>
      {!isDesktop && <NavItem href="/" label={t("home")} />}
      <NavItem href="/posts" label={t("post")} tour="nav-posts" />
      <NavItem href="/projects" label={t("projects")} tour="nav-projects" />
      <NavItem href="/contacts" label={t("contacts")} tour="nav-contacts" />
      {user?.email ? <NavItem href="/dashboard" label={t("dashboard")} /> : null}
      <Login user={user} setUser={setUser} />
    </>
  );
};

export const MainMenu = ({ user }: MainMenuProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    isDesktop && (
      <ul className="flex items-center gap-1">
        <AppNavLinks user={user} />
      </ul>
    )
  );
};
