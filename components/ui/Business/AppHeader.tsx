import Link from "next/link";
import React, { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useLoggedInUser } from "@/components/providers/UserProvider";
import { useRouter } from "next/router";
import { LockClosedIcon, LockOpen2Icon } from "@radix-ui/react-icons";
import { useTranslation } from "next-i18next";
import { Button } from "../button";

export default function AppHeader() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [isMounted, setIsMounted] = useState(false);
  const { user, setUser } = useLoggedInUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onLogoutHandler = () => {
    const loggedOut = async () => {
      try {
        const response = await fetch("/api/auth2/logout", {
          method: "POST",
        });

        const data = await response.json();
        if (data.success) {
          setUser(null);
          router.push("/");
        }
      } catch (e) {
        console.log("Error during logged out");
      }
    };

    loggedOut();
  };

  return (
    <header className="py-6 z-50">
      <nav className="container max-w-3xl flex justify-between items-center">
        <div className="font-serif text-4xl font-bold sm: hidden md:block">
          <Link href="/" className="text-bold hover:text-orange-600">
            SSJ
          </Link>
        </div>

        <ul className="flex items-center gap-4 font-light">
          <li className="hover:text-orange-600">
            <Link href="/posts">{t("post")}</Link>
          </li>
          <li className="hover:text-orange-600">
            <Link href="/projects">{t("projects")}</Link>
          </li>
          <li className="hover:text-orange-600">
            <Link href="/contacts">{t("contacts")}</Link>
          </li>

          <li className="hover:text-orange-600">
            {user?.email ? (
              <Link href="/dashboard">{t("dashboard")}</Link>
            ) : null}
          </li>
        </ul>
        <div>
          <Button
            variant="ghost"
            onClick={() =>
              !user?.email ? router.push("/login") : onLogoutHandler()
            }
          >
            {!user?.email ? (
              <LockClosedIcon className="size-4"></LockClosedIcon>
            ) : (
              <LockOpen2Icon className="size-4"></LockOpen2Icon>
            )}
          </Button>
          {isMounted && <ThemeToggle></ThemeToggle>}
        </div>
      </nav>
    </header>
  );
}
