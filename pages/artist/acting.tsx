import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ArtistPage from "@/components/artist/ArtistPage";
import { ARTIST_ACTING } from "@/lib/data/artist";
import type { AppPage } from "../_app";

const Page: AppPage = () => <ArtistPage profile={ARTIST_ACTING} />;

Page.standalone = true;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common"])),
  },
});

export default Page;
