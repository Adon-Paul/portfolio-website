import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import App from "./App";
Object.defineProperty(window, "matchMedia", {
  value: () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }),
  configurable: true,
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
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
it("explains real LumiSense paths with an accurate selected indicator", () => {
  render(<App path="/" />);
  const local = screen.getByRole("button", { name: /read text/i });
  const scene = screen.getByRole("button", { name: /describe a scene/i });
  expect(local).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(scene);
  expect(scene).toHaveAttribute("aria-pressed", "true");
  expect(local).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("status")).toHaveTextContent(/provider choice/i);
  expect(
    screen.getByRole("link", { name: /explore lumisense/i }),
  ).toHaveAttribute("href", "/work/lumisense/");
});
it("puts both original demos on home and pauses the other player", () => {
  const pause = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  const { container } = render(<App path="/" />);
  expect(container.querySelectorAll("video")).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: /play melody demo/i }));
  const first = container.querySelector("video");
  fireEvent.click(
    screen.getByRole("button", { name: /play style transfer ai demo/i }),
  );
  const second = container.querySelectorAll("video")[1];
  fireEvent.play(second);
  expect(first).toHaveAttribute("src", "/videos/melody.mp4");
  expect(second).toHaveAttribute("src", "/videos/style-transfer-ai.mp4");
  expect(pause.mock.instances).toContain(first);
});
it("renders LumiSense with the owner's clarified implementation role", () => {
  render(<App path="/work/lumisense/" />);
  expect(
    screen.getByRole("heading", { level: 1, name: "LumiSense." }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/built the application with ai assistance/i),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view source/i })).toHaveAttribute(
    "href",
    "https://github.com/Adon-Paul/Lumisense",
  );
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
it("retries a failed demo only when requested", () => {
  const { container } = render(<App path="/work/melody/" />);
  fireEvent.click(screen.getByRole("button", { name: /play melody demo/i }));
  fireEvent.error(container.querySelector("video"));
  expect(container.querySelector("video")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /retry melody demo/i }));
  expect(container.querySelector("video")).toHaveFocus();
  expect(container.querySelector("video")).toHaveAttribute(
    "src",
    "/videos/melody.mp4",
  );
});
it("gives unknown URLs a useful way home", () => {
  render(<App path="/work/missing/" />);
  expect(
    screen.getByRole("heading", { level: 1, name: /page not found/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
    "href",
    "/",
  );
});
it("offers a text walkthrough alongside the silent recording", () => {
  render(<App path="/work/melody/" />);
  expect(screen.getByText("Read the demo walkthrough")).toBeInTheDocument();
  expect(screen.getByText(/opens with a splash screen/i)).toBeInTheDocument();
});
