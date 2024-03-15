import { describe, it, expect, vi } from "vitest";
import UserPage from "./UserPage.jsx";
import { screen, render } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { create } from "react-test-renderer";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { addMockApiRouteHandler } from "../../test-setup/mockServer.js";
import App from "../App.jsx";

describe("Testing UserPage component", () => {
  it("Should render user page", async () => {
    const user = userEvent.setup();
    addMockApiRouteHandler("get", `/users/user1`, ({ request }) => {
      const user = {
        username: "user1",
        firstName: "test",
        lastName: "user",
        joinDate: "2024-03-15T14:24:38.863Z",
      };
      return HttpResponse.json(user);
    });
    addMockApiRouteHandler("get", `/discs`, ({ request }) => {
      const discs = [
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
      ];
      return HttpResponse.json(discs);
    });
    // mock the server api call to /checkin/:id/stats
    addMockApiRouteHandler("get", "/checkin/1/stats", ({ request }) => {
      const stats = {
        distance: 100,
        stateCount: 5,
        userCount: 3,
        countryCount: 2,
        courseCount: 10,
      };
      return HttpResponse.json(stats);
    });
    addMockApiRouteHandler("get", `/checkin/user/user1`, ({ request }) => {
      const checkins = {
        results: [
          {
            username: "user1",
            id: 12,
            discId: "1",
            courseName: "Fox Hill Park",
            city: "Las Vegas",
            state: "Nevada",
            zip: "89138",
            date: "2023-07-16 15:42:31.195155-04",
            country: "United States",
            latitude: "36.17509125",
            longitude: "-115.36179866516109",
            note: null,
          },
        ],
      };
      return HttpResponse.json(checkins);
    });
    // mock the server api call to /checkin/:id
    addMockApiRouteHandler("get", "/checkin/1", ({ request }) => {
      const checkins = {
        next: {
          page: 2,
          limit: 2,
        },
        endPage: 13,
        results: [
          {
            username: "user1",
            id: 12,
            discId: "1",
            courseName: "Fox Hill Park",
            city: "Las Vegas",
            state: "Nevada",
            zip: "89138",
            date: "2023-07-16 15:42:31.195155-04",
            country: "United States",
            latitude: "36.17509125",
            longitude: "-115.36179866516109",
            note: null,
          },
        ],
      };

      return HttpResponse.json(checkins);
    });
    render(
      // memory router is required for testing in a node environment
      <MemoryRouter initialEntries={["/users/user1"]}>
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
    // renders user's check ins:
    expect(await screen.findByText("Fox Hill Park")).toBeInTheDocument();
    expect(screen.getByText(`Las Vegas`, { exact: false })).toBeInTheDocument();
    // renders user's information:
    expect(screen.getByText("First Name: test")).toBeInTheDocument();
    expect(screen.getByText("Last Name: user")).toBeInTheDocument();
  });
});
