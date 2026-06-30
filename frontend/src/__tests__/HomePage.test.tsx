import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/[locale]/page";

describe("HomePage", () => {
  it("renders the homepage without crashing", () => {
    render(<HomePage />);

    // Check if the main sections are rendered by checking for structural elements
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the tutorial example headings", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "step1.title" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "step2.title" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "step3.title" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "step4.title" })).toBeInTheDocument();
  });
});
