import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media.query";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AppNavLinks,
  navItemClass,
} from "@/components/ui/Business/MainMenu/MainMenu";
import { User } from "@/components/context/UserContext";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useTranslation } from "next-i18next";
import { trackAttrs } from "@/lib/analytics";

export type MainBrandProps = {
  user: User | null;
};

export const BrandIcon = () => {
  return (
    <Link
      href="/"
      className="group flex items-center px-2"
      data-tour="nav-brand"
      aria-label="Sanket Joshi, home"
    >
      <span className="relative grid size-9 place-items-center" aria-hidden>
        {/* Soft brand glow behind the badge, brighter on hover. */}
        <span className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-brand to-brand-2 opacity-40 blur-md transition-opacity duration-300 group-hover:opacity-80" />
        <span className="relative grid size-9 place-items-center rounded-[10px] bg-gradient-to-br from-brand to-brand-2 shadow-sm ring-1 ring-inset ring-white/25 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-105">
          <span className="font-display text-[15px] font-extrabold leading-none tracking-tighter text-white">
            SJ
          </span>
          {/* Terminal cursor, a nod to the old "sj_" mark. */}
          <span className="absolute bottom-[7px] right-[6px] h-[2px] w-[6px] rounded-full bg-white/90 animate-pulse" />
        </span>
      </span>
    </Link>
  );
};

export const MainBrand = ({ user }: MainBrandProps) => {
  const { t } = useTranslation("common");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) return <BrandIcon />;

  return (
    <div className="flex items-center gap-1">
      <Drawer>
        <DrawerTrigger
          className="grid size-10 place-items-center rounded-full hover:bg-accent"
          aria-label="Open menu"
        >
          <HamburgerMenuIcon className="size-5" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex justify-center">
            <DrawerTitle className="sr-only">Menu</DrawerTitle>
            <BrandIcon />
          </DrawerHeader>
          <ul className="m-6 mb-8 flex flex-col gap-1 text-lg">
            <AppNavLinks user={user} />
            <li>
              {/* Full page load: the artist page renders without the tech-site layout. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/artist" className={navItemClass(false)} {...trackAttrs("Tech: Artist side link", { place: "menu" })}>
                ✦ Artist side
              </a>
            </li>
          </ul>
          <DrawerFooter>
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} SJJ LLC. {t("allRightsReserved")}
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <BrandIcon />
    </div>
  );
};
