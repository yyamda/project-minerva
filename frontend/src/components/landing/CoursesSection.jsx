"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserCourses } from "../../lib/database/queries";
import { useUser } from "../../app/context/UserContext";

export default function CoursesSection() {
    const router = useRouter();
    const { user } = useUser();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (user) {
        const fetchCourses = async () => {
            const data = await getUserCourses(user.id);
            setCourses(data);
        };
        fetchCourses();
        }
    }, [user]);

    console.log(courses);

    const handleStartCourse = (courseId) => {
        console.log(`Starting course ${courseId}`);
        router.push(`/learning?courseId=${courseId}&userId=${user.id}`);
    };
    return (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-8">Current Courses</h1>
    {courses.map((course) => (
      <div
        key={course.id}
        className="flex items-center border border-gray-400 p-6 mb-6 pl-8"
      >
        <h3 className="text-xl font-bold mr-6">{course.title}</h3>
        <button
          onClick={() => handleStartCourse(course.id)}
          className="px-6 py-3 bg-blue-500 text-white rounded text-lg"
        >
          Start Course
        </button>
      </div>
    ))}
  </div>
);

} 