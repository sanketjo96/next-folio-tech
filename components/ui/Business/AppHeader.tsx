import Link from "next/link";
import React, { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useLoggedInUser } from "@/components/providers/UserProvider";
import { useRouter } from "next/router";
import { LockClosedIcon, LockOpen2Icon } from "@radix-ui/react-icons";
import { useTranslation } from "next-i18next";

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
          <Link href="/" className="">
            SSJ
          </Link>
        </div>

        <ul className="flex items-center gap-4 font-light">
          <li className="dark:text-orange-600 transition-colors hover: text-foreground">
            <Link href="/posts">{t("post")}</Link>
          </li>
          <li className="dark:text-orange-600 hover: text-foreground">
            <Link href="/projects">{t("projects")}</Link>
          </li>
          <li className="dark:text-orange-600 hover: text-foreground">
            <Link href="/contacts">{t("contacts")}</Link>
          </li>

          <li className="dark:text-orange-600 hover: text-foreground">
            {user?.email ? (
              <Link href="/dashboard">{t("dashboard")}</Link>
            ) : null}
          </li>
        </ul>
        <div className="flex">
          {!user?.email ? (
            <Link href="/login" className="self-center">
              <LockClosedIcon className="size-4"></LockClosedIcon>
            </Link>
          ) : (
            <Link href="#" className="self-center" onClick={onLogoutHandler}>
              <LockOpen2Icon className="size-4"></LockOpen2Icon>
            </Link>
          )}
          {isMounted && <ThemeToggle></ThemeToggle>}
        </div>
      </nav>
    </header>
  );
}
