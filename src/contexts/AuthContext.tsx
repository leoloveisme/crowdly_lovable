
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export type UserRole = 'platform_admin' | 'platform_supporter' | 'consumer' | 'author' | 'editor' | 'chief_editor' | 'producer' | 'contributor';

export type UserWithRoles = User & { roles?: UserRole[] };

interface AuthContextType {
  user: UserWithRoles | null;
  session: Session | null;
  loading: boolean;
  roles: UserRole[];
  hasRole: (role: UserRole) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const navigate = useNavigate();

  const fetchUserRoles = async (userId: string) => {
    try {
      console.log('Fetching roles for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      if (data && data.length > 0) {
        const userRoles = data.map(row => row.role) as UserRole[];
        console.log('Fetched roles:', userRoles);
        setRoles(userRoles);
        
        // Update user with roles
        setUser(prev => prev ? { ...prev, roles: userRoles } : null);
        return userRoles;
      } else {
        console.log('No roles found for user');
        setRoles([]);
        return [];
      }
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      return [];
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          
          // Use setTimeout to prevent deadlocks
          setTimeout(async () => {
            await fetchUserRoles(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setRoles([]);
        }
        
        // Update loading state
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log('Got existing session:', currentSession?.user?.email);
      setSession(currentSession);
      
      if (currentSession?.user) {
        setUser(currentSession.user);
        await fetchUserRoles(currentSession.user.id);
      } else {
        setUser(null);
        setRoles([]);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const hasRole = (role: UserRole): boolean => {
    console.log('Checking for role:', role, 'in roles:', roles);
    return roles.includes(role);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Error during sign in:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      console.log('Login successful for:', data.user?.email);
      
      // Update the user and session immediately
      setUser(data.user ?? null);
      setSession(data.session);
      
      // Fetch user roles right away
      if (data.user) {
        await fetchUserRoles(data.user.id);
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
      navigate('/');
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRoles([]);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/');
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    roles,
    hasRole,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
