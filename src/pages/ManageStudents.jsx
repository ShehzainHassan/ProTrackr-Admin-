import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Loading from "../Components/Loading";

const SemesterCard = ({ title, subtitle, onButtonClick }) => {
  return (
    <Box
      maxW="200px"
      w="full"
      bg="white"
      boxShadow="md"
      rounded="lg"
      p={6}
      textAlign="center"
      minH="250px"
      border="1px"
      borderColor="gray.200"
      overflow="hidden"
      _hover={{
        transform: "scale(1.05)",
        transition: "transform 0.3s ease, background-color 0.3s ease",
        bg: "gray.100",
      }}>
      <Heading size="md" mb={2} color="blue.500">
        {title}
      </Heading>
      <Text fontWeight={600} color="gray.600" fontSize="sm" mb={4}>
        {subtitle}
      </Text>
      <Button colorScheme="blue" onClick={onButtonClick} mt={8}>
        View Students
      </Button>
    </Box>
  );
};

export default function ManageStudents() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [students, setStudents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const getAllUsers = () => {
    axios.get("http://localhost:3002/allusers").then((response) => {
      setStudents(response.data);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleCardButtonClick = (filterValue) => {
    setSelectedFilter(filterValue);
    onOpen();
  };
  const registerStudents = () => {
    setIsLoading(true);
    axios
      .post("http://localhost:3002/readCSV_UploadStudents")
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        toast({
          title: `${response.data} Students Registered Successfully`,
          duration: 5000,
          isClosable: true,
          position: "top",
          status: "success",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const uploadCSV = (file) => {
    const formData = new FormData();
    console.log(file);
    formData.append("file", file);
    axios
      .post("http://localhost:3002/uploadCSV", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);
    uploadCSV(selectedFile);
  };
  const changeAccountStatus = async (student, id, status) => {
    await axios
      .put("http://localhost:3002/changeAccountStatus", {
        id: id,
        status: status,
      })
      .then((response) => {
        getAllUsers();
        console.log("Account status changed successfully");
      })
      .catch((err) => {
        console.error("Error changing account status", err);
      });
  };

  const filteredStudents =
    students.filter((s) => s.fypStartSemester === selectedFilter) || [];

  return (
    <Box p={5} overflowX="hidden">
      <Heading mb={6}>Manage Students</Heading>

      <Heading mb={4}>View Students by FYP Start Semesters</Heading>
      <Flex wrap="wrap" justifyContent="space-around">
        <SemesterCard
          title="Fall 2023"
          subtitle="Final Year Project Semester"
          onButtonClick={() => handleCardButtonClick("Fall 2023")}
        />
        <SemesterCard
          title="Spring 2024"
          subtitle="Final Year Project Semester"
          onButtonClick={() => handleCardButtonClick("Spring 2024")}
        />
      </Flex>

      <Heading mt={10} mb={4}>
        Register Students Through CSV
      </Heading>
      <FormControl mb={4}>
        <FormLabel>Upload CSV File</FormLabel>
        <Input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileUpload(e)}
        />
      </FormControl>
      <Flex flexDirection="column" alignItems="center">
        <Button
          isDisabled={!file}
          colorScheme="purple"
          onClick={registerStudents}>
          Register Students
        </Button>
        {isLoading && <Loading />}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedFilter}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {filteredStudents.length > 0 ? (
              <Stack spacing={4}>
                {filteredStudents.map((student, index) => (
                  <Box
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    boxShadow="md"
                    bg="gray.100">
                    <Flex align="center" justify="space-between">
                      <Flex align="center">
                        {student.photo ? (
                          <Image
                            borderRadius="full"
                            boxSize="50px"
                            src={`data:image/jpeg;base64,${student.photo}`}
                            alt={`${student.firstName} ${student.lastName}`}
                            mr={4}
                          />
                        ) : (
                          <Box
                            borderRadius="full"
                            boxSize="50px"
                            bg="blue.600"
                            color="white"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            fontSize="xl"
                            fontWeight="bold"
                            mr={4}>
                            {`${student.firstName.charAt(
                              0
                            )}${student.lastName.charAt(0)}`}
                          </Box>
                        )}
                        <Box color={student.isDisabled ? "gray.500" : "black"}>
                          <Heading size="sm">
                            {student.firstName} {student.lastName}
                          </Heading>
                          <Text>Roll No: {student.rollNo}</Text>
                          <Text>CGPA: {student.cgpa}</Text>
                          <Text>Batch: {student.batch}</Text>
                        </Box>
                      </Flex>
                      <Button
                        onClick={() =>
                          changeAccountStatus(
                            student,
                            student._id,
                            student.isDisabled ? "enable" : "disable"
                          )
                        }
                        colorScheme={student.isDisabled ? "green" : "red"}
                        ml={4}>
                        {student.isDisabled
                          ? "Enable Account"
                          : "Disable Account"}
                      </Button>
                    </Flex>
                  </Box>
                ))}
                <Button colorScheme="blue" onClick={onClose}>
                  Close
                </Button>
              </Stack>
            ) : (
              <Text>No students found for this filter.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
