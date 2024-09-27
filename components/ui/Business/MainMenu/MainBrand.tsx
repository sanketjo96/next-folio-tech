import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media.query";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { AppNavLinks } from "@/components/ui/Business/MainMenu/MainMenu";
import { User } from "@/components/context/UserContext";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export type MainBrandProps = {
  user: User | null;
};
export const MainBrand = ({ user }: MainBrandProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return isDesktop ? (
    <div className="font-serif text-4xl font-bold md:block">
      <Link href="/" className="text-bold hover:text-orange-600">
        SSJ
      </Link>
    </div>
  ) : (
    <Drawer>
      <DrawerTrigger>
        <HamburgerMenuIcon className="size-8 cursor-pointer hover:text-orange-600"></HamburgerMenuIcon>
      </DrawerTrigger>
      <DrawerContent>
        <ul className="flex flex-col m-8 justify-start items-center gap-4">
          <AppNavLinks user={user}></AppNavLinks>
        </ul>
      </DrawerContent>
    </Drawer>
  );
};
