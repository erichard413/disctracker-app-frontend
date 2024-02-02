import "../stylesheets/About.css";
import { useState } from "react";

const frequentlyAskedQuestions = [
  {
    question: "What do I do with this disc?",
    answer:
      "If you had found a disc, use the QR code or link printed on the disc to check the disc in on that course. Fill out the form with the course details and submit. Then take the disc to another course and leave it there. Simple as that.",
  },
  {
    question: "Should I create an account?",
    answer:
      "Account creation is not required, however creating an account will let you manage your check in history and leave friendly notes when checking a disc in.",
  },
  {
    question: "How can I get involved?",
    answer: (
      <>
        To inquire about how you can help or get set up with your own disc to
        track, you can send me an email:{" "}
        <a href="mailto:erik@travelingdisc.com">erik@travelingdisc.com</a>
      </>
    ),
  },
];

export function About() {
  return (
    <div className="About">
      <h2>Welcome to the Traveling Disc Project</h2>
      <div className="about-content">
        <p>
          Every disc golfer knows the pain of losing a disc. Hopefully you had
          your name and number on the disc in the hopes that whoever finds it
          decides to return it. Far too often, the finder decides to hold on to
          the disc and ends up losing it. This results in getting a text about a
          disc you've lost months ago from someone who had found it on a course
          you've never played in a state that you've never been to!
        </p>
        <p>
          At least this has been my experience, which has piqued my curiousity.
          How far can a disc can travel? This thought sparked the idea to create
          this website, to do just that.
        </p>
      </div>
      <div className="faq-container">
        <h3>Frequently Asked Questions</h3>
        {frequentlyAskedQuestions.map(q => (
          <Faq key={crypto.randomUUID()} faq={q} />
        ))}
      </div>
    </div>
  );
}

function Faq({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="Faq">
      <div
        className="faq-question"
        onClick={() => {
          setOpen(o => !o);
        }}
      >
        [{open ? "-" : "+"}] {faq.question}
      </div>
      {open && <div className="faq-answer">{faq.answer}</div>}
    </div>
  );
}
