import { describe, it, expect, vi } from "vitest";
import Disc from "./Disc.jsx";
import App from "../App.jsx";
import { screen, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { addMockApiRouteHandler } from "../../test-setup/mockServer.js";

describe("Testing Disc component", () => {
  it("Should render Disc component", async () => {
    const user = userEvent.setup();
    // mock the server api call to "/discs"
    addMockApiRouteHandler("get", "/discs", ({ request }) => {
      const discs = [
        {
          id: "Disc1",
          manufacturer: "Manufacturer1",
          plastic: "Plastic1",
          name: "Name1",
          imgUrl: "Url1",
        },
        {
          id: "Disc2",
          manufacturer: "Manufacturer2",
          plastic: "Plastic2",
          name: "Name2",
          imgUrl: "Url2",
        },
      ];
      return HttpResponse.json(discs);
    });
    // mock the server api call to /checkin/:id/stats
    addMockApiRouteHandler("get", "/checkin/Disc1/stats", ({ request }) => {
      const stats = {
        distance: 100,
        stateCount: 5,
        userCount: 3,
        countryCount: 2,
        courseCount: 10,
      };
      return HttpResponse.json(stats);
    });
    // mock the server api call to /checkin/:id
    addMockApiRouteHandler("get", "/checkin/Disc1", ({ request }) => {
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
    const menuBtn = screen.getByTestId("menu-icon");

    await user.click(menuBtn);
    const checkInBtn = screen.getByText("Check Ins");
    await user.click(checkInBtn);
    const viewBtn = screen.getAllByText("View")[0];
    await user.click(viewBtn);
    const miles = screen.getByText(`This disc has travelled`, { exact: false });
    const states = screen.getByText("Visited ", { exact: false });
    const courses = screen.getByText("Played on ", { exact: false });
    const users = screen.getByText("Checked in by ", { exact: false });
    const countries = screen.getByText("This disc has been to ", {
      exact: false,
    });
    // string matches API data:
    expect(miles.textContent).toEqual("This disc has travelled 100 miles!");
    expect(states.textContent).toEqual("Visited 5 states!");
    expect(courses.textContent).toEqual("Played on 10 courses!");
    expect(users.textContent).toEqual("Checked in by 3 users!");
    expect(countries.textContent).toEqual("This disc has been to 2 countries!");
    // string is in the document:
    expect(miles).toBeInTheDocument();
    expect(states).toBeInTheDocument();
    expect(courses).toBeInTheDocument();
    expect(users).toBeInTheDocument();
    expect(countries).toBeInTheDocument();
    // renders disc's check ins:
    expect(await screen.findByText("Fox Hill Park")).toBeInTheDocument();
    expect(screen.getByText(`Las Vegas`, { exact: false })).toBeInTheDocument();
  });
});
