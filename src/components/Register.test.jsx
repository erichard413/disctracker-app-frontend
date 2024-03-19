import { describe, it, expect, vi } from "vitest";
import App from "../App.jsx";
import Register from "./Register.jsx";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { addMockApiRouteHandler } from "../../test-setup/mockServer.js";

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
  it("Should sign up new user", async () => {
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
    addMockApiRouteHandler("post", "/auth/register", ({ request }) => {
      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlzU3VwZXJBZG1pbiI6ZmFsc2UsImlhdCI6MTcxMDc3MDg5OX0.V4ii4LfJtAZpVPf-nlIaaJZkHlMptJbgDQ6mIMkWKQk";
      return HttpResponse.json({ token: mockToken });
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
    const signUpLink = screen.getByText("Sign Up");
    await user.click(signUpLink);
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password:");
    const password2Input = screen.getByLabelText("Retype Password:");
    const firstNameInput = screen.getByLabelText("First Name:");
    const lastNameInput = screen.getByLabelText("Last Name:");
    const emailInput = screen.getByLabelText("Email:");
    await user.type(usernameInput, "testusername");
    await user.type(passwordInput, "testpassword");
    await user.type(password2Input, "testpassword");
    await user.type(firstNameInput, "first");
    await user.type(lastNameInput, "last");
    await user.type(emailInput, "test@test.com");
    const submitBtn = screen.getByTestId("register-btn");
    await user.click(submitBtn);
    expect(
      screen.getByText("Welcome Back, erichard", { exact: false })
    ).toBeInTheDocument();
    await user.click(menuBtn);
    const logOutLink = screen.getByText("Log Out");
    await user.click(logOutLink);
  });
  it("Should error on already created username", async () => {
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
    // mock the server api call to "/users/:username"
    addMockApiRouteHandler("get", "/users/:username", ({ request }) => {
      const userData = {
        username: "erichard",
        firstName: "Erika",
        lastName: "Richard",
        joinDate: "2023-05-18 12:45:25.865171-04",
        imgUrl: null,
      };
      return HttpResponse.status(400);
    });
    // mock register post request error
    addMockApiRouteHandler("post", "/auth/register", ({ request }) => {
      const mockError = {
        data: {
          error: {
            message: "Username testusername already exists!",
            status: 400,
          },
        },
        status: 400,
      };

      return HttpResponse.json(mockError);
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
    const signUpLink = screen.getByText("Sign Up");
    await user.click(signUpLink);
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password:");
    const password2Input = screen.getByLabelText("Retype Password:");
    const firstNameInput = screen.getByLabelText("First Name:");
    const lastNameInput = screen.getByLabelText("Last Name:");
    const emailInput = screen.getByLabelText("Email:");
    await user.type(usernameInput, "testusername");
    await user.type(passwordInput, "testpassword");
    await user.type(password2Input, "testpassword");
    await user.type(firstNameInput, "first");
    await user.type(lastNameInput, "last");
    await user.type(emailInput, "test@test.com");
    const submitBtn = screen.getByTestId("register-btn");
    await user.click(submitBtn);

    expect(
      await screen.findByText("Username testusername already exists!")
    ).toBeInTheDocument();
  });
  it("Should error on already used email", async () => {
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
    // mock the server api call to "/users/:username"
    addMockApiRouteHandler("get", "/users/:username", ({ request }) => {
      const userData = {
        username: "erichard",
        firstName: "Erika",
        lastName: "Richard",
        joinDate: "2023-05-18 12:45:25.865171-04",
        imgUrl: null,
      };
      return HttpResponse.status(400);
    });
    // mock register post request error
    addMockApiRouteHandler("post", "/auth/register", ({ request }) => {
      const mockError = {
        data: {
          error: {
            message:
              "Email test@12345.com is already associated with an account!",
            status: 400,
          },
        },
        status: 400,
      };

      return HttpResponse.json(mockError);
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
    const signUpLink = screen.getByText("Sign Up");
    await user.click(signUpLink);
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password:");
    const password2Input = screen.getByLabelText("Retype Password:");
    const firstNameInput = screen.getByLabelText("First Name:");
    const lastNameInput = screen.getByLabelText("Last Name:");
    const emailInput = screen.getByLabelText("Email:");
    await user.type(usernameInput, "testusername");
    await user.type(passwordInput, "testpassword");
    await user.type(password2Input, "testpassword");
    await user.type(firstNameInput, "first");
    await user.type(lastNameInput, "last");
    await user.type(emailInput, "test@12345.com");
    const submitBtn = screen.getByTestId("register-btn");
    await user.click(submitBtn);

    expect(
      await screen.findByText(
        "Email test@12345.com is already associated with an account!"
      )
    ).toBeInTheDocument();
  });
});
