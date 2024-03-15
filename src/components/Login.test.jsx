import { describe, it, expect, vi } from "vitest";
import Login from "./Login.jsx";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";

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
});
