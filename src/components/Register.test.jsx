import { describe, it, expect, vi } from "vitest";
import Register from "./Register.jsx";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";

describe("Register component", () => {
  it("Should render Register component", async () => {
    render(
      <MemoryRouter>
        <CheckinsProvider>
          <AuthProvider>
            <DiscsProvider>
              <UserProvider>
                <Register />
              </UserProvider>
            </DiscsProvider>
          </AuthProvider>
        </CheckinsProvider>
      </MemoryRouter>
    );
    expect(await screen.findByText("Create Account")).toBeInTheDocument();
    expect(screen.queryByText("Notindocument")).not.toBeInTheDocument();
  });
});
