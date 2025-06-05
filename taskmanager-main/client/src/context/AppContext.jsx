import React, { createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const AppContext = createContext();

const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const value = {
    backendURL,
    navigate,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
