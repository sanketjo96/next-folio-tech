import {
  GitHubLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import React from "react";

// Define a type for the social media link
type SocialMediaLink = {
  id: number;
  url: string;
  icon: () => React.ReactNode;
  name: string;
};

// Social media links list
const socialMediaLinks: SocialMediaLink[] = [
  {
    id: 1,
    name: "Instagram",
    url: "https://www.instagram.com/laugh_with_sanket?igsh=MTd5OTFtajYzY21ndw==",
    icon: () => (
      <InstagramLogoIcon className="font-bold text-md w-[20px] h-[20px]" />
    ),
  },
  {
    id: 2,
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/sanket-joshi-7baa23185",
    icon: () => (
      <LinkedInLogoIcon className="font-bold text-md w-[20px] h-[20px]" />
    ),
  },
  {
    id: 3,
    name: "GitHub",
    url: "https://github.com/sanketjo96",
    icon: () => (
      <GitHubLogoIcon className="font-bold text-md w-[20px] h-[20px]" />
    ),
  },
];

export default socialMediaLinks;
