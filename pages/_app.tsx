import type { AppProps } from "next/app";
import "../styles/globals.css";
import AppThemeProvider from "@/components/providers/AppThameProvider";
import AppHeader from "@/components/ui/AppHeader";
import AppFooter from "@/components/ui/AppFooter";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <AppThemeProvider>
        <AppHeader></AppHeader>
        <main className="grow">
          <Component {...pageProps} />
        </main>
        <AppFooter></AppFooter>
      </AppThemeProvider>
    </div>
  );
}
