import React, { useContext, useMemo } from "react";
import { useState } from "react";
import { User, UserContext } from "../context/UserContext";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    email: "",
    id: "",
    role: "",
  });

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user, setUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useLoggedInUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context ?? {};
};
