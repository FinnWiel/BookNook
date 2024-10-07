import { useContext, createContext, type PropsWithChildren, useState } from 'react';
import { useStorageState } from '../hooks/useStorage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../constants/Api'; // Import the base URL

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (name: string, username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
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
  signUp: async () => Promise.resolve(),
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
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null); 
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

        setAdminToken(response.data.admin_token);
        setUserToken(response.data.user_token);
        router.push('/');  
      } else {
        throw new Error('No valid token found in the response');
      }
    } catch (error) {
      // Check if it's an Axios error
      if (axios.isAxiosError(error)) {
        // Adjust to extract the "error" field from the response
        const errorMessage = error.response?.data?.error || 'Failed to sign in';
        throw new Error(errorMessage);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred during sign-in');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const signUp = async (name: string, username: string, email: string, password: string, confirmPassword: string) => {

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    setAuthLoading(true);

    try {
      const response = await axios.post(API_BASE_URL + 'register', {
        "name": name,
        "username": username,
        "email": email,
        "password": password,
        "password_confirmation": confirmPassword,
      });

      if(response.status === 200 || response.status === 201) {
        await signIn(username, password);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to register';
        throw new Error(errorMessage);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred during sign-in');
      }
    } finally {
      setAuthLoading(false); 
    }
  }

  const signOut = async () => {
    setAuthLoading(true); 
    try {
      const response = await axios.post(API_BASE_URL + 'logout', {}, {
        headers: {
          Authorization: `Bearer ${session}`, 
        },
      });

      console.log('Logout Response:', response.data);

      // Clear session
      setSession(null);
      setUserId(null);
      router.push('/sign-in');  
    } catch (error) {
      console.error('Error during sign-out:', error);
    } finally {
      setAuthLoading(false); 
    }
  };

  const validateToken = async (): Promise<boolean> => {
    if (!session) {
      return false;
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/validate-token`, {
        token: session,
      });
      return response.data.valid;
    } catch (error) {
      console.error('Error during token validation:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
    value={{
      signIn,
      signUp,
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
