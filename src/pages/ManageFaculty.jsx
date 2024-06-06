import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Badge,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const ManageFaculty = () => {
  const [faculties, setFaculty] = useState([]);
  const toast = useToast();

  const getAllFaculties = () => {
    axios
      .get("http://localhost:3002/allFaculties")
      .then((response) => {
        setFaculty(response.data);
      })
      .catch((err) => {
        console.error("Error fetching faculties ", err);
      });
  };
  const assignCommittee = (faculty) => {
    axios
      .put(`http://localhost:3002/assignCommitteeMember/`, {
        _id: `${faculty}`,
      })
      .then((response) => {
        getAllFaculties();
        const selectedFaculty = faculties.filter((f) => f._id === faculty);
        toast({
          title: `${selectedFaculty[0].firstName} ${selectedFaculty[0].lastName} has been successfully assigned as a committee member.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error("Error assigning committee member", err);
      });
  };
  const removeCommittee = (faculty) => {
    axios
      .delete(`http://localhost:3002/removeCommitteeMember/${faculty}`)
      .then((response) => {
        getAllFaculties();
        const selectedFaculty = faculties.filter((f) => f._id === faculty);
        toast({
          title: `${selectedFaculty[0].firstName} ${selectedFaculty[0].lastName} has been successfully removed from committee members.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error("Error removing committee member", err);
      });
  };
  const FacultyCard = ({ faculty }) => {
    const isCommitteeMember = faculty.roles.includes("Committee_Member");

    const handleAssignCommittee = () => {
      if (!isCommitteeMember) {
        assignCommittee(faculty._id);
      } else {
        removeCommittee(faculty._id);
      }
    };
    return (
      <Box
        maxW={"410px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
        m={4}>
        <Avatar
          size={"xl"}
          src={`data:image/jpeg;base64,${faculty.photo}`}
          alt={`${faculty.firstName} ${faculty.lastName}`}
          mb={4}
          pos={"relative"}
          _after={{
            content: '""',
            w: 4,
            h: 4,
            bg: "green.300",
            border: "2px solid white",
            rounded: "full",
            pos: "absolute",
            bottom: 0,
            right: 3,
          }}
        />
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {faculty.firstName} {faculty.lastName}
        </Heading>
        <Text fontWeight={600} color={"gray.500"} mb={4}>
          {faculty.email}
        </Text>
        <Text
          textAlign={"center"}
          color={useColorModeValue("gray.700", "gray.400")}
          px={3}
          whiteSpace="normal"
          overflow="hidden"
          textOverflow="ellipsis">
          Education: {faculty.curr_education}
        </Text>
        <Text
          textAlign={"center"}
          color={useColorModeValue("gray.700", "gray.400")}
          px={3}
          mt={2}
          whiteSpace="normal"
          overflow="hidden"
          textOverflow="ellipsis">
          Room No: {faculty.roomNo}
        </Text>

        <Stack
          align={"center"}
          justify={"center"}
          direction={"row"}
          mt={6}
          flexWrap="wrap">
          {faculty.interest_Tags.map((tag, index) => (
            <Badge
              key={index}
              px={2}
              py={1}
              bg={useColorModeValue("gray.50", "gray.800")}
              fontWeight={"400"}>
              {tag}
            </Badge>
          ))}
        </Stack>

        <Stack mt={8} direction={"row"} spacing={4}>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            minW={"200px"}
            bg={isCommitteeMember ? "red.400" : "blue.400"}
            color={"white"}
            onClick={handleAssignCommittee}
            boxShadow={
              "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
            }
            _hover={{
              bg: isCommitteeMember ? "red.500" : "blue.500",
            }}
            _focus={{
              bg: isCommitteeMember ? "red.500" : "blue.500",
            }}>
            {isCommitteeMember
              ? "Remove Committee Member"
              : "Assign Committee Member"}
          </Button>
        </Stack>
      </Box>
    );
  };
  useEffect(() => {
    getAllFaculties();
  }, []);

  return (
    <Center py={6} flexWrap="wrap">
      {faculties.map((faculty) => (
        <FacultyCard key={faculty._id} faculty={faculty} />
      ))}
    </Center>
  );
};
export default ManageFaculty;
