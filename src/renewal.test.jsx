import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import App from "./App";
Object.defineProperty(window, "matchMedia", {
  value: () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }),
  configurable: true,
});
afterEach(cleanup);
it("makes work and contact reachable immediately without a theme gate", () => {
  render(<App path="/" />);
  expect(
    screen.getByRole("navigation").querySelector('a[href="/#work"]'),
  ).toBeTruthy();
  expect(screen.getByRole("link", { name: /explore melody/i })).toHaveAttribute(
    "href",
    "/work/melody/",
  );
  expect(
    screen.getByRole("link", { name: /adonpaultomy@gmail.com/i }),
  ).toHaveAttribute("href", "mailto:adonpaultomy@gmail.com");
});
it("renders a direct project URL with its own evidence link", () => {
  render(<App path="/work/melody/" />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Melody." }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view source/i })).toHaveAttribute(
    "href",
    "https://github.com/Adon-Paul/melody",
  );
});
it("reveals engineering notes without removing the project link", () => {
  render(<App path="/" />);
  const toggle = screen.getByRole("button", { name: /under the hood/i });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText(/one queue, two views/i)).toBeVisible();
  expect(screen.getByRole("link", { name: /explore melody/i })).toBeVisible();
});
it("does not load video until the visitor requests playback and recovers from failure", () => {
  const { container } = render(<App path="/work/melody/" />);
  expect(container.querySelector("video")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /play melody demo/i }));
  const video = container.querySelector("video");
  expect(video).toHaveAttribute("controls");
  expect(video).toHaveFocus();
  expect(video).toHaveAttribute("src", "/videos/melody.mp4");
  fireEvent.error(video);
  expect(screen.getByText(/video could not load/i)).toBeVisible();
  expect(
    screen.getByRole("link", { name: /download the demo/i }),
  ).toHaveFocus();
  expect(
    screen.getByRole("link", { name: /download the demo/i }),
  ).toBeVisible();
});
it("gives unknown URLs a useful way home", () => {
  render(<App path="/work/missing/" />);
  expect(
    screen.getByRole("heading", { level: 1, name: /page not found/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /back to the workshop/i }),
  ).toHaveAttribute("href", "/");
});
it("offers a text walkthrough alongside the silent recording", () => {
  render(<App path="/work/melody/" />);
  expect(screen.getByText("Read the demo walkthrough")).toBeInTheDocument();
  expect(screen.getByText(/opens with a splash screen/i)).toBeInTheDocument();
});
