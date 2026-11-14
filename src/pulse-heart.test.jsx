import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import PulseHeart from "./components/PulseHeart";

afterEach(cleanup);
it("toggles a real zero-based count with keyboard-style activation", () => {
  const change = vi.fn();
  render(
    <PulseHeart count={0} onChange={change} label="Like this portfolio" />,
  );
  const button = screen.getByRole("button", { name: "Like this portfolio, 0" });
  fireEvent.click(button, { detail: 0 });
  expect(button).toHaveAttribute("aria-pressed", "true");
  expect(change).toHaveBeenLastCalledWith(true, 1);
  expect(button).toHaveAccessibleName("Like this portfolio, 1");
  fireEvent.click(button, { detail: 0 });
  expect(button).toHaveAttribute("aria-pressed", "false");
  expect(change).toHaveBeenLastCalledWith(false, 0);
});
it("respects disabled state", () => {
  const change = vi.fn();
  render(<PulseHeart disabled count={0} onChange={change} />);
  fireEvent.click(screen.getByRole("button"));
  expect(change).not.toHaveBeenCalled();
});
