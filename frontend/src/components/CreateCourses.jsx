import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCourses() {
    const [showModal, setShowModal] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [experience, setExperience] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [claudeResponse, setClaudeResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!courseName.trim() || !courseDescription.trim() || !experience.trim()) {
          setError("Please fill out all fields.");
          return;
        }
    
        setError("");
    
        try {
            console.log("Sending request to Flask API");
            const response = await fetch("http://localhost:5000/api/create-course", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                courseName,
                courseDescription,
                experience,
              }),
            });
        
            if (!response.ok) {
              throw new Error("Failed to create course");
            }
        
            const data = await response.json();
            console.log("Flask API response:", data);

            const roadmap = data.received.returntext;
    
          // Example: navigate to a new page with params
          const params = new URLSearchParams({
            courseName,
            courseDescription,
            experience,
            roadmap,
          }).toString();
          router.push(`/conversation-ai?${params}`);
    
          // OR: just reset form if you don't navigate
          setCourseName("");
          setCourseDescription("");
          setExperience("");
    
        } catch (err) {
          console.error("Error calling Chatgpt:", err);
          setError("Failed to call AI. Please try again.");
        }
      };

    const handleCancel = () => {
        setShowModal(false);
        setCourseName('');
        setCourseDescription('');
        setExperience('');
        setError('');
    };

    return (
        <div>
            {!showModal && (
                <button onClick={() => setShowModal(true)}>
                    Generate a course
                </button>
            )}
            {showModal && (
                <form onSubmit={handleSubmit} style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                    <div>
                        <label>What do you want to learn? </label>
                        <input
                            type="text"
                            value={courseName}
                            onChange={e => setCourseName(e.target.value)}
                            required
                            placeholder="e.g. Quantum Physics, U.S. History, etc."
                        />
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                        <label>What do you want to accomplish from this course?</label>
                        <textarea
                            value={courseDescription}
                            onChange={e => setCourseDescription(e.target.value)}
                            required
                            placeholder="Learn how to code build production grade applications"
                        />
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                        <label>What is your level of experience?</label>
                        <input
                            type="text"
                            value={experience}
                            onChange={e => setExperience(e.target.value)}
                            required
                            placeholder="Graduate high school, new grad software engineer, etc"
                        />
                    </div>
                    {error && (
                        <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>
                    )}
                    <div style={{ marginTop: '1rem' }}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleCancel} style={{ marginLeft: '1rem' }}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}