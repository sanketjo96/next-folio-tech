import Head from "next/head";

/** Renders a schema.org JSON-LD block into <head>. */
export default function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <Head>
      <script
        key={`jsonld-${id}`}
        type="application/ld+json"
        // JSON.stringify output is safe here; escape "<" so a string can't close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      />
    </Head>
  );
}
