import { Divider, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Flex
      as="nav"
      p={{ base: "5px", md: "10px" }}
      mb={{ base: "10px", md: "20px" }}
      alignItems="center"
      direction={{ base: "column", md: "row" }}>
      {isHomePage && (
        <Heading
          as="h1"
          color="green"
          fontSize={{ base: "1.2em", md: "1.5em" }}>
          ADMIN HOME PAGE
        </Heading>
      )}

      <Spacer />

      <Divider />
    </Flex>
  );
}
