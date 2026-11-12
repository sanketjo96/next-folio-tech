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

export type MainBrandProps = {
  user: User | null;
};

export const BrandIcon = () => {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      data-tour="nav-brand"
      aria-label="Sanket Joshi, home"
    >
      <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 font-display text-sm font-bold text-white shadow-inner transition-transform group-hover:rotate-[-8deg]">
        SJ
      </span>
      <span className="hidden font-display text-[15px] font-semibold tracking-tight sm:inline">
        Sanket Joshi
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
              {/* Full load: `/?artist` is resolved by middleware. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/?artist" className={navItemClass(false)}>
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
