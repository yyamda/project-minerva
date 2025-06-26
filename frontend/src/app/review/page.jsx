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

  const courseId = searchParams.get('courseId'); // passed from previous page
  const sessionNumber = searchParams.get('sessionNumber'); // passed from previous page
  const conversationHistory = useRef([]); 

  // Create Vapi instance once

  const vapiRef = useRef(null);

  // get the course topic 
  const courseTopic = "Topic" //need to get this from the database, use courseID and userId from {user}
  // get the learning Context
  const learningContext = "context" //need to get this from the database, use courseID and session Number, and userId from {user}

  const learningContextFormatted = learningContext // must concatenate the learning context into a single string 

  const startConversation = () => {
    // Create Vapi instance if it doesn't exist yet
    if (!vapiRef.current) {
      vapiRef.current = new Vapi("81595896-640b-46d9-9523-132f57861061");
    }
    console.log(courseTopic, learningContext);
    
    const assistantOverrides = {
        recordingEnabled: false,
        variableValues: {
          courseTopic: courseTopic, 
          learningContext: learningContextFormatted, 
        },
      };

    // Start conversation with context
    vapiRef.current.start(
        "81595896-640b-46d9-9523-132f57861061",
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

  const endConversation = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      console.log("Conversation ended");
    }
  };


  return (
    <main>
      <h1>Conversation AI Review</h1>
      <p><strong>Course Topic:</strong> {courseTopic}</p>

      <button onClick={startConversation}>Start Conversation</button>
      <button onClick={endConversation}>Finish Review</button>

      <button onClick={() => router.push('/')}>Back to Home</button>
    </main>
  );
}