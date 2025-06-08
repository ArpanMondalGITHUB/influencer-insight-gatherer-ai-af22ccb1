import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card"; // Adjust path as necessary

describe("Card Components", () => {
  describe("Card", () => {
    it("should render an empty card with default classes", () => {
      render(<Card data-testid="card" />);
      const cardElement = screen.getByTestId("card");
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveClass(
        "rounded-lg border bg-card text-card-foreground shadow-sm"
      );
    });

    it("should apply custom className to Card", () => {
      render(<Card data-testid="card" className="custom-card-class" />);
      const cardElement = screen.getByTestId("card");
      expect(cardElement).toHaveClass("custom-card-class");
      expect(cardElement).toHaveClass(
        "rounded-lg border bg-card text-card-foreground shadow-sm"
      );
    });
  });

  describe("CardHeader", () => {
    it("should render CardHeader with default classes", () => {
      render(<CardHeader data-testid="card-header" />);
      const headerElement = screen.getByTestId("card-header");
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toHaveClass("flex flex-col space-y-1.5 p-6");
    });

    it("should apply custom className to CardHeader", () => {
      render(<CardHeader data-testid="card-header" className="custom-header-class" />);
      const headerElement = screen.getByTestId("card-header");
      expect(headerElement).toHaveClass("custom-header-class");
      expect(headerElement).toHaveClass("flex flex-col space-y-1.5 p-6");
    });
  });

  describe("CardTitle", () => {
    it("should render CardTitle with default classes and content", () => {
      render(<CardTitle data-testid="card-title">My Title</CardTitle>);
      const titleElement = screen.getByTestId("card-title");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.tagName).toBe("H3"); // Default is h3
      expect(titleElement).toHaveTextContent("My Title");
      expect(titleElement).toHaveClass("text-2xl font-semibold leading-none tracking-tight");
    });

    it("should apply custom className to CardTitle", () => {
      render(<CardTitle data-testid="card-title" className="custom-title-class">My Title</CardTitle>);
      const titleElement = screen.getByTestId("card-title");
      expect(titleElement).toHaveClass("custom-title-class");
      expect(titleElement).toHaveClass("text-2xl font-semibold leading-none tracking-tight");
    });
  });

  describe("CardDescription", () => {
    it("should render CardDescription with default classes and content", () => {
      render(<CardDescription data-testid="card-description">My Description</CardDescription>);
      const descriptionElement = screen.getByTestId("card-description");
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement.tagName).toBe("P"); // Default is p
      expect(descriptionElement).toHaveTextContent("My Description");
      expect(descriptionElement).toHaveClass("text-sm text-muted-foreground");
    });

    it("should apply custom className to CardDescription", () => {
      render(<CardDescription data-testid="card-description" className="custom-description-class">My Description</CardDescription>);
      const descriptionElement = screen.getByTestId("card-description");
      expect(descriptionElement).toHaveClass("custom-description-class");
      expect(descriptionElement).toHaveClass("text-sm text-muted-foreground");
    });
  });

  describe("CardContent", () => {
    it("should render CardContent with default classes", () => {
      render(<CardContent data-testid="card-content" />);
      const contentElement = screen.getByTestId("card-content");
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveClass("p-6 pt-0");
    });

    it("should apply custom className to CardContent", () => {
      render(<CardContent data-testid="card-content" className="custom-content-class" />);
      const contentElement = screen.getByTestId("card-content");
      expect(contentElement).toHaveClass("custom-content-class");
      expect(contentElement).toHaveClass("p-6 pt-0");
    });
  });

  describe("CardFooter", () => {
    it("should render CardFooter with default classes", () => {
      render(<CardFooter data-testid="card-footer" />);
      const footerElement = screen.getByTestId("card-footer");
      expect(footerElement).toBeInTheDocument();
      expect(footerElement).toHaveClass("flex items-center p-6 pt-0");
    });

    it("should apply custom className to CardFooter", () => {
      render(<CardFooter data-testid="card-footer" className="custom-footer-class" />);
      const footerElement = screen.getByTestId("card-footer");
      expect(footerElement).toHaveClass("custom-footer-class");
      expect(footerElement).toHaveClass("flex items-center p-6 pt-0");
    });
  });

  describe("Combined Card", () => {
    it("should render a Card with Header (Title, Description), Content, and Footer", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card Title</CardTitle>
            <CardDescription>This is a test description.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the card content.</p>
          </CardContent>
          <CardFooter>
            <p>This is the card footer.</p>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Test Card Title")).toBeInTheDocument();
      expect(screen.getByText("This is a test description.")).toBeInTheDocument();
      expect(screen.getByText("This is the card content.")).toBeInTheDocument();
      expect(screen.getByText("This is the card footer.")).toBeInTheDocument();

      // Check if parent components are there
      const cardElement = screen.getByText("Test Card Title").closest('[class*="rounded-lg border bg-card"]');
      expect(cardElement).toBeInTheDocument();

      const headerElement = screen.getByText("Test Card Title").closest('[class*="flex flex-col space-y-1.5 p-6"]');
      expect(headerElement).toBeInTheDocument();

      const contentElement = screen.getByText("This is the card content.").closest('[class*="p-6 pt-0"]');
      // Ensure CardHeader is followed by CardContent
      expect(headerElement?.nextElementSibling).toEqual(contentElement);


      const footerElement = screen.getByText("This is the card footer.").closest('[class*="flex items-center p-6 pt-0"]');
      expect(footerElement).toBeInTheDocument();
    });

    it("should render CardHeader without title/description", () => {
      render(<CardHeader data-testid="empty-header"><p>Child</p></CardHeader>);
      expect(screen.getByTestId("empty-header")).toBeInTheDocument();
      expect(screen.getByText("Child")).toBeInTheDocument();
    });

    it("should render CardContent with children", () => {
        render(<CardContent><div>Content Child</div></CardContent>);
        expect(screen.getByText("Content Child")).toBeInTheDocument();
    });

    it("should render CardFooter with children", () => {
        render(<CardFooter><div>Footer Child</div></CardFooter>);
        expect(screen.getByText("Footer Child")).toBeInTheDocument();
    });
  });
});
