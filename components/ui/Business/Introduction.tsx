import Image from "next/image";
import React from "react";
import authorImage from "@/public/author_2.jpg";
import { useTranslation } from "next-i18next";

function Introduction() {
  const { t } = useTranslation("home");
  return (
    <section className="flex">
      <div className="mt-4 flex-1">
        <h1 className="title text-2xl dark:text-orange-600 no-underline font-bold">
          Hey, I&apos;m Sanket
        </h1>
        <p className="mt-4 font-light text-muted-foreground">{t("intro")}</p>
      </div>
      <div className="mt-8 sm:self-start md:self-center">
        <Image
          className="flex-1 rounded-full grayscale"
          src={authorImage}
          alt="Sanket Joshi"
          width={175}
          height={100}
        ></Image>
      </div>
    </section>
  );
}

export default Introduction;
