import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store/store.js";
import { RoomProvider } from "./context/RoomContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
      <RoomProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
      </RoomProvider>
  </>
);
