import React from "react";
import { useLoggedInUser } from "@/components/providers/UserProvider";

import { MainMenu } from "./MainMenu/MainMenu";
import { SideControls } from "./MainMenu/SideControls";
import { MainBrand } from "./MainMenu/MainBrand";

export default function AppHeader() {
  const { user } = useLoggedInUser();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-background via-background/80 to-transparent pb-3 pt-4">
      <nav className="container max-w-6xl">
        <div className="flex h-12 items-center justify-between gap-4">
          <MainBrand user={user} />
          <MainMenu user={user} />
          <SideControls />
        </div>
      </nav>
    </header>
  );
}
