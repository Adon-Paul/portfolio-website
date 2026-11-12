import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, it, expect } from "vitest";
import App from "./App";
afterEach(cleanup);
it("lets a visitor pause and resume all decorative motion", () => {
  const { container } = render(<App />);
  const button = screen.getByRole("button", { name: "Pause motion" });
  fireEvent.click(button);
  expect(container.querySelector("[data-motion]")).toHaveAttribute(
    "data-motion",
    "paused",
  );
  fireEvent.click(screen.getByRole("button", { name: "Resume motion" }));
  expect(container.querySelector("[data-motion]")).toHaveAttribute(
    "data-motion",
    "running",
  );
});
it("keeps both playback views on the same selected queue item", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Select Track 02" }));
  expect(screen.getByTestId("queue-full")).toHaveTextContent("Track 02");
  expect(screen.getByTestId("queue-mini")).toHaveTextContent("Track 02");
  fireEvent.click(screen.getByRole("button", { name: "Next track" }));
  expect(screen.getByTestId("queue-full")).toHaveTextContent("Track 03");
  expect(screen.getByTestId("queue-mini")).toHaveTextContent("Track 03");
});
it("counts the editable text and handles empty input without invalid numbers", () => {
  render(<App />);
  const input = screen.getByLabelText("Text to inspect");
  fireEvent.change(input, {
    target: { value: "Build carefully. Ask better questions!" },
  });
  expect(screen.getByTestId("word-count")).toHaveTextContent("5");
  expect(screen.getByTestId("sentence-count")).toHaveTextContent("2");
  expect(screen.getByTestId("sentence-length")).toHaveTextContent("2.5");
  fireEvent.change(input, { target: { value: "   " } });
  expect(screen.getByTestId("word-count")).toHaveTextContent("0");
  expect(screen.getByTestId("sentence-length")).toHaveTextContent("0");
});
