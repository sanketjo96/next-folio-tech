import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ErrorLine } from "@/components/ui/ErrorLines";

describe("Page", () => {
  it("renders a errorline", () => {
    render(<ErrorLine message="test" />);

    const heading = screen.getByTestId("error-line");
    expect(heading).toHaveTextContent("test");
  });
});
