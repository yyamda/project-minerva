"use client";

import { useUser } from "./context/UserContext";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, BookOpen, Users, TrendingUp, Sparkles } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CoursesSection from "../components/landing/CoursesSection";
import FormModal from "../components/modals/FormModal";
import { createTopic } from "../lib/database/queries";
import CreateCourses from "../components/CreateCourses";
import { useState } from "react";

export default function Home() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  if (!user) {
    redirect("/signin");
  }

  return (
    <div>
          <div>
               <p>Welcome back,</p>
               <p>{user.email}</p>
           </div>
      <CreateCourses />
      <CoursesSection />
    </div>
  );
}


