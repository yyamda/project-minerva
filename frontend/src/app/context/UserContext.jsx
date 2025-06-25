"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null);
        });
    
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });
    
        return () => {
          listener.subscription.unsubscribe();
        };
      }, []);

      return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
      );
}

export function useUser() {
    return useContext(UserContext);
}