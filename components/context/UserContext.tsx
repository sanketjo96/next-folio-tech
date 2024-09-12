import React from "react";

export type User = {
  id: string;
  email: string;
  role: string;
};

function noop() {}

export type UserContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const UserContext = React.createContext<UserContext>({
  user: null,
  setUser: noop,
});
