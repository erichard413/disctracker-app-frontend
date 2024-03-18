import { describe, it, expect, vi } from "vitest";
import Login from "./Login.jsx";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";
import { HttpResponse } from "msw";
import { addMockApiRouteHandler } from "../../test-setup/mockServer.js";
import userEvent from "@testing-library/user-event";
import App from "../App.jsx";

describe("Login component", () => {
  it("Should render Login component", async () => {
    render(
      <MemoryRouter>
        <CheckinsProvider>
          <AuthProvider>
            <DiscsProvider>
              <UserProvider>
                <Login />
              </UserProvider>
            </DiscsProvider>
          </AuthProvider>
        </CheckinsProvider>
      </MemoryRouter>
    );
    expect(
      await screen.findByText("Let's get you logged in.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Notindocument")).not.toBeInTheDocument();
  });
  it("Should do log in", async () => {
    const user = userEvent.setup();
    // mock the server api call to "/users/:username"
    addMockApiRouteHandler("get", "/users/:username", ({ request }) => {
      const userData = {
        username: "erichard",
        firstName: "Erika",
        lastName: "Richard",
        joinDate: "2023-05-18 12:45:25.865171-04",
        imgUrl: null,
      };
      return HttpResponse.json(userData);
    });
    addMockApiRouteHandler("post", "/auth/token", ({ request }) => {
      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlzU3VwZXJBZG1pbiI6ZmFsc2UsImlhdCI6MTcxMDc3MDg5OX0.V4ii4LfJtAZpVPf-nlIaaJZkHlMptJbgDQ6mIMkWKQk";
      return HttpResponse.json({ token: mockToken });
    });
    render(
      <MemoryRouter>
        <CheckinsProvider>
          <AuthProvider>
            <DiscsProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </DiscsProvider>
          </AuthProvider>
        </CheckinsProvider>
      </MemoryRouter>
    );
    const menuBtn = screen.getByTestId("menu-icon");

    await user.click(menuBtn);
    const logInLink = screen.getByText("Log In");
    await user.click(logInLink);
    const loginBtn = screen.getByTestId("login-btn");
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password:");
    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password");
    await user.click(loginBtn);
    expect(
      screen.getByText("Welcome back", { exact: false })
    ).toBeInTheDocument();
  });
});
