import React, { useState } from "react";
import "../css/FAQSection.css";

const FAQSection = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I post a job listing?",
      answer:
        "To post a job listing, sign up as an employer, complete your company profile, and submit a job post with the required details. Once approved, it will be visible to applicants.",
    },
    {
      question: "How can I manage applications?",
      answer:
        "You can view and manage applications through your mail. You can shortlist, reject, or contact applicants directly.",
    },
    {
      question: "How do I approve an applicant?",
      answer:
        "Candidates wil be mailed to you, once you find a suitable candidate, you can approve them by sending an offer contacting them directly.",
    },
    {
      question: "Is there a fee for posting a job?",
      answer:
        "Yes, employers need to make a payment via QR code before submitting a job post. The post will be reviewed and approved by an admin before being listed.",
    },
    {
      question: "How long does it take for my job post to be approved?",
      answer:
        "Job posts are usually reviewed within 24 hours. However, this may vary depending on the workload of our team.",
    },
  ];

  return (
    <div className="faq-section">
      <h2 className="faq-title">FAQs</h2>
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
