import React, { useState } from "react";
import "../css/FAQSection.css";

const FAQSection = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I apply for a job?",
      answer:
        "You can apply for a job by signing up on our platform, filling out your profile, and submitting your application to open job listings.",
    },
    {
      question: "Can I edit my application after submitting it?",
      answer:
        "Unfortunately, once you submit your application, it cannot be edited. Ensure all information is accurate before submission.",
    },
    {
      question: "How do I know if my application was selected?",
      answer:
        "You will receive an email confirmation once your application has been selected.",
    },
    {
      question: "Can I apply for multiple jobs at the same time?",
      answer:
        "Yes, you can apply to multiple job postings that match your skills and qualifications.",
    },
    {
      question: "Will I get notified if I'm rejected?",
      answer:
        "You might recieve a call or e-mail. However, if a candidate is not selected , they might not be contacted as well.",
    },
  ];

  return (
    <div className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-items">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className={`faq-question ${
                openQuestion === index ? "active" : ""
              }`}
              onClick={() => toggleQuestion(index)}
            >
              {faq.question}
              <span className="faq-toggle">
                {openQuestion === index ? "-" : "+"}
              </span>
            </div>
            {openQuestion === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
