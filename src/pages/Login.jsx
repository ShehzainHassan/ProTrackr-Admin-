import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Box,
  InputGroup,
  InputLeftElement,
  Center,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/login.module.css";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const onSubmit = async (event) => {
    console.log("In Function");
    const response = await axios.post("http://localhost:3002/adminLogin", {
      email: email,
      password: password,
    });

    if (response.status === 200) {
      sessionStorage.setItem(
        "LoggedEmail",
        JSON.stringify("admin@lhr.nu.edu.pk")
      );
      window.location.href = "/";
    } else {
      setIsError(true);
    }
  };

  const onEmailUpdate = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordUpdate = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Center>
      <Box
        w={["full", "80%", "md"]}
        p={[4, 8, 10]}
        mt={[10, "10vh"]}
        mx="auto"
        border={["none", "1px"]}
        borderColor={["gray.300", "gray.400"]}
        borderWidth={[1, 2]}
        borderRadius={20}
        overflow="hidden">
        <VStack spacing={4} align="flex-start" w="full">
          <VStack spacing={1} align={["flex-start", "center"]} w="full">
            <Heading
              as="h1"
              textAlign="center"
              color="green"
              size="4x1"
              className={styles.heading}>
              Welcome To ProTrackr Admin
            </Heading>
          </VStack>
          <FormControl>
            <FormLabel>Email Address</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <EmailIcon color="gray.600" />
              </InputLeftElement>
              <Input
                rounded="none"
                variant="filled"
                value={email}
                onChange={onEmailUpdate}
                type="email"
                placeholder="Enter email address"
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <LockIcon color="gray.600" />
              </InputLeftElement>

              <Input
                rounded="none"
                variant="filled"
                value={password}
                onChange={onPasswordUpdate}
                type="password"
                placeholder="Enter password"
              />
            </InputGroup>
          </FormControl>
          <Button
            rounded="none"
            w="full"
            size="md"
            onClick={onSubmit}
            colorScheme="purple">
            Login
          </Button>

          {isError && (
            <Alert status="error">
              <AlertIcon />
              Email or Password did not match
            </Alert>
          )}
        </VStack>
      </Box>
    </Center>
  );
}
