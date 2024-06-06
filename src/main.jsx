import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./styles/theme";
// import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Auth0Provider
domain="dev-c2og5o3ebrzbi50c.us.auth0.com"
clientId="HGZLXlohB2x3EBagAxEE17YwOcXU6WB8"
authorizationParams={{
  redirect_uri: window.location.origin
}}> */}
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
    {/* </Auth0Provider> */}
  </React.StrictMode>
);
