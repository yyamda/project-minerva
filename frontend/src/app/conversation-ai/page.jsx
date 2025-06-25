"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import Vapi from "@vapi-ai/web";
import { postCourseRoadmap } from "../../lib/database/queries"
import { useUser } from "../context/UserContext";

export default function ConversationAIPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const courseName = searchParams.get('courseName');
  const courseDescription = searchParams.get('courseDescription');
  const experience = searchParams.get('experience');
  const roadmap = searchParams.get('roadmap');
  const conversationHistory = useRef([]); 

  // Create Vapi instance once

  const vapiRef = useRef(null);

  const startConversation = () => {
    // Create Vapi instance if it doesn't exist yet
    if (!vapiRef.current) {
      vapiRef.current = new Vapi("847bef05-4d2d-457e-86b6-18ddc87b773b");
    }
    console.log(courseName, courseDescription, experience);
    
    const assistantOverrides = {
        recordingEnabled: false,
        variableValues: {
          courseName: courseName,
          courseDescription: courseDescription,
          experience: experience,
          roadmap: roadmap,
        },
      };

    // Start conversation with context
    vapiRef.current.start(
        "d1c4f939-dd8e-434a-8465-6826f2ac08f3",
        assistantOverrides,
    );

    vapiRef.current.on("message", (message) => {
      console.log("Message received:", message);

      // Only store if it has text content
      if (message.type === "transcript") {
        conversationHistory.current.push(`User: ${message.transcript}`);
      } else if (message.type === "assistant") {
        conversationHistory.current.push(`Assistant: ${message.text}`);
      }
    });

    vapiRef.current.on("call-start", () => console.log("Call started"));

    vapiRef.current.on("call-end", async () => {
      console.log("Call ended");

      // Join all lines into one big string
      const fullConversation = conversationHistory.current.join("\n");
      console.log("Full conversation:", fullConversation);
    });
  };

  const endConversation = async () => {
  if (vapiRef.current) {
    vapiRef.current.stop();
    console.log("Conversation ended");

    try {
      // ✅ EXAMPLE: parameters to send
      const params = {
        transcript: conversationHistory.current.join("\n"), // if you collected it with useRef
        roadmap: roadmap,  // your existing roadmap string
      };

      // ✅ Call Flask API with POST and JSON body
      const response = await fetch("http://localhost:5000/api/summarize-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      console.log("Flask API summary response:", data);
      console.log("Summarized roadmap:", data.received.topicList);

      const topics_list = data.received.topicList
      const pinecone_params = {
        topics_list: topics_list 
      };
      "Introduction to Machine Learning, Algorithms and Complexity, Introduction to Neural Networks, Deep Learning Foundations, Advanced Optimization Techniques, Natural Language Processing (NLP), Attention Mechanisms in Neural Networks, Transformers"
      const pinecone_response = await fetch("http://localhost:5000/api/fetch_pinecone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pinecone_params),
      })

      const pinecone_data = await pinecone_response.json();
      // console.log("Flask API pinecone response:", pinecone_data);

      // Supabase posting 
      console.log("Receive pinecone data")
      console.log("attempting to post to supabase")
      postCourseRoadmap(user.id, pinecone_data.received.course_roadmap, courseName)
      console.log("Success!")
    } catch (error) {
      console.error("Error summarizing:", error);
    }
  }
};


  return (
    <main>
      <h1>Conversation AI</h1>
      <p><strong>Course Name:</strong> {courseName}</p>
      <p><strong>Description:</strong> {courseDescription}</p>
      <p><strong>Experience:</strong> {experience}</p>

      <button onClick={startConversation}>Start Conversation</button>
      <button onClick={endConversation}>End Conversation</button>

      <button onClick={() => router.push('/')}>Back to Home</button>
    </main>
  );
}