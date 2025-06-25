import { NextResponse } from 'next/server';
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.NEXT_PRIVATE_ANTHROPIC_KEY,
  });

  export async function POST(req) {
    const { courseName, courseGoal, experience } = await req.json();
    console.log("Hit")
    try {
      // Use the SDK properly (no TypeScript-specific syntax)
      const msg = await anthropic.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 1000,
        temperature: 1,
        system: `
            You are a course planner and generate a course outline for up to 15 topics from the user's input.
            Always respond ONLY with a JSON object in this exact structure:
            {
                "courseOutline": [
                    {
                    "title": "Topic title",
                    "description": "A short description of what this topic covers."
                    },
                    ...
                ],
            }
            Do not include explanations or notes.
            `,
        messages: [
          {
            role: "user",
            content: `I want to learn about: ${courseName}\n My goal for this course is: ${courseGoal}\n I have this much experience on this topic: ${experience}`
          }
        ],
      });
      return NextResponse.json(msg);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Failed to generate message." }, { status: 500 });
    }
  }