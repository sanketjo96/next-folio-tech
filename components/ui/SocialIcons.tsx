import React from "react";

// Define a type for the social media link
type SocialMediaLink = {
  id: number;
  url: string;
  icon: React.FC;
  name: string;
};

// LinkedIn Icon
const LinkedInIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    style={{ background: "#0077B5", borderRadius: "50%", padding: "4px" }}
  >
    <path
      fill="#FFFFFF"
      d="M22.23 0H1.77C.79 0 0 .774 0 1.731v20.538C0 23.226.79 24 1.77 24h20.46C23.21 24 24 23.226 24 22.269V1.731C24 .774 23.21 0 22.23 0zM7.06 20.452H3.56V9.045h3.5v11.407zM5.31 7.59a2.032 2.032 0 01-2.034-2.03 2.032 2.032 0 012.034-2.03 2.032 2.032 0 012.033 2.03A2.032 2.032 0 015.31 7.59zM20.452 20.452h-3.5v-5.604c0-3.247-4.27-3-4.27 0v5.604h-3.5V9.045h3.5v1.558c1.526-2.83 7-3.035 7 2.707v7.142z"
    />
  </svg>
);

// Instagram Icon
const InstagramIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    width="24"
    height="24"
    style={{ background: "#E1306C", borderRadius: "50%", padding: "4px" }}
  >
    <path
      fill="#FFFFFF"
      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.9 224.1 370.9 339 319.6 339 255.9 287.7 141 224.1 141zm0 186c-39.5 0-71.5-32-71.5-71.5S184.6 184 224.1 184s71.5 32 71.5 71.5-32 71.5-71.5 71.5zm146.4-194.1c0 14.9-12 26.9-26.9 26.9h-53.4c-14.9 0-26.9-12-26.9-26.9V80.7c0-14.9 12-26.9 26.9-26.9h53.4c14.9 0 26.9 12 26.9 26.9v53.4zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-94.1s-58.1-34.5-94.1-36.2C302.7 32 283.1 32 224 32s-78.7 0-117.3 1.7c-35.9 1.7-67.7 9.9-94.1 36.2S8.1 128.5 6.4 164.4C4.7 203 4.7 222.6 4.7 281.7s0 78.7 1.7 117.3c1.7 35.9 9.9 67.7 36.2 94.1s58.1 34.5 94.1 36.2c39.6 1.7 59.2 1.7 117.3 1.7s78.7 0 117.3-1.7c35.9-1.7 67.7-9.9 94.1-36.2s34.5-58.1 36.2-94.1c1.7-39.6 1.7-59.2 1.7-117.3s0-78.7-1.7-117.3z"
    />
  </svg>
);

// Facebook Icon
const FacebookIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    style={{ background: "#1877F2", borderRadius: "50%", padding: "4px" }}
  >
    <path
      fill="#FFFFFF"
      d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82V14.708h-3.29v-3.59h3.29V8.41c0-3.26 1.977-5.038 4.865-5.038 1.385 0 2.574.103 2.921.148v3.386l-2.006.001c-1.57 0-1.875.748-1.875 1.844v2.416h3.75l-.488 3.59h-3.261V24h6.395c.73 0 1.325-.593 1.325-1.324V1.325C24 .593 23.407 0 22.675 0z"
    />
  </svg>
);

// GitHub Icon
const GitHubIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    style={{ background: "#333", borderRadius: "50%", padding: "4px" }}
  >
    <path
      fill="#FFFFFF"
      d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.11.793-.26.793-.577v-2.234c-3.338.725-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.758-1.333-1.758-1.091-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.805 1.305 3.492.998.107-.775.418-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.933 0-1.31.468-2.38 1.236-3.22-.124-.304-.536-1.527.117-3.18 0 0 1.008-.322 3.3 1.23a11.488 11.488 0 013.003-.404c1.02.004 2.047.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.654 1.653.243 2.876.12 3.18.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.921.43.372.812 1.102.812 2.222v3.293c0 .32.22.694.827.575C20.565 21.797 24 17.303 24 12 24 5.373 18.627 0 12 0z"
    />
  </svg>
);

// Social media links list
const socialMediaLinks: SocialMediaLink[] = [
  {
    id: 1,
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: FacebookIcon,
  },
  {
    id: 2,
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: InstagramIcon,
  },
  {
    id: 3,
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    icon: LinkedInIcon,
  },
  { id: 4, name: "GitHub", url: "https://www.github.com", icon: GitHubIcon },
];

export default socialMediaLinks;
