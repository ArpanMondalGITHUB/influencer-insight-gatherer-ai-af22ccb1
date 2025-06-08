import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("should render with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary text-primary-foreground");
  });

  it("should render with variant 'outline'", () => {
    render(<Button variant="outline">Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("border border-input bg-background hover:bg-accent hover:text-accent-foreground");
  });

  it("should render with variant 'secondary'", () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("bg-secondary text-secondary-foreground hover:bg-secondary/80");
  });

  it("should render with size 'sm'", () => {
    render(<Button size="sm">Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("h-9 rounded-md px-3");
  });

  it("should render with size 'lg'", () => {
    render(<Button size="lg">Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("h-11 rounded-md px-8");
  });

  it("should handle click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should render with a child element", () => {
    render(
      <Button>
        <span>Click me</span>
      </Button>
    );
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should render as disabled", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();
    // The visual state of being disabled (opacity, cursor) is handled by Tailwind's
    // `disabled:` variants (e.g., `disabled:opacity-50`, `disabled:pointer-events-none`).
    // `toBeDisabled()` is the primary check for functionality.
  });

  it("should render as child when asChild prop is true", () => {
    render(<Button asChild><a href="#">Click me</a></Button>);
    const link = screen.getByRole("link", { name: /click me/i});
    expect(link).toBeInTheDocument();
    // Check if it has button classes (or specific classes if asChild implies it)
    // This depends on how `asChild` is implemented. Assuming it still gets button styling.
    expect(link).toHaveClass("bg-primary text-primary-foreground");
  });
});
