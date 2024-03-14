import { describe, it, expect, vi } from "vitest";
import { Faqs } from "./Faqs.jsx";
import { screen, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuthContext.jsx";
import { UserProvider } from "../hooks/useUserContext.jsx";
import { DiscsProvider } from "../hooks/useDiscContext.jsx";
import { CheckinsProvider } from "../hooks/useCheckinsContext.jsx";
import userEvent from "@testing-library/user-event";

describe("Testing Faqs component", () => {
  it("Should render Faqs component", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <CheckinsProvider>
          <AuthProvider>
            <DiscsProvider>
              <UserProvider>
                <Faqs />
              </UserProvider>
            </DiscsProvider>
          </AuthProvider>
        </CheckinsProvider>
      </BrowserRouter>
    );
    expect(
      await screen.findByText("Frequently Asked Questions")
    ).toBeInTheDocument();
    const faqLink1 = screen.getByText("What do I do with this disc?", {
      exact: false,
    });
    const faqLink2 = screen.getByText("Should I create an account?", {
      exact: false,
    });
    const faqLink3 = screen.getByText("How can I get involved?", {
      exact: false,
    });
    await user.click(faqLink1);
    expect(
      screen.getByText(
        "If you had found a disc, use the QR code or link printed on the disc to check the disc in on that course. Fill out the form with the course details and submit. Then take the disc to another course and leave it there. Simple as that."
      )
    ).toBeInTheDocument();
    await user.click(faqLink2);
    expect(
      screen.getByText(
        "Account creation is not required, however creating an account will let you manage your check in history and leave friendly notes when checking a disc in."
      )
    ).toBeInTheDocument();
    await user.click(faqLink3);
    expect(
      screen.getByText(
        "To inquire about how you can help or get set up with your own disc to track, you can send me an email:",
        { exact: false }
      )
    ).toBeInTheDocument();
  });
});
