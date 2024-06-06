import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const AssignEvaluators = () => {
  const [groups, setGroups] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [evaluatorPanels, setEvaluatorPanels] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState("faculties");
  const getAllGroups = () => {
    axios
      .get("http://localhost:3002/allGroups")
      .then((response) => {
        setGroups(response.data);
      })
      .catch((err) => {
        console.error("Error fetching groups", err);
      });
  };

  const getAllFaculties = () => {
    axios
      .get("http://localhost:3002/allFaculties")
      .then((response) => {
        setFaculties(response.data);
      })
      .catch((err) => {
        console.error("Error fetching faculties", err);
      });
  };

  const handleFacultyClick = (facultyId) => {
    setSelectedFaculties((prevSelected) =>
      prevSelected.includes(facultyId)
        ? prevSelected.filter((id) => id !== facultyId)
        : [...prevSelected, facultyId]
    );
  };

  const getAllEvaluatorPanels = () => {
    axios
      .get("http://localhost:3002/getAllPanels")
      .then((response) => {
        setEvaluatorPanels(response.data);
      })
      .catch((err) => {
        console.error("Error fetching panels", err);
      });
  };

  useEffect(() => {
    getAllGroups();
    getAllFaculties();
    getAllEvaluatorPanels();
  }, []);

  const groupsToShow = () => {
    console.log(selectedFaculties);
    axios
      .post("http://localhost:3002/groupsToShow", selectedFaculties)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleAssignFYPClick = () => {
    groupsToShow();
    setModalContent("groups");
  };

  const handleBackButtonClick = () => {
    setModalContent("faculties");
  };

  const handleClose = () => {
    setModalContent("faculties");
    setSelectedGroups([]);
    onClose();
  };

  const updateRoles = (facultyId) => {
    axios
      .put("http://localhost:3002/addEvaluatorRole", { facultyId })
      .then((response) => {
        console.log("Evaluator role added successfully", response.data);
      })
      .catch((err) => {
        console.error("Error adding evaluator role ", err);
      });
  };

  const addEvaluatorsIdsToGroup = () => {
    const groupsIds = selectedGroups.map((group) => group._id);
    axios
      .post("http://localhost:3002/addEvaluators", {
        selectedFacultyIds: selectedFaculties,
        selectedGroupIds: groupsIds,
      })
      .then((response) => {
        getAllFaculties();
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const updateGroup = (groupId) => {
    axios
      .put("http://localhost:3002/updateGroupEvaluators", { groupId })
      .then((response) => {
        console.log("Group updated successfully", response.data);
      })
      .catch((err) => {
        console.error("Error updating role ", err);
      });
  };

  const createEvaluatorGroup = () => {
    if (
      selectedGroups.length > 0 &&
      selectedFaculties.length >= 2 &&
      selectedFaculties.length <= 4
    ) {
      const selectedFacultiesDetails = selectedFaculties.map((facultyId) => {
        const faculty = faculties.find((f) => f._id === facultyId);
        return {
          firstName: faculty.firstName,
          lastName: faculty.lastName,
          email: faculty.email,
          photo: faculty.photo,
        };
      });

      selectedFaculties.forEach((facultyId) => {
        updateRoles(facultyId);
      });
      const selectedGroupTitles = selectedGroups.map((group) => group.title);
      const selectedGroupIds = selectedGroups.map((group) => group._id);
      selectedGroupIds.forEach((id) => {
        updateGroup(id);
      });

      const newEvaluatorPanel = {
        faculties: selectedFacultiesDetails,
        groups: selectedGroupTitles,
      };
      axios
        .post("http://localhost:3002/createPanel", newEvaluatorPanel)
        .then((response) => {
          setSelectedGroups([]);
          setSelectedFaculties([]);
          getAllEvaluatorPanels();
          addEvaluatorsIdsToGroup();
          handleClose();
        })
        .catch((error) => {
          console.error("Error creating panel ", error);
        });
    }
  };

  const handleGroupClick = (group) => {
    setSelectedGroups((prevSelected) =>
      prevSelected.some((g) => g._id === group._id)
        ? prevSelected.filter((g) => g._id !== group._id)
        : prevSelected.length < 3
        ? [...prevSelected, group]
        : prevSelected
    );
  };
  return (
    <div>
      <Heading mb={6}>Assign Evaluators</Heading>
      <Box>
        <Button
          colorScheme="purple"
          p={{ base: "15px", md: "25px" }}
          m={2}
          gap={2}
          variant="outline"
          borderRadius="20px"
          onClick={onOpen}
          _hover={{
            transform: "scale(1.05)",
            transition: "transform 0.3s ease, background-color 0.3s ease",
          }}>
          <AddIcon color="purple.400" boxSize={{ base: 4, md: 5 }} />
          Create Evaluator Group
        </Button>

        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent maxW="700px">
            <ModalHeader>
              {modalContent === "faculties" ? "Faculties" : "Groups"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                {modalContent === "faculties" && (
                  <Flex wrap="wrap" justifyContent="space-between" mb={4}>
                    <Text>
                      Select <strong>2-4 members</strong> to make a panel
                    </Text>
                    <Button
                      colorScheme="green"
                      isDisabled={
                        selectedFaculties.length < 2 ||
                        selectedFaculties.length > 4
                      }
                      onClick={handleAssignFYPClick}>
                      Assign FYP
                    </Button>
                  </Flex>
                )}
                {modalContent === "groups" && (
                  <Flex wrap="wrap" justifyContent="space-between" mb={4}>
                    <Text>
                      Select up to <strong>3 groups</strong> to create a panel
                    </Text>
                    <Button
                      colorScheme="green"
                      isDisabled={selectedGroups.length === 0}
                      onClick={createEvaluatorGroup}>
                      Create Panel
                    </Button>
                  </Flex>
                )}
                <Box
                  maxHeight={
                    modalContent === "groups" && groups.length > 4
                      ? "400px"
                      : "auto"
                  }
                  overflowX="hidden"
                  overflowY={
                    modalContent === "groups" && groups.length > 4
                      ? "scroll"
                      : "hidden"
                  }>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {modalContent === "faculties" &&
                      faculties.map(
                        (faculty) =>
                          !faculty.roles.includes("Evaluator") && (
                            <Box
                              key={faculty._id}
                              borderWidth="1px"
                              borderRadius="lg"
                              p={4}
                              boxShadow="md"
                              bg={
                                selectedFaculties.includes(faculty._id)
                                  ? "yellow.300"
                                  : "gray.100"
                              }
                              _hover={{
                                transform: "scale(1.05)",
                                transition:
                                  "transform 0.3s ease, background-color 0.3s ease",
                                bg: selectedFaculties.includes(faculty._id)
                                  ? "yellow.400"
                                  : "gray.200",
                              }}
                              onClick={() => handleFacultyClick(faculty._id)}
                              cursor="pointer">
                              <Flex align="center">
                                <Avatar
                                  size="md"
                                  src={`data:image/jpeg;base64,${faculty.photo}`}
                                  mr={4}
                                />
                                <Box>
                                  <Heading size="sm">
                                    {faculty.firstName} {faculty.lastName}
                                  </Heading>
                                  <Text>{faculty.email}</Text>
                                  {selectedFaculties.includes(faculty._id) && (
                                    <Text color="green.500" fontWeight="bold">
                                      SELECTED
                                    </Text>
                                  )}
                                </Box>
                              </Flex>
                            </Box>
                          )
                      )}
                    {modalContent === "groups" &&
                      groups.map(
                        (group) =>
                          group.hasAssignedEvaluators === false && (
                            <Box
                              key={group._id}
                              borderWidth="1px"
                              borderRadius="lg"
                              p={4}
                              boxShadow="md"
                              bg={
                                selectedGroups.some((g) => g._id === group._id)
                                  ? "yellow.300"
                                  : "gray.100"
                              }
                              _hover={{
                                transform: "scale(1.05)",
                                transition:
                                  "transform 0.3s ease, background-color 0.3s ease",
                                bg: selectedGroups.some(
                                  (g) => g._id === group._id
                                )
                                  ? "yellow.400"
                                  : "gray.200",
                              }}
                              onClick={() => handleGroupClick(group)}
                              cursor="pointer">
                              <Flex align="center">
                                <Box>
                                  <Heading size="sm">{group.title}</Heading>
                                  <Text>Supervisor: {group.advisor}</Text>
                                  {selectedGroups.some(
                                    (g) => g._id === group._id
                                  ) && (
                                    <Text color="green.500" fontWeight="bold">
                                      SELECTED
                                    </Text>
                                  )}
                                </Box>
                              </Flex>
                            </Box>
                          )
                      )}
                  </SimpleGrid>
                </Box>
                {modalContent === "groups" && (
                  <Button colorScheme="blue" onClick={handleBackButtonClick}>
                    Back
                  </Button>
                )}
                <Button colorScheme="blue" onClick={handleClose}>
                  Close
                </Button>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>

      <Box mt={6}>
        <Heading size="md" mb={4}>
          Evaluator Panels
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {evaluatorPanels.map((panel, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              _hover={{
                transform: "scale(1.05)",
                transition: "transform 0.3s ease",
              }}
              p={4}
              mb={4}>
              <Heading size="sm">Panel {index + 1}</Heading>
              <Heading size="sm" mt={2}>
                Panel Members
              </Heading>
              <Flex align="center" justify="center" wrap="wrap">
                {panel.faculties.map((faculty, index) => (
                  <Box key={index} mr={4} textAlign="center">
                    <Avatar
                      size="md"
                      src={`data:image/jpeg;base64,${faculty.photo}`}
                      mb={2}
                    />
                    <Text>
                      {faculty.firstName} {faculty.lastName}
                    </Text>
                  </Box>
                ))}
              </Flex>
              <Heading size="sm" mt={4} mb={2}>
                Groups Assigned:
              </Heading>
              <Flex wrap="wrap">
                {panel.groups.map((group, index) => (
                  <Box key={index} mr={4} mb={2}>
                    <Button colorScheme="blue">{group}</Button>
                  </Box>
                ))}
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </div>
  );
};

export default AssignEvaluators;
