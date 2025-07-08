
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  isAdmin: boolean;
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // If the logged-in user is the hardcoded admin user, grant admin access without checking the database.
          const isAdminUser = session.user.email === 'rajshekharan2020@gmail.com';
          console.log('Admin user check based on email:', isAdminUser);
          setIsAdmin(isAdminUser);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Attempting to sign in with:', email);
      
      // For the hardcoded admin credentials, sign up/sign in the user
      if (email === 'admin' && password === 'admin') {
        console.log('Using hardcoded admin credentials');
        
        // Try to sign in first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'rajshekharan2020@gmail.com',
          password: 'admin123'
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          
          if (signInError.message.includes('Invalid login credentials')) {
            // If sign in fails, try to sign up
            console.log('Sign in failed, attempting sign up...');
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: 'rajshekharan2020@gmail.com',
              password: 'admin123',
              options: {
                emailRedirectTo: `${window.location.origin}/admin`
              }
            });

            if (signUpError) {
              console.error('Sign up error:', signUpError);
              return { success: false, error: signUpError.message };
            }

            console.log('Sign up successful:', signUpData);
            
            // Auto confirm the user for demo purposes
            if (signUpData.user && !signUpData.user.email_confirmed_at) {
              console.log('User needs email confirmation, but proceeding for demo');
              return { success: true };
            }
            
            return { success: true };
          } else {
            return { success: false, error: signInError.message };
          }
        }

        console.log('Sign in successful:', signInData);
        return { success: true };
      }

      // For regular email/password sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      isAdmin,
      user,
      session,
      signIn,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
