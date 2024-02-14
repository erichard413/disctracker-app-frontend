import "../stylesheets/Faqs.css";
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

export function Faqs() {
  return (
    <div className="Faqs">
      <h2>Frequently Asked Questions</h2>
      {frequentlyAskedQuestions.map(q => (
        <Faq key={crypto.randomUUID()} faq={q} />
      ))}
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
