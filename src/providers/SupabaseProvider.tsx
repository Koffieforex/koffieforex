'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

type SupabaseContextType = {
  session: Session | null;
  user: User | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  user: null,
});

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session || null);
      setUser(session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ session, user }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => useContext(SupabaseContext);
