// next-seo.config.js — site-wide defaults; pages override title/description/canonical.
const SITE_URL = "https://www.techsanket.in";
const TITLE = "Sanket Joshi | Senior Software Engineer | React, Node.js & AI";
const DESCRIPTION =
  "Sanket Joshi is a software engineer with 12+ years building modern web applications with React, TypeScript, Next.js and Node.js, and exploring Generative AI.";

const nextSeoConfig = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/`,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/sj-og-image.jpg`,
        width: 1200,
        height: 600,
        alt: "Sanket Joshi, software engineer",
      },
    ],
    site_name: "Sanket Joshi",
  },
  additionalMetaTags: [
    { name: "author", content: "Sanket Joshi" },
    {
      name: "keywords",
      content:
        "Sanket Joshi, software engineer, senior software engineer, frontend architecture, React, TypeScript, Next.js, Node.js, Generative AI, Pune, Marathi stand-up comedian",
    },
  ],
  additionalLinkTags: [
    { rel: "alternate", type: "text/plain", href: `${SITE_URL}/llms.txt`, title: "LLM-readable site summary" },
  ],
  twitter: {
    handle: "@sanket84808866",
    site: "@techsanket",
    cardType: "summary_large_image",
  },
};

export default nextSeoConfig;
