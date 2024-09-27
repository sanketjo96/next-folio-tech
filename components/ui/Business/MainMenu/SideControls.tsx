import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/Business/ThemeToggle";

export const SideControls = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex items-center">
      {isMounted && <ThemeToggle></ThemeToggle>}
    </div>
  );
};
