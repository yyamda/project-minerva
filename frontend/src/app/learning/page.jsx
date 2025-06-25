"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Play, BookOpen, Edit3, ChevronLeft, ChevronRight, Lock, Home } from "lucide-react";
import Video from "../../components/learning/Video";
import Transcript from "../../components/learning/Transcript";
import { getCurrentSession, getSessionTopic, getSessionContents } from "../../lib/database/queries";
import { cn } from "../../lib/utils";
import { useRouter } from "next/navigation";

export default function Learning() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const userId = searchParams.get("userId");

  const [session, setSession] = useState(null);
  const [topic, setTopic] = useState(null);
  const [contents, setContents] = useState(null);
  const [currContents, setCurrContents] = useState(null);
  const [userNotes, setUserNotes] = useState("");
  const router = useRouter();

  const handleSave = () => {
    router.push("/");
  }

  useEffect(() => {
    if (userId && courseId) {
      const fetchData = async () => {
        const session = await getCurrentSession(userId, courseId);
        setSession(session);
        const curr_topic_index = session.curr_topic_index;
        const topic = await getSessionTopic(courseId, curr_topic_index);
        setTopic(topic);
        const contents = await getSessionContents(topic.id);
        setContents(contents);
        const curr_content = contents[session.curr_content_index].content.fields;
        setCurrContents(curr_content);
      };
      fetchData();
    }
  }, [userId, courseId]);

  if (!session || !topic || !currContents) {
    return (
      <div>
          Loading...
      </div>
    );
  }

  return (
    <div>

      <h1>{topic.title}</h1>
      <Video src={currContents.source_url} />
      <Transcript transcript={currContents.transcript} />
      <div >
        <h3>Your Notes</h3>
        <textarea
          placeholder="Notes here..."
          value={userNotes}
          onChange={e => setUserNotes(e.target.value)}
        />
      </div>
    </div>
  );
}
