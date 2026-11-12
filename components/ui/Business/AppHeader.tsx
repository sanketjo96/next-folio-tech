import React from "react";
import { useLoggedInUser } from "@/components/providers/UserProvider";

import { MainMenu } from "./MainMenu/MainMenu";
import { SideControls } from "./MainMenu/SideControls";
import { MainBrand } from "./MainMenu/MainBrand";

export default function AppHeader() {
  const { user } = useLoggedInUser();

  return (
    <header className="sticky top-0 z-50 pt-4">
      <nav className="container max-w-5xl">
        <div className="flex h-14 items-center justify-between gap-4 rounded-full border bg-background/70 pl-3 pr-2 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <MainBrand user={user} />
          <MainMenu user={user} />
          <SideControls />
        </div>
      </nav>
    </header>
  );
}
