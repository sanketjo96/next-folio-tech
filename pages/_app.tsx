import type { AppProps } from "next/app";
import "../styles/globals.css";
import AppThemeProvider from "@/components/providers/AppThemeProvider";
import AppHeader from "@/components/ui/Business/AppHeader";
import AppFooter from "@/components/ui/Business/AppFooter";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/components/providers/UserProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config";
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <AppThemeProvider>
        <UserProvider>
          <AppHeader></AppHeader>
          <main className="grow">
            <Component {...pageProps} />
          </main>
          <Toaster />
          <SpeedInsights></SpeedInsights>
          <AppFooter></AppFooter>
        </UserProvider>
      </AppThemeProvider>
    </div>
  );
};

export default appWithTranslation(App, nextI18NextConfig);
