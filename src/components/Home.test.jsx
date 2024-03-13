import { describe, it, expect, vi } from "vitest";
import Home from "./Home";
import { screen, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";

it("Should render Home component", async () => {
  render(
    <BrowserRouter>
      <CheckinsProvider>
        <AuthProvider>
          <DiscsProvider>
            <UserProvider>
              <Home />
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
