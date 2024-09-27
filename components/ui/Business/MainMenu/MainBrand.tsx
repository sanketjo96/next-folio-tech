import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media.query";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AppNavLinks } from "@/components/ui/Business/MainMenu/MainMenu";
import { User } from "@/components/context/UserContext";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useTranslation } from "next-i18next";

export type MainBrandProps = {
  user: User | null;
};

const BrandIcon = () => {
  return (
    <div className="flex justify-center items-center font-serif text-4xl font-bold">
      <Link href="/" className="text-bold hover:text-orange-600">
        SSJ
      </Link>
    </div>
  );
};
export const MainBrand = ({ user }: MainBrandProps) => {
  const { t } = useTranslation("common");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return isDesktop ? (
    <BrandIcon />
  ) : (
    <Drawer>
      <DrawerTrigger>
        <HamburgerMenuIcon className="size-8 cursor-pointer hover:text-orange-600"></HamburgerMenuIcon>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <BrandIcon />
        </DrawerHeader>
        <ul className="flex flex-col m-8 mb-10 justify-start gap-4">
          <AppNavLinks user={user}></AppNavLinks>
        </ul>
        <DrawerFooter>
          <p className="text-center text-xs text-muted-foreground">
            {new Date().getFullYear()} SJJ LLC. {t("allRightsReserved")}
          </p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
