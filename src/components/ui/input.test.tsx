import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./input"; // Adjust path as necessary

describe("Input", () => {
  it("should render with default props (type text)", () => {
    render(<Input />);
    const inputElement = screen.getByRole("textbox") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.type).toBe("text"); // Check the DOM property for effective type
    expect(inputElement).toHaveClass(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    );
  });

  it("should handle change events and update value", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "testing" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    // For an uncontrolled component, the value attribute doesn't update directly in the DOM
    // unless it's explicitly set by a parent controlling it.
    // However, we can check if the event handler was called with the correct value.
    // If it were a controlled component, we'd also check expect(inputElement.value).toBe('testing');
  });

  it("should render with type 'password'", () => {
    render(<Input type="password" />);
    // getByRole('textbox') doesn't work for type="password" in some setups
    // A more robust way is to query by test-id or placeholder if type="password" hides the role
    // For now, let's assume it's discoverable or use a more generic query if needed.
    // If this fails, we might need to add a data-testid or rely on placeholder.
    // const inputElement = screen.getByLabelText('password-input'); // if we had a label
    // const inputElement = document.querySelector('input[type="password"]'); // direct DOM query
    // For testing library, if role is not textbox, it might be null or a generic role.
    // Let's try to find it by its type attribute if getByRole fails.
    const inputElement = document.querySelector('input[type="password"]');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "password");
  });

  it("should render with type 'number'", () => {
    render(<Input type="number" />);
    const inputElement = screen.getByRole("spinbutton"); // Role for input type="number"
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "number");
  });

  it("should render as disabled", () => {
    render(<Input disabled />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveClass("disabled:opacity-50 disabled:cursor-not-allowed");
  });

  it("should render with a placeholder", () => {
    const placeholderText = "Enter text here";
    render(<Input placeholder={placeholderText} />);
    const inputElement = screen.getByPlaceholderText(placeholderText);
    expect(inputElement).toBeInTheDocument();
  });

  it("should accept and apply a custom className", () => {
    const customClass = "my-custom-class";
    render(<Input className={customClass} />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveClass(customClass);
    // Check it also has the default classes
    expect(inputElement).toHaveClass("flex h-10 w-full rounded-md border border-input");
  });

  it("should pass through other HTML input props", () => {
    render(<Input maxLength={10} name="test-input" />);
    const inputElement = screen.getByRole("textbox") as HTMLInputElement;
    expect(inputElement.maxLength).toBe(10);
    expect(inputElement.name).toBe("test-input");
  });
});
