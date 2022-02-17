import { createContext, useEffect, useReducer } from "react";
import axios from "../axios";
import Reducer from "./Reducer";

const INIT_STATE = {
  authToken: JSON.parse(localStorage.getItem("authorization")) || null,
  user: null,
  isFetching: false,
  error: false,
};

export const Context = createContext(INIT_STATE);

export const ContextProvider = ({ children }) => {
  let [state, dispatch] = useReducer(Reducer, INIT_STATE);

  useEffect(() => {
    const newState = async () => {
      try {
        const res = await axios.get("/user", {
          headers: { authorization: state.authToken },
        });
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { ...res.data, authToken: state.authToken },
        });
      } catch (err) {
        dispatch({ type: "LOGOUT" });
        {
          window.location.pathname !== "/login" &&
            window.location.assign("/login");
        }
      }
    };

    if (state.authToken) newState();
  }, []);

  useEffect(() => {
    if (state.authToken)
      localStorage.setItem("authorization", JSON.stringify(state.authToken));
    else  {
      localStorage.setItem("authorization", null);
    }
        
  }, [state.authToken]);

  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  );
};