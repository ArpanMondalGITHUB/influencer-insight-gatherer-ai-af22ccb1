import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Alert, AlertTitle, AlertDescription } from "./alert";

describe("Alert component", () => {
  it("should render correctly with default variant and children", () => {
    render(
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toBeInTheDocument();

    const titleElement = screen.getByText("Test Title");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe("H5");

    const descriptionElement = screen.getByText("Test Description");
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement.tagName).toBe("DIV"); // As per implementation

    // Check for default variant classes (implementation dependent)
    // This might need adjustment based on how `cn` and `alertVariants` resolve classes
    expect(alertElement).toHaveClass("bg-background");
    expect(alertElement).toHaveClass("text-foreground");
  });

  it("should render correctly with destructive variant", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error Title</AlertTitle>
        <AlertDescription>This is a destructive alert.</AlertDescription>
      </Alert>
    );

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toBeInTheDocument();

    const titleElement = screen.getByText("Error Title");
    expect(titleElement).toBeInTheDocument();

    const descriptionElement = screen.getByText("This is a destructive alert.");
    expect(descriptionElement).toBeInTheDocument();

    // Check for destructive variant classes
    // This depends on the exact classes applied by `alertVariants`
    expect(alertElement).toHaveClass("border-destructive/50");
    expect(alertElement).toHaveClass("text-destructive");
  });
});
