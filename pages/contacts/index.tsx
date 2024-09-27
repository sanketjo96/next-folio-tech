import ContactForm from "@/components/ui/Business/Contact/ContactForm";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Page() {
  const { t } = useTranslation("contacts");
  return (
    <section className="pb-24 mt-8">
      <div className="container max-w-3xl">
        <h1 className="title text-xl mb-8">{t("header")}</h1>
        <p className="text-muted-foreground text-md">{t("body")}</p>
        <ContactForm></ContactForm>
      </div>
    </section>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "contacts",
        "common",
      ])),
    },
  };
};
