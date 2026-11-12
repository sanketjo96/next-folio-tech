import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { User } from "@/components/context/UserContext";
import { useMediaQuery } from "@/hooks/use-media.query";
import { Login } from "./Login";
import { useLoggedInUser } from "@/components/providers/UserProvider";
import { cn } from "@/lib/utils";
import {
  FileText,
  FolderGit2,
  LayoutDashboard,
  Mail,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export type MainMenuProps = {
  user: User | null;
};

export const navItemClass = (active: boolean) =>
  cn(
    "flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
    active
      ? "bg-accent text-foreground"
      : "text-muted-foreground hover:text-foreground"
  );

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  tour?: string;
};

const NavItem = ({ href, label, icon: Icon, tour }: NavItemProps) => {
  const { pathname } = useRouter();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <li data-tour={tour}>
      <Link
        href={href}
        className={navItemClass(active)}
        aria-current={active ? "page" : undefined}
      >
        <Icon className={cn("size-3.5", active && "text-brand")} aria-hidden />
        {label}
      </Link>
    </li>
  );
};

export const AppNavLinks = ({ user }: MainMenuProps) => {
  const { t } = useTranslation("common");
  const { setUser } = useLoggedInUser();
  return (
    <>
      <NavItem href="/" label={t("home")} icon={Terminal} />
      <NavItem href="/posts" label={t("post")} icon={FileText} tour="nav-posts" />
      <NavItem href="/projects" label={t("projects")} icon={FolderGit2} tour="nav-projects" />
      <NavItem href="/contacts" label={t("contacts")} icon={Mail} tour="nav-contacts" />
      {user?.email ? (
        <NavItem href="/dashboard" label={t("dashboard")} icon={LayoutDashboard} />
      ) : null}
      <Login user={user} setUser={setUser} />
    </>
  );
};

export const MainMenu = ({ user }: MainMenuProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    isDesktop && (
      <ul className="flex items-center gap-0.5 rounded-full border bg-background/60 p-1 backdrop-blur-xl">
        <AppNavLinks user={user} />
      </ul>
    )
  );
};
