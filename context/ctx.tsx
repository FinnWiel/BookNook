import { useContext, createContext, type PropsWithChildren, useState } from 'react';
import { useStorageState } from '../hooks/useStorage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../constants/Api'; // Import the base URL

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  validateToken: () => Promise<boolean>;
  session?: string | null;
  userId?: string | null;
  isLoading: boolean;
  isUserIdLoading: boolean;
  adminToken: string | null; // Global variable for admin token
  userToken: string | null;   // Global variable for user token
  setAdminToken: (token: string | null) => void; // Function to set admin token
  setUserToken: (token: string | null) => void;   // Function to set user token
}>( {
  signIn: async () => Promise.resolve(),
  signOut: async () => Promise.resolve(),
  validateToken: async () => Promise.resolve(false),
  session: null,
  userId: null,
  isLoading: false,
  isUserIdLoading: false,
  adminToken: null,
  userToken: null,
  setAdminToken: () => null,
  setUserToken: () => null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [[isUserIdLoading, userId], setUserId] = useStorageState('userId');
  const [authLoading, setAuthLoading] = useState(false); 
  const [adminToken, setAdminToken] = useState<string | null>(null); // Initialize adminToken
  const [userToken, setUserToken] = useState<string | null>(null); // Initialize userToken 
  const router = useRouter();

  const signIn = async (username: string, password: string) => {
    setAuthLoading(true);
    try {
      const response = await axios.post(API_BASE_URL + 'login', {
        username,
        password,
      });
      
      const token = response.data.admin_token || response.data.user_token;
      const user_id = response.data.user.id;

      if (token) {
        setSession(token);
        setUserId(user_id);
        // Set global tokens if they exist in the response
        setAdminToken(response.data.admin_token);
        setUserToken(response.data.user_token);
        router.push('/');  
      } else {
        throw new Error('No valid token found in the response');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      // Handle error (e.g., show a message to the user)
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);  // Optional: You might want to show a loading state while signing out
    try {
      // Make the logout request with the Bearer token
      const response = await axios.post(API_BASE_URL + 'logout', {}, {
        headers: {
          Authorization: `Bearer ${session}`,  // Use the token stored in session
        },
      });

      console.log('Logout Response:', response.data);

      // Clear session
      setSession(null);
      setUserId(null);
      router.push('/sign-in');  // Redirect to the login page after signing out
    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle error (e.g., show a message to the user)
    } finally {
      setAuthLoading(false);  // Reset loading state after the request
    }
  };

  const validateToken = async (): Promise<boolean> => {
    if (!session) {
      return false;
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/validate-token`, {
        token: session, // Using the session token for validation
      });
      return response.data.valid; // Assuming the response has a 'valid' field
    } catch (error) {
      console.error('Error during token validation:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
    value={{
      signIn,
      signOut,
      validateToken,
      session,
      userId,
      isLoading: isLoading || authLoading,
      isUserIdLoading: isUserIdLoading || authLoading,
      adminToken,
      userToken,
      setAdminToken,
      setUserToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
