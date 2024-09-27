import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "@/components/context/UserContext";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/Business/ThemeToggle";
import { LockClosedIcon, LockOpen2Icon } from "@radix-ui/react-icons";

export type MainControlsProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};
export const MainControls = ({ user, setUser }: MainControlsProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

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
    <div className="flex items-center">
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
  );
};
