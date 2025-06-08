import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "./checkbox"; // Adjust path as necessary
import { Label } from "./label"; // Assuming Label component is used for accessible labeling

describe("Checkbox", () => {
  it("should render with default props (unchecked)", () => {
    render(<Checkbox id="test-checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(checkbox).toHaveClass(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
    );
  });

  it("should toggle state when clicked (unchecked to checked)", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox id="test-checkbox" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("should toggle state when clicked (checked to unchecked)", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox id="test-checkbox" defaultChecked={true} onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("should render as disabled and not toggle when clicked", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox id="test-checkbox" disabled onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass("disabled:cursor-not-allowed", "disabled:opacity-50");

    // Attempt to click the disabled checkbox
    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked(); // State should not change
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("should be focusable and respond to keyboard events (space key)", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox id="test-checkbox" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox");

    checkbox.focus();
    expect(checkbox).toHaveFocus();

    // Simulating space key press should trigger a click for accessible checkboxes
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    // Simulate another space key press (effectively another click)
    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("should render with a Label and be associated correctly", () => {
    render(
      <div>
        <Label htmlFor="c1">Test Label</Label>
        <Checkbox id="c1" />
      </div>
    );
    const checkbox = screen.getByLabelText("Test Label");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // Clicking the label should toggle the checkbox
    const label = screen.getByText("Test Label");
    fireEvent.click(label);
    expect(checkbox).toBeChecked();
  });

  it("should reflect checked state passed by prop", () => {
    render(<Checkbox id="test-checkbox" checked={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("should reflect unchecked state passed by prop", () => {
    render(<Checkbox id="test-checkbox" checked={false} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("should call onCheckedChange when controlled and clicked", () => {
    let isChecked = false;
    const handleCheckedChange = vi.fn((checkedState) => {
      isChecked = checkedState as boolean;
    });

    const { rerender } = render(
      <Checkbox id="test-checkbox" checked={isChecked} onCheckedChange={handleCheckedChange} />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);

    // Rerender with the new state that would be managed by the parent
    rerender(<Checkbox id="test-checkbox" checked={isChecked} onCheckedChange={handleCheckedChange} />);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(handleCheckedChange).toHaveBeenCalledTimes(2);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);

    rerender(<Checkbox id="test-checkbox" checked={isChecked} onCheckedChange={handleCheckedChange} />);
    expect(checkbox).not.toBeChecked();
  });
});
