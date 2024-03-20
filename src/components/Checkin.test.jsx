import { describe, it, expect, vi } from "vitest";
import App from "../App.jsx";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { addMockApiRouteHandler } from "../../test-setup/mockServer.js";

describe("Checkin Component Test", () => {
  it("Should render Checkin component & do check in", async () => {
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
    addMockApiRouteHandler("get", "/Disc1/stats", ({ request }) => {
      const stats = {
        distance: 100,
        stateCount: 5,
        userCount: 3,
        countryCount: 2,
        courseCount: 10,
      };
      return HttpResponse.json(stats);
    });
    // mock the server POST api call to /checkin/:id
    addMockApiRouteHandler("post", "/checkin/Disc1", ({ request }) => {
      const checkin = {
        username: "testuser",
        discId: "Disc1",
        courseName: "test-course",
        city: "test-city",
        state: "AL",
        zip: "01010",
        date: "2023-07-30 14:13:42.63782-04",
        country: "United States",
        latitude: "39.0893525",
        longitude: "-119.9390724",
        note: null,
      };
      return HttpResponse.json(checkin);
    });
    // mock the server api call to /courses
    addMockApiRouteHandler("get", "/courses", ({ request }) => {
      const courses = {
        next: {
          page: 2,
          limit: 5,
        },
        endPage: 2089,
        results: [
          {
            courseName: "10-3 at CB",
            city: "Mt. Crested Butte",
            state: "Colorado",
            zip: "81225",
            country: "United States",
            holes: 27,
            id: 1,
          },
          {
            courseName: "1000 Acres Ranch Disc Golf Course",
            city: "Stony Creek",
            state: "New York",
            zip: "12878",
            country: "United States",
            holes: 18,
            id: 2,
          },
          {
            courseName: "17 Wing",
            city: "Winnipeg",
            state: "Manitoba",
            zip: "R3J 3T3",
            country: "Canada",
            holes: 9,
            id: 3,
          },
          {
            courseName: "2022 Lucky Disc Golf Open Freeman North",
            city: "Idaho Falls",
            state: "Idaho",
            zip: "83402",
            country: "United States",
            holes: 18,
            id: 4,
          },
          {
            courseName: "22 Birdwalk",
            city: "Sundre",
            state: "Alberta",
            zip: "T0M",
            country: "Canada",
            holes: 9,
            id: 5,
          },
        ],
      };
      return HttpResponse.json(courses);
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
      <MemoryRouter initialEntries={["/checkin/Disc1"]}>
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
    // expect sign up modal
    expect(
      screen.getByText(
        "Creating an account will allow you to attach a note to your check in, and will let you follow your previously checked in discs."
      )
    ).toBeInTheDocument();
    const skipBtn = screen.getByText("Skip");
    await user.click(skipBtn);
    // expect check in form
    expect(
      screen.getByText(
        "Fill out the form below as completely as possible. You may find your course while typing the course name, click on desired course to auto-fill this form."
      )
    ).toBeInTheDocument();
    // testing suggested courses pop up on course name entry
    const courseNameInput = screen.getByLabelText("Course Name:");
    await user.type(courseNameInput, "abc");
    expect(
      screen.getByText("1000 Acres Ranch Disc Golf Course")
    ).toBeInTheDocument();
    // fill out form
    const countrySelect = screen.getByLabelText("Country:");
    const cityInput = screen.getByLabelText("City:");
    const stateSelect = screen.getByLabelText("State:");
    const zipInput = screen.getByLabelText("Zip:");
    await user.selectOptions(countrySelect, "United States");
    await user.type(cityInput, "test-city");
    await user.selectOptions(stateSelect, "Alabama");
    await user.type(zipInput, "01010");
    // submit form
    const submitBtn = screen.getByText("Submit");
    await user.click(submitBtn);
    expect(screen.getByText("Check in complete!")).toBeInTheDocument();
    // click confirm
    const confirmBtn = screen.getByText("Confirm");
    await user.click(confirmBtn);
  });
});
