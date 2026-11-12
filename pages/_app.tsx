import type { AppProps } from "next/app";
import type { NextPage } from "next";
import "../styles/globals.css";
import "driver.js/dist/driver.css";
import AppThemeProvider from "@/components/providers/AppThemeProvider";
import AppHeader from "@/components/ui/Business/AppHeader";
import AppFooter from "@/components/ui/Business/AppFooter";
import { Toaster } from "@/components/ui/toaster";
import { DefaultSeo } from "next-seo";
import { UserProvider } from "@/components/providers/UserProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { appWithTranslation } from "next-i18next";
import { useSiteTour } from "@/lib/tour/siteTour";
import { fontRootCss } from "@/lib/fonts";

import nextI18NextConfig from "../next-i18next.config";
import nextSeoConfig from "../next-seo.config";

/**
 * Pages can set `standalone = true` to render without the tech-site chrome
 * (header, footer, default SEO). Used by the artist link-in-bio page.
 */
export type AppPage<P = object> = NextPage<P> & { standalone?: boolean };

type Props = AppProps & { Component: AppPage };

const App = ({ Component, pageProps }: Props) => {
  useSiteTour();

  const fonts = <style jsx global>{fontRootCss}</style>;

  if (Component.standalone) {
    return (
      <div className="font-sans">
        {fonts}
        <Component {...pageProps} />
        <SpeedInsights />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      {fonts}
      <AppThemeProvider>
        <UserProvider>
          <DefaultSeo {...nextSeoConfig} />
          <AppHeader />
          <main className="grow">
            <Component {...pageProps} />
          </main>
          <Toaster />
          <SpeedInsights />
          <AppFooter />
        </UserProvider>
      </AppThemeProvider>
    </div>
  );
};

export default appWithTranslation(App, nextI18NextConfig);
