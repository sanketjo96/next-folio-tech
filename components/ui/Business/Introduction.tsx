import Image from "next/image";
import React from "react";
import authorImage from "@/public/author_2.jpg";

function Introduction() {
  return (
    <section className="flex">
      <div className="mt-4 flex-1">
        <h1 className="title text-2xl dark:text-orange-600 no-underline font-bold">
          Hey, I&apos;m Sanket
        </h1>
        <p className="mt-4 font-light text-muted-foreground">
          A seasoned JavaScript developer with extensive experience as a
          React.js lead, proficient in ES6, OOJS, TypeScript, Node.js, GraphQL,
          and REST, with intermediate expertise in Next.js. Passionate about web
          development, with a strong commitment to continuous learning and
          sharing knowledge. Dedicated to fostering growth in both personal
          development and the wider tech community
        </p>
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
