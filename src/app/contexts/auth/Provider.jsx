// Import Dependencies
import { useEffect, useReducer } from "react";
// import isObject from "lodash/isObject";
import PropTypes from "prop-types";
import isString from "lodash/isString";

// Local Imports
import axios from "utils/axios";
import { isTokenValid, setSession } from "utils/jwt";
import { AuthContext } from "./context";


// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => ({
    ...state,
    isAuthenticated: action.payload.isAuthenticated,
    isInitialized: true,
    user: action.payload.user ?? null,
  }),


  LOGIN_REQUEST: (state) => {
    return {
      ...state,
      isLoading: true,
      
    };
  },

  LOGIN_SUCCESS: (state, action) => {
    
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      user: action?.payload?.user ?? {},
    };
  },

  LOGIN_ERROR: (state, action) => {
    const errorMessage = action?.payload ?? "Login failed";

    return {
      ...state,
      errorMessage,
      isLoading: false,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};
const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        if (authToken && isTokenValid(authToken)) {
          setSession(authToken);

          const userData = localStorage.getItem("user");
          let parsedUser = null;
          if (userData && userData !== "undefined" && userData !== "null") {
            try {
              parsedUser = JSON.parse(userData);
            } catch (err) {
              console.error("Invalid user data in localStorage", err);
              localStorage.removeItem("user"); 
            }
          }
          
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
               user: parsedUser,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
          
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
             user: null,
            
          },
        });
      }
    };

    init();
  }, []);



  // ✅ Login function
  // This function handles user login, updates the context state, and manages local storage.
  const login = async ({ username, password, finyear }) => {
  dispatch({ type: "LOGIN_REQUEST" });

  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("finyear", finyear);
    const response = await axios.post("/login", formData);

    const { token, permissions, user } = response.data;

    if (!isString(token)) {
      throw new Error("Invalid token received");
    }
    
    // Save token
    // localStorage.setItem("authToken", token);
    // localStorage.setItem("userPermissions", JSON.stringify(permissions));
    // if (user && typeof user === "object") {
    //     localStorage.setItem("user", JSON.stringify(user));
    //   } else {
    //     localStorage.removeItem("user"); // 🧹 fallback
    //   }
    // Save token
localStorage.setItem("authToken", token);

// Save permissions
localStorage.setItem("userPermissions", JSON.stringify(permissions));

// Decode token payload to get userId
const payload = JSON.parse(atob(token.split(".")[1]));
const userId = payload.sub;
// console.log(userId);

// Save userId in localStorage
localStorage.setItem("userId", userId);

// If you already have user object
if (user && typeof user === "object") {
  localStorage.setItem("user", JSON.stringify(user));
} else {
  localStorage.removeItem("user"); // fallback
}

    // console.log("✅ User data from API:", user);
    

    setSession(token); // optionally set default header

    // ✅ Use actual user from response
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { user },
    });

  } catch (err) {
    dispatch({
      type: "LOGIN_ERROR",
      payload: err?.response?.data?.message || err?.message || "Login failed",
    });

    throw err;
  }
};

    const logout = async () => {
      try {
        await axios.post("/logout");
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setSession(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userPermissions");
        localStorage.removeItem("user");
        window.history.replaceState({}, document.title, "/login"); // ✅ Clean URL BEFORE AuthGuard can read stale path
        dispatch({ type: "LOGOUT" }); // ✅ Now logout from context
      
        // ✅ Reload the app to prevent stale route re-capture
        // window.location.href = "/login?redirect="; // final clean reset
      }
    };

  if (!children) {
    return null;
  }

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

