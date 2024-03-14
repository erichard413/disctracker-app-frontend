import { describe, it, expect, vi } from "vitest";
import UserPage from "./UserPage.jsx";
import { screen, render } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { addMockApiRouteHandler } from "../../test-setup/mockServer.js";
import App from "../App.jsx";

describe("Testing UserPage component", () => {
  it("Should render user page", () => {
    // mock the server api call to /checkin/:id

    addMockApiRouteHandler("get", `/users`, ({ request }) => {
      const user = {
        username: "testuser",
        firstName: "test",
        lastName: "user",
        joinDate: `${new Date()}`,
      };
      return HttpResponse.json(user);
    });
    render(
      <BrowserRouter>
        <CheckinsProvider>
          <AuthProvider>
            <DiscsProvider>
              <UserProvider>
                <Routes>
                  <Route path="/users/:userId" />
                </Routes>
              </UserProvider>
            </DiscsProvider>
          </AuthProvider>
        </CheckinsProvider>
      </BrowserRouter>
    );
  });
});
