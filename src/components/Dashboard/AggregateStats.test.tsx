import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AggregateStats from "./AggregateStats";
import { InfluencerData } from "@/types/influencer";

// Mock recharts
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
    PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
    Pie: ({ children }: { children: React.ReactNode; }) => <div data-testid="pie-element">{children}</div>, // Mock children for Pie
    Cell: () => <div data-testid="cell-element" />,
    Tooltip: () => <div data-testid="tooltip-element" />,
    Legend: () => <div data-testid="legend-element" />,
    BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
    Bar: ({ children }: { children: React.ReactNode; }) => <div data-testid="bar-element">{children}</div>, // Mock children for Bar
    XAxis: () => <div data-testid="xaxis-element" />,
    YAxis: () => <div data-testid="yaxis-element" />,
    CartesianGrid: () => <div data-testid="cartesian-grid-element" />,
  };
});

const mockInfluencersValid: InfluencerData[] = [
  {
    id: "1",
    name: "Influencer A",
    platform: "instagram", // Lowercase as per component logic for platform split
    followerCount: 1200000,
    averageViews: 150000,
    averageReach: 140000,
    averageBrandedViews: 50000,
    genderSplit: { male: 60, female: 40, other: 0 },
    ageSplit: { "13-17": 0, "18-24": 30, "25-34": 50, "35-44": 20, "45-54": 0, "55+": 0 },
  },
  {
    id: "2",
    name: "Influencer B",
    platform: "youtube", // Lowercase
    followerCount: 500000,
    averageViews: 250000,
    averageReach: 230000,
    averageBrandedViews: 100000,
    genderSplit: { male: 50, female: 50, other: 0 },
    ageSplit: { "13-17": 0, "18-24": 40, "25-34": 40, "35-44": 20, "45-54": 0, "55+": 0 },
  },
  {
    id: "3",
    name: "Influencer C",
    platform: "instagram", // Lowercase
    followerCount: 100,
    averageViews: 80,
    averageReach: 70,
    averageBrandedViews: 20,
    genderSplit: { male: 70, female: 30, other: 0 },
    ageSplit: { "13-17": 10, "18-24": 60, "25-34": 30, "35-44": 0, "45-54": 0, "55+": 0 },
  },
];

const emptyMockInfluencers: InfluencerData[] = [];

describe("AggregateStats", () => {
  it("should render null if data array is empty", () => {
    const { container } = render(<AggregateStats data={emptyMockInfluencers} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if data prop is null", () => {
    const { container } = render(<AggregateStats data={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render null if data prop is undefined", () => {
    const { container } = render(<AggregateStats data={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it("should correctly calculate and display 'Total Influencers'", () => {
    render(<AggregateStats data={mockInfluencersValid} />);
    expect(screen.getByText("Total Influencers")).toBeInTheDocument();
    expect(screen.getByText(mockInfluencersValid.length.toString())).toBeInTheDocument();
  });

  it("should correctly calculate and display 'Total Followers'", () => {
    render(<AggregateStats data={mockInfluencersValid} />);
    expect(screen.getByText("Total Followers")).toBeInTheDocument();
    // 1200000 + 500000 + 100 = 1700100 -> 1.7M
    expect(screen.getByText("1.7M")).toBeInTheDocument();
  });

  it("should correctly display 'Total Followers' for smaller numbers", () => {
    const singleInfluencerK: InfluencerData[] = [{ ...mockInfluencersValid[1], followerCount: 500000 }];
    render(<AggregateStats data={singleInfluencerK} />);
    expect(screen.getByText("500.0K")).toBeInTheDocument(); // .toFixed(1)

    const singleInfluencerExact: InfluencerData[] = [{ ...mockInfluencersValid[2], followerCount: 100 }];
    render(<AggregateStats data={singleInfluencerExact} />);
    expect(screen.getByText("100")).toBeInTheDocument();

    const singleInfluencerAlmostMillion: InfluencerData[] = [{ ...mockInfluencersValid[0], followerCount: 999999 }];
    render(<AggregateStats data={singleInfluencerAlmostMillion} />);
    expect(screen.getByText("1000.0K")).toBeInTheDocument(); // (999999 / 1000).toFixed(1) = 1000.0K
  });

  it("should correctly calculate and display 'Avg. Views'", () => {
    render(<AggregateStats data={mockInfluencersValid} />);
    expect(screen.getByText("Avg. Views")).toBeInTheDocument();
    // (150000 + 250000 + 80) / 3 = 133360 (rounded) -> 133.4K
    expect(screen.getByText("133.4K")).toBeInTheDocument();
  });

  it("should correctly calculate and display 'Avg. Reach'", () => {
    render(<AggregateStats data={mockInfluencersValid} />);
    expect(screen.getByText("Avg. Reach")).toBeInTheDocument();
    // (140000 + 230000 + 70) / 3 = 123356.66... -> rounded to 123357 -> 123.4K
    expect(screen.getByText("123.4K")).toBeInTheDocument();
  });

  it("should correctly calculate and display 'Avg. Branded Views'", () => {
    render(<AggregateStats data={mockInfluencersValid} />);
    expect(screen.getByText("Branded")).toBeInTheDocument(); // Label is "Branded"
    // (50000 + 100000 + 20) / 3 = 50006.66... -> rounded to 50007 -> 50.0K
    expect(screen.getByText("50.0K")).toBeInTheDocument();
  });

  it("should render titles for charts", () => {
    render(<AggregateStats data={mockInfluencersValid} />);
    expect(screen.getByText("Platform Distribution")).toBeInTheDocument();
    expect(screen.getByText("Gender Demographics")).toBeInTheDocument();
    expect(screen.getByText("Age Distribution")).toBeInTheDocument();
  });

  it("should render mocked chart components including cells", () => {
    render(<AggregateStats data={mockInfluencersValid} />);
    expect(screen.getAllByTestId("responsive-container").length).toBeGreaterThanOrEqual(3); // One for each chart type block
    expect(screen.getAllByTestId("pie-chart").length).toBeGreaterThanOrEqual(2); // Platform and Gender
    expect(screen.getAllByTestId("pie-element").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThanOrEqual(1); // Age
    expect(screen.getAllByTestId("bar-element").length).toBeGreaterThanOrEqual(1);
    // Check for cells, assuming data is valid and map is called
    expect(screen.getAllByTestId("cell-element").length).toBeGreaterThanOrEqual(
      mockInfluencersValid[0].genderSplit.male > 0 ? 1:0 + // Platform cells
      mockInfluencersValid[0].genderSplit.female > 0 ? 1:0 +
      mockInfluencersValid[0].genderSplit.other > 0 ? 1:0 + // Gender cells
      Object.values(mockInfluencersValid[0].ageSplit).filter(v => v > 0).length // Age cells
    );
  });
});
