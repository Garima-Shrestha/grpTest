import React from "react";
import "../css/Prep.css";

const Prep = () => {
  const videoData = [
    { link: "https://www.youtube.com/embed/OLVUrgQ_BbA", title: "How To Introduce Yourself?" },
    { link: "https://www.youtube.com/embed/fr-mwiyhZAo", title: "Top 21 Questions In Interview" },
    { link: "https://www.youtube.com/embed/Tt08KmFfIYQ", title: "How To Make An Effective CV?" },
    { link: "https://www.youtube.com/embed/jCApylZufJY", title: "English For Career Development" },
    { link: "https://www.youtube.com/embed/0gUgm4zB2F4", title: "SoftSkills For Career" },
    { link: "https://www.youtube.com/embed/O3m14PVOq_g", title: "How To Choose A Right Career?" },
    { link: "https://www.youtube.com/embed/lGWhbfr5s1Y", title: "Microsoft Interview Q&A" },
    { link: "https://www.youtube.com/embed/EWSuMW5IarU", title: "How To Make A LinkedIn Profile" },
  ];
  const externalLinks = [
    {
      url: "https://www.indeed.com/career-advice/interviewing",
      text: "Indeed - Interview Tips",
      description: "A comprehensive guide with tips for preparing for interviews and handling common questions.",
    },
    {
      url: "https://www.themuse.com/advice/interview-preparation-tips",
      text: "The Muse - Interview Tips",
      description: "Practical advice on behavioral, technical, and virtual interviews from career experts.",
    },
    {
      url: "https://leetcode.com/",
      text: "LeetCode",
      description: "A platform to practice coding challenges and prepare for technical interviews.",
    },
    {
      url: "https://www.hackerrank.com/",
      text: "HackerRank",
      description: "Online coding challenges to improve problem-solving skills for technical roles.",
    },
    {
      url: "https://www.geeksforgeeks.org/",
      text: "GeeksforGeeks",
      description: "Tutorials and resources for preparing for technical and coding interviews.",
    },
    {
      url: "https://www.glassdoor.com/Interview/index.htm",
      text: "Glassdoor - Interview Questions",
      description: "Real interview questions shared by job seekers, tailored for various roles and companies.",
    },
    {
      url: "https://biginterview.com/",
      text: "Big Interview",
      description: "An online system combining training and practice for answering behavioral interview questions.",
    },
    {
      url: "https://careersidekick.com/",
      text: "Career Sidekick - Interview Questions",
      description: "A collection of common interview questions and tips for answering them effectively.",
    },
    {
      url: "https://www.mockquestions.com/",
      text: "MockQuestions",
      description: "A library of mock interview questions tailored to different industries and job types.",
    },
  ];
  

  return (
    <div>
      {/*Yo video ko portion*/}
    <div className="video-grid">
      {videoData.map((video, index) => (
        <div key={index} className="video-container">
          <iframe
            src={video.link}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
          <p className="video-title">{video.title}</p>
        </div>
      ))}
    </div>
     <div className="links-grid">
     {externalLinks.map((link, index) => (
       <div key={index} className="link-container">
         <a href={link.url} target="_blank" rel="noopener noreferrer" className="external-link">
           {link.text}<br/><br/>
           {link.description}
         </a>
       </div>
     ))}
   </div>
   <p className="para-credits">
    *All the contents belongs to their respective creators & authors, no commercial use is intented*<br/>
   ~KaryaYojana Family~
   </p>
  </div>
  );
};

export default Prep;
