import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { Outlet, redirect, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// components
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const ParentWrapper = (props) => {
  const { isLoggedIn, children } = props;

  return isLoggedIn ? (
    <Grid templateColumns="3fr 9fr" bg="gray.50">
      {children}
    </Grid>
  ) : (
    <Flex align={"center"} justifyContent={"center"}>
      {children}
    </Flex>
  );
};

export default function RootLayout() {
  const isLogin =
    window.location.pathname == "/facultyLogin" ||
    window.location.pathname == "/facultySignup";
  const IsLoggedIn = !!JSON.parse(sessionStorage.getItem("LoggedEmail"));
  return (
    <ParentWrapper isLoggedIn={!isLogin && IsLoggedIn}>
      {!isLogin && IsLoggedIn && (
        <GridItem
          as="aside"
          style={{ width: "100%", position: "relative" }}
          colSpan={{ base: 6, lg: 2, xl: 1 }}
          bg="purple.600"
          minHeight={{ lg: "100vh" }}
          p={{ base: "20px", lg: "30px" }}>
          <Sidebar />
        </GridItem>
      )}

      {/* main content & navbar */}
      <GridItem as="main" p="40px">
        {!isLogin && IsLoggedIn && <Navbar />}
        <Outlet />
      </GridItem>
    </ParentWrapper>
  );
}
