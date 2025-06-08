import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useIsMobile, MOBILE_BREAKPOINT } from "./use-mobile"; // Assuming this path is correct

let mockMql: {
  matches: boolean;
  media: string;
  addListener: (callback: any) => void; // Deprecated, but for completeness
  removeListener: (callback: any) => void; // Deprecated
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};

let storedListener: ((event: { matches: boolean; media: string }) => void) | null = null;

beforeEach(() => {
  storedListener = null;
  mockMql = {
    matches: false, // Default to desktop
    media: `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    addListener: vi.fn((cb) => { // Fallback for older Safari, used by hook
        storedListener = cb;
    }),
    removeListener: vi.fn(), // Just a spy for addListener/removeListener fallback
    addEventListener: vi.fn((type, cb) => {
      if (type === 'change') {
        storedListener = cb; // Capture the listener
      }
    }),
    removeEventListener: vi.fn(), // This will be spied upon
  };
  vi.spyOn(window, "matchMedia").mockReturnValue(mockMql as any);
  // innerWidth mock is not strictly necessary if tests directly control mql.matches
  // but can be kept for completeness or if other parts of system use it.
  vi.spyOn(window, "innerWidth", "get").mockReturnValue(MOBILE_BREAKPOINT + 1);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useIsMobile hook", () => {
  it("should return true when initial state is mobile", async () => {
    mockMql.matches = true; // Set initial state for the MQL object
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(MOBILE_BREAKPOINT - 1);


    const { result } = renderHook(() => useIsMobile());

    // The hook initializes with undefined, then useEffect sets it.
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("should return false when initial state is desktop", async () => {
    mockMql.matches = false;
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(MOBILE_BREAKPOINT + 1);

    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => expect(result.current).toBe(false));
  });

  it("should update from desktop to mobile when resize event occurs", async () => {
    mockMql.matches = false; // Start desktop
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(MOBILE_BREAKPOINT + 1);
    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => expect(result.current).toBe(false)); // Initial state

    act(() => {
      mockMql.matches = true; // Simulate media query change
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(MOBILE_BREAKPOINT - 1);
      if (storedListener) {
        storedListener({ matches: true, media: mockMql.media });
      }
    });

    await waitFor(() => expect(result.current).toBe(true));
  });

  it("should update from mobile to desktop when resize event occurs", async () => {
    mockMql.matches = true; // Start mobile
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(MOBILE_BREAKPOINT - 1);
    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => expect(result.current).toBe(true)); // Initial state

    act(() => {
      mockMql.matches = false; // Simulate media query change
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(MOBILE_BREAKPOINT + 1);
      if (storedListener) {
        storedListener({ matches: false, media: mockMql.media });
      }
    });

    await waitFor(() => expect(result.current).toBe(false));
  });

  it("should clean up event listener on unmount", () => {
    mockMql.matches = true;
    const { unmount } = renderHook(() => useIsMobile());

    expect(mockMql.addEventListener).toHaveBeenCalledTimes(1);
    expect(mockMql.removeEventListener).not.toHaveBeenCalled(); // Initially not called

    unmount();

    expect(mockMql.removeEventListener).toHaveBeenCalledTimes(1);
    // Ensure the correct listener was removed (if possible to check instance, otherwise by call count is okay)
    expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', storedListener);
  });
});
