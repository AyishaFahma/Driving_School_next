

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";


// Adjust as per your actual user object structure
// defines what a User looks like

type User = { name: string; email: string ; data: any; }; 

interface AuthState {
  user: User | null; // logined user data or null if logged out
  accessToken: string | null; // used for authorized api calls
  refreshToken: string | null; // used to refresh expired token
}

interface AuthContextProps {
  state: AuthState; // current auth state - current user name, email, tokens etc.
  setAuthData: (data: { user: User; accessToken: string; refreshToken: string }) => void; // function to save login data
  clearAuthData: () => void; // function to log out
  isAuthenticated: () => boolean; // function to check if the user is logined
}


//This creates a context that can be shared globally.
// Initially, it’s null (empty).
// Later, we’ll provide actual values in the AuthProvider.

const AuthContext = createContext<AuthContextProps | null>(null);


// create a custom hook
export const useAuth = () => {
  const context = useContext(AuthContext); //Reads the current context (with useContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); //Throws an error if someone tries to use it outside the AuthProvider //const { state, setAuthData, clearAuthData } = useAuth(); this is how other component get auth info
  }
  return context;
};


//This is the default state when the app first loads (no one logged in).
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};


//The reducer is like a mini state manager:
//It listens for actions (SET_USER, CLEAR_USER) // action function to update the state
//Updates the state accordingly
//Returns a new state object
//This is what useReducer will use.

const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case "CLEAR_USER":
      return initialState;
    default:
      return state;
  }
};


//this is the auth provider
//This is the “root provider” that wraps your whole app.
//It gives every component access to auth state.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState); // useReducer gives you [state(current Auth data) , dispatch (how u send action to change the state)]


//load saved data from localstorage  
//this run once when the app starts
  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData"); // check if there is saved auth data in localstorage(previous login)
    if (storedAuthData) {
      const parsedAuthData = JSON.parse(storedAuthData); // parse it back into an object
      //Dispatches SET_USER to restore it in state
      //This way, your app “remembers” the logged-in user even after a page refresh.
      dispatch({
        type: "SET_USER",
        payload: {
          user: parsedAuthData.user,
          accessToken: parsedAuthData.accessToken,
          refreshToken: parsedAuthData.refreshToken,
        },
      });
    }
  }, []);


  //function to set login data
  //when you log in successfully
  //Call setAuthData({ user, accessToken, refreshToken })
  //It updates state and saves it in localStorage - so next time the app reload useEffect restores it automatically
  const setAuthData = (data: { user: User; accessToken: string; refreshToken: string }) => {
    dispatch({
      type: "SET_USER",
      payload: data,
    });
    localStorage.setItem("authData", JSON.stringify(data));
  };


  //function to log out
  // it clear both - react satate , the saved data in localstorage. it is used when loggin out
  const clearAuthData = () => {
    dispatch({ type: "CLEAR_USER" });
    localStorage.removeItem("authData");
  };


  // check if user is authenticated
  //This checks if a token exists (using double !! to convert to true or false).
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };


  //provide context to all children
  //this wrap your app in layout.tsx
  return (
    <AuthContext.Provider value={{ state, setAuthData, clearAuthData, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};



//now if we want to use this in an component simply use this
//Now every component inside can use: like this
// const { state, setAuthData, clearAuthData } = useAuth();


// example usage is like this
// import { useAuth } from "@/context/AuthContext";

// function Dashboard() {
//   const { state, clearAuthData } = useAuth();

//   return (
//     <div>
//       <h2>Welcome {state.user?.name}</h2>
//       <button onClick={clearAuthData}>Logout</button>
//     </div>
//   );
// }



  //      ┌────────────────────────────┐                                 
  //      │ 1️⃣ User logs in (API call)│
  //      │   -> gets user info + tokens│
  //      └──────────────┬─────────────┘
  //                     │
  //                     ▼
  //       ┌────────────────────────────┐
  //       │ 2️⃣ call setAuthData({...}) │
  //       └──────────────┬─────────────┘
  //                     │
  //                     ▼
  //  ┌─────────────────────────────────────────┐
  //  │ useReducer updates Auth State:          │
  //  │   user = { name, email }                │
  //  │   accessToken = "abcd..."               │
  //  │   refreshToken = "xyz..."               │
  //  └─────────────────────────────────────────┘
  //                     │
  //                     ▼
  //       ┌────────────────────────────┐
  //       │ 3️⃣ Save to localStorage    │
  //       │   key: "authData"          │
  //       │   value: JSON of user/tokens│
  //       └──────────────┬─────────────┘
  //                     │
  //                     ▼
  // ┌────────────────────────────────────────────┐
  // │ 4️⃣ On App reload: useEffect runs in       │
  // │     <AuthProvider>                         │
  // │  - Reads localStorage.authData             │
  // │  - Dispatches SET_USER again               │
  // └────────────────────────────────────────────┘
  //                     │
  //                     ▼
  //       ┌────────────────────────────┐
  //       │ 5️⃣ Context updated again   │
  //       │    (user stays logged in)  │
  //       └──────────────┬─────────────┘
  //                     │
  //                     ▼
  // ┌────────────────────────────────────────────┐
  // │ 6️⃣ Any component calls useAuth()          │
  // │   const { state } = useAuth();             │
  // │   → gets user info, tokens, logout method  │
  // └────────────────────────────────────────────┘
  //                     │
  //                     ▼
  //       ┌──────────────────────────── ┐
  //       │ 7️⃣ clearAuthData() logs out │
  //       │  - Clears reducer state     │
  //       │  - Removes from localStorage│
  //       └────────────────────────────-┘



//   User logs in
//    ↓
// setAuthData() called
//    ↓
// User + tokens saved in state and localStorage
//    ↓
// AuthProvider shares data with all components
//    ↓
// Components use useAuth() to access state
//    ↓
// User refreshes page
//    ↓
// AuthProvider loads from localStorage again
//    ↓
// User stays logged in
