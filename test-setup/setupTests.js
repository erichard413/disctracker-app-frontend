import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { mockServer } from "./mockServer";

expect.extend(matchers);

beforeAll(() => {
  // if the request isn't manually "mocked", throw error to prevent test files from making API requests
  mockServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  //after every test is run, clean up everything from react testing library
  cleanup();
  //clear out all of our mocks after each test
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
