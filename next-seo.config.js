// next-seo.config.js — site-wide defaults; pages override title/description/canonical.
const SITE_URL = "https://www.techsanket.in";
const DESCRIPTION =
  "Sanket Joshi is a founding technical lead and frontend tech lead with 10+ years building teams and shipping React, TypeScript and Node.js products.";

const nextSeoConfig = {
  title: "Sanket Joshi · Founding Technical Lead & Frontend Tech Lead",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/`,
    title: "Sanket Joshi · Founding Technical Lead & Frontend Tech Lead",
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/sj-og-image.jpg`,
        width: 1200,
        height: 600,
        alt: "Sanket Joshi",
      },
    ],
    site_name: "Sanket Joshi",
  },
  additionalMetaTags: [
    { name: "author", content: "Sanket Joshi" },
    {
      name: "keywords",
      content:
        "Sanket Joshi, frontend tech lead, founding technical lead, React, TypeScript, Node.js, engineering manager, Pune, Marathi stand-up comedian",
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
