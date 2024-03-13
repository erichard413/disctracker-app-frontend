import { describe, it, expect, vi } from "vitest";
import NavBar from "./NavBar.jsx";
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

describe("Nav component", () => {
  it("Should render Nav component", async () => {
    render(
      <BrowserRouter>
        <CheckinsProvider>
          <AuthProvider>
            <DiscsProvider>
              <UserProvider>
                <NavBar />
              </UserProvider>
            </DiscsProvider>
          </AuthProvider>
        </CheckinsProvider>
      </BrowserRouter>
    );
    expect(screen.queryByText("Checkins")).not.toBeInTheDocument();
  });
  it("Should show nav display on menu click", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <CheckinsProvider>
          <AuthProvider>
            <DiscsProvider>
              <UserProvider>
                <NavBar />
              </UserProvider>
            </DiscsProvider>
          </AuthProvider>
        </CheckinsProvider>
      </BrowserRouter>
    );
    const menuBtn = screen.getByTestId("menu-icon");
    // handle nav open
    await user.click(menuBtn);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("FAQs")).toBeInTheDocument();
    expect(screen.getByText("Check Ins")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });
  it("Should navigate to FAQ page", async () => {
    const user = userEvent.setup();
    // mock the server api call
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
    // handle nav open
    await user.click(menuBtn);
    const faqLink = screen.getByText("FAQs");

    await user.click(faqLink);
    expect(
      await screen.findByText("Frequently Asked Questions")
    ).toBeInTheDocument();
  });
  it("should navigate to checkins page", async () => {
    const user = userEvent.setup();
    // mock the server api call
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
    const checkinLink = screen.getByText("Check Ins");
    // test checkin click:
    await user.click(menuBtn);
    await user.click(checkinLink);
    expect(await screen.findByText("Select Disc")).toBeInTheDocument();
    // expect to see discs retrieved from the API:
    expect(screen.getByText("Manufacturer1 - Name1")).toBeInTheDocument();
    expect(screen.getByText("Manufacturer2 - Name2")).toBeInTheDocument();
  });
  it("should navigate to sign up page", async () => {
    const user = userEvent.setup();
    // mock the server api call
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
    // handle nav open
    await user.click(menuBtn);
    const signupLink = screen.getByText("Sign Up");
    await user.click(signupLink);
    expect(await screen.findByText("Create Account")).toBeInTheDocument();
  });
  it("should navigate to log in page", async () => {
    const user = userEvent.setup();
    // mock the server api call
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

    // test log in link:
    await user.click(menuBtn);
    const loginLink = screen.getByText("Log In");
    await user.click(loginLink);

    expect(screen.getByLabelText("Username:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
  });
});
