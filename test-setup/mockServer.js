import { setupServer } from "msw/node";
import { http } from "msw";

export const mockServer = setupServer();

// create a function that mocks out a call to our API
// takes in a http type (get, post, etc), the URL path, and a callback.

export function addMockApiRouteHandler(type, path, cb) {
  mockServer.use(http[type](new URL(path, "http://localhost:3001").href, cb));
}
