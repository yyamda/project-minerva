"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"
import SignedIn from "../app/signedIn/page"
import SignedOut from "../../app/signin/page"

export default function Auth() {
    const [user, setUser] = useState(null)

    useEffect(() => {

        // Get the current session 
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null)
        });

        // Listen for auth changes
        const {data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user || null)
            }
        );
        // Cleanup listener 
        return () => listener.subscription.unsubscribe()

    },  []);

    // Sign in option
    const signIn = async () => {
        await supabase.auth.signInWithOAuth({provider: "google"});
    };

    // Sign out option
    const signOut = async () => {
        await supabase.auth.signOut();
    }

    return (
        <div>
           {user ? (
                <SignedIn/>
            ) : (
                <SignedOut/>
            )
           }
        </div>
    );
}