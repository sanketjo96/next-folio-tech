import AppFooter from "@/components/ui/Business/AppFooter";
import { render } from "@testing-library/react";

const socialMediaLinks = [
  {
    id: 1,
    url: "https://example.com/facebook",
    icon: () => <></>,
  },
  { id: 2, url: "https://example.com/twitter", icon: () => <></> },
  {
    id: 3,
    url: "https://example.com/instagram",
    icon: () => <></>,
  },
];

// Renders footer with social media links
it("should render social media links when socialMediaLinks array is populated", () => {
  jest.mock("next-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
  }));
  const { getAllByRole } = render(<AppFooter />);
  const links = getAllByRole("link");
  expect(links).toHaveLength(socialMediaLinks.length);
});
