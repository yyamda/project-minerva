"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState("");
    const router = useRouter();

    const handleSave = () => {
        router.push("/");
    }

    return (
        <div>
            <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Write your notes here..."
                rows="15"
                style={{
                    width: "100%",
                    height: "600px",       // full width of parent div
                    minWidth: "400px",   // or whatever minimum width you like
                    padding: "1rem",     // nice padding inside
                    fontSize: "1rem",    // larger text
                }}
                />

        </div>
    );
} 