import { describe, it, expect, vi } from "vitest";
import App from "./App";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuthContext.jsx";
import { UserProvider } from "./hooks/useUserContext.jsx";
import { DiscsProvider } from "./hooks/useDiscContext.jsx";
import { CheckinsProvider } from "./hooks/useCheckinsContext.jsx";
import { mockServer } from "../test-setup/mockServer.js";
import { http } from "msw";

const apiBaseUrl = "http://localhost:3001";

describe("App component", () => {
  // intercept the api request, and "do" something with it.

  it("should render App component", async () => {
    mockServer.use(
      http.get(`${apiBaseUrl}/discs`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: "1",
              manufacturer: "Manufacturer1",
              plastic: "Plastic1",
              name: "Name1",
              imgUrl: "Url1",
            },
            {
              id: "2",
              manufacturer: "Manufacturer2",
              plastic: "Plastic2",
              name: "Name2",
              imgUrl: "Url2",
            },
          ])
        );
      })
    );
    render(
      <BrowserRouter>
        <CheckinsProvider>
          <AuthProvider>
            <DiscsProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </DiscsProvider>
          </AuthProvider>
        </CheckinsProvider>
      </BrowserRouter>
    );
    expect(
      await screen.findByText("Welcome to the Traveling Disc Project")
    ).toBeInTheDocument();
    expect(screen.queryByText("Notindocument")).not.toBeInTheDocument();
  });
});
