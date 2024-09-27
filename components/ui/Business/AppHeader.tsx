import React from "react";
import { useLoggedInUser } from "@/components/providers/UserProvider";

import { MainMenu } from "./MainMenu/MainMenu";
import { SideControls } from "./MainMenu/SideControls";
import { MainBrand } from "./MainMenu/MainBrand";

export default function AppHeader() {
  const { user } = useLoggedInUser();

  return (
    <header className="py-6 z-50">
      <nav className="container max-w-3xl flex justify-between">
        <MainBrand user={user}></MainBrand>
        <MainMenu user={user}></MainMenu>
        <SideControls></SideControls>
      </nav>
    </header>
  );
}
