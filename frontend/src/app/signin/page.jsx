"use client";

import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../context/UserContext";
import { redirect } from "next/navigation";

export default function SignedOut() {
  const { user } = useUser();

  if (user) {
    redirect("/");
  }
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div>
      <h1>You are signed out.</h1>
      <button onClick={signIn}>Sign In with Google</button>
    </div>
  );
}