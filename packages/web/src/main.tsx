import { theme as proTheme } from "@chakra-ui/pro-theme";
import {
  ChakraProvider,
  createStandaloneToast,
  extendTheme,
} from "@chakra-ui/react";
import "@fontsource/inter/variable.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./store/store";

const { ToastContainer } = createStandaloneToast();

export const theme = extendTheme(proTheme, {
  styles: {
    global: {
      "html, body": {
        fontFamily: "Inter",
      },
    },
  },
  fonts: {
    heading: "'Inter'",
    body: "'Inter'",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <App />
          <ToastContainer />
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
