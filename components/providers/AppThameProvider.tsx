import { ThemeProvider } from "next-themes";
import React from "react";

function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}

export default AppThemeProvider;
