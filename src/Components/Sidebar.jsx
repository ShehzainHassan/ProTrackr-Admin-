import {
  List,
  ListItem,
  ListIcon,
  Heading,
  Button,
  useToast,
} from "@chakra-ui/react";

import {
  CalendarIcon,
  EditIcon,
  AtSignIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaPowerOff } from "react-icons/fa";
export default function Sidebar() {
  const toast = useToast();

  const [selectedRoute, setSelectedRoute] = useState("/");
  const location = useLocation();

  const buttonHover = {
    transition: "transform 0.3s ease-in-out",
    _hover: {
      transform: "scale(1.05)",
      backgroundColor: "purple",
    },
  };

  const onLogout = () => {
    toast({
      title: "Logged out.",
      description: "Successfully logged out",
      duration: 10000,
      isClosable: true,
      position: "top",
      status: "success",
      icon: <UnlockIcon />,
    });
    setInterval(() => {
      sessionStorage.removeItem("LoggedEmail");
      window.location.href = "/adminLogin";
    }, 500);
  };

  useEffect(() => {
    setSelectedRoute(location.pathname);
  }, [location]);

  return (
    <List
      color="white"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      fontSize="1.2em"
      spacing={4}>
      <Heading as="h3">ProTrackr</Heading>

      <ListItem
        style={
          selectedRoute === "/" || selectedRoute.startsWith("/details/")
            ? {
                backgroundColor: "purple",
                padding: "10px",
                borderRadius: "15px",
                transition: "background-color 0.5s ease",
              }
            : {}
        }>
        <NavLink to="/">
          <ListIcon as={CalendarIcon} color="white" />
          Home
        </NavLink>
      </ListItem>

      <ListItem
        style={
          selectedRoute === "/manageStudents"
            ? {
                backgroundColor: "purple",
                padding: "10px",
                borderRadius: "15px",
                transition: "background-color 0.5s ease",
              }
            : {}
        }>
        <NavLink to="/manageStudents">
          <ListIcon as={EditIcon} color="white" />
          Manage Students
        </NavLink>
      </ListItem>

      <ListItem
        style={
          selectedRoute === "/manageFaculty"
            ? {
                backgroundColor: "purple",
                padding: "10px",
                borderRadius: "15px",
                transition: "background-color 0.5s ease",
              }
            : {}
        }>
        <NavLink to="/manageFaculty">
          <ListIcon as={EditIcon} color="white" />
          Manage Faculties
        </NavLink>
      </ListItem>

      <ListItem
        style={
          selectedRoute === "/assignEvaluators"
            ? {
                backgroundColor: "purple",
                padding: "10px",
                borderRadius: "15px",
                transition: "background-color 0.5s ease",
              }
            : {}
        }>
        <NavLink to="/assignEvaluators">
          <ListIcon as={EditIcon} color="white" />
          Assign Evaluators
        </NavLink>
      </ListItem>

      <ListItem
        style={
          selectedRoute === "/uploadFYPProgress"
            ? {
                backgroundColor: "purple",
                padding: "10px",
                borderRadius: "15px",
                transition: "background-color 0.5s ease",
              }
            : {}
        }>
        <NavLink to="/uploadFYPProgress">
          <ListIcon as={EditIcon} color="white" />
          Upload FYP Progress
        </NavLink>
      </ListItem>
      <Button
        colorScheme="purple"
        size="md"
        width="100%"
        borderRadius="full"
        onClick={onLogout}
        style={{
          position: "absolute",
          bottom: "20px",
          maxWidth: "80%",
        }}
        _hover={buttonHover}>
        <FaPowerOff style={{ marginRight: "8px" }} />
        Logout
      </Button>
    </List>
  );
}
