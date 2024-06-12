import { AddIcon, EditIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(null);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(null);
  const [isEditFacultyModalOpen, setIsEditFacultyModalOpen] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const toast = useToast();
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

  const handleFacultyClick = (faculty) => {
    setSelectedFaculties((prevSelected) =>
      prevSelected.some((f) => f._id === faculty._id)
        ? prevSelected.filter((f) => f._id !== faculty._id)
        : [...prevSelected, faculty]
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
    setSelectedFaculties([]);
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
  const renderModalContent = () => {
    if (modalContent === "faculties" || modalContent === "EditFaculties") {
      return (
        <>
          {modalContent === "faculties" && (
            <Flex wrap="wrap" justifyContent="space-between" mb={4}>
              <Text>
                Select <strong>2-4 members</strong> to make a panel
              </Text>
              <Button
                colorScheme="green"
                isDisabled={
                  selectedFaculties.length < 2 || selectedFaculties.length > 4
                }
                onClick={handleAssignFYPClick}>
                Assign FYP
              </Button>
            </Flex>
          )}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {faculties.map(
              (faculty) =>
                !faculty.roles.includes("Evaluator") && (
                  <Box
                    key={faculty._id}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    boxShadow="md"
                    bg={
                      selectedFaculties.some((f) => f._id === faculty._id)
                        ? "yellow.300"
                        : "gray.100"
                    }
                    _hover={{
                      transform: "scale(1.05)",
                      transition:
                        "transform 0.3s ease, background-color 0.3s ease",
                      bg: selectedFaculties.some((f) => f._id === faculty._id)
                        ? "yellow.400"
                        : "gray.200",
                    }}
                    onClick={() => handleFacultyClick(faculty)}
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
                        {selectedFaculties.some(
                          (f) => f._id === faculty._id
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
        </>
      );
    } else if (modalContent === "groups" || modalContent === "EditGroups") {
      return (
        <>
          <Flex wrap="wrap" justifyContent="space-between" mb={4}>
            {modalContent === "groups" && (
              <>
                <Text>
                  Select up to <strong>3 groups</strong> to create a panel
                </Text>
                <Button
                  colorScheme="green"
                  isDisabled={selectedGroups.length === 0}
                  onClick={createEvaluatorGroup}>
                  Create Panel
                </Button>
              </>
            )}
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {groups.map(
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
                      bg: selectedGroups.some((g) => g._id === group._id)
                        ? "yellow.400"
                        : "gray.200",
                    }}
                    onClick={() => handleGroupClick(group)}
                    cursor="pointer">
                    <Flex align="center">
                      <Box>
                        <Heading size="sm">{group.title}</Heading>
                        <Text>Supervisor: {group.advisor}</Text>
                        {selectedGroups.some((g) => g._id === group._id) && (
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
        </>
      );
    }
  };
  const openEditModal = (panel) => {
    setSelectedPanel(panel);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setModalContent("faculties");
    setIsEditModalOpen(false);
  };
  const createEvaluatorGroup = () => {
    if (
      selectedGroups.length > 0 &&
      selectedFaculties.length >= 2 &&
      selectedFaculties.length <= 4
    ) {
      const selectedFacultiesDetails = selectedFaculties.map((fac) => {
        const faculty = faculties.find((f) => f._id === fac._id);
        return {
          _id: faculty._id,
          firstName: faculty.firstName,
          lastName: faculty.lastName,
          email: faculty.email,
          photo: faculty.photo,
        };
      });

      selectedFaculties.forEach((facultyId) => {
        updateRoles(facultyId);
      });

      const selectedGroupsDetails = selectedGroups.map((group) => ({
        id: group._id,
        title: group.title,
        groupId: group.id,
      }));

      selectedGroupsDetails.forEach((group) => {
        updateGroup(group.id);
      });

      const newEvaluatorPanel = {
        faculties: selectedFacultiesDetails,
        groups: selectedGroupsDetails,
      };

      axios
        .post("http://localhost:3002/createPanel", newEvaluatorPanel)
        .then((response) => {
          setSelectedGroups([]);
          setSelectedFaculties([]);
          getAllFaculties();
          getAllGroups();
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

  const deletePanel = (panelId) => {
    axios
      .delete(`http://localhost:3002/deletePanel/${panelId}`)
      .then((response) => {
        console.log("Panel deleted successfully", response.data);
        getAllGroups();
        getAllFaculties();
        getAllEvaluatorPanels();
      })
      .catch((err) => {
        console.error("Error deleting panel", err);
      });
  };
  const openEditGroupModal = () => {
    closeEditModal();
    setModalContent("EditGroups");
    setIsEditGroupModalOpen(true);
  };
  const openEditFacultyModal = () => {
    const groupIdsString = selectedPanel.groups
      .map((group) => group.groupId)
      .join(",");
    axios
      .get(
        `http://localhost:3002/evaluatorsToShow/${selectedPanel._id}/${groupIdsString}`
      )
      .then((response) => {
        setFaculties(response.data);
      })
      .catch((error) => {
        console.error("Error fetching evaluators", error);
      });
    closeEditModal();
    setModalContent("EditFaculties");
    setSelectedFaculties([]);
    setIsEditFacultyModalOpen(true);
  };

  const closeEditGroupModal = () => {
    setIsEditGroupModalOpen(false);
    setModalContent("faculties");
  };
  const closeEditFacultyModal = () => {
    setIsEditFacultyModalOpen(false);
    getAllFaculties();
    setModalContent("faculties");
    setSelectedFaculties([]);
  };

  const addNewFaculty = () => {
    if (selectedFaculties.length > 0) {
      selectedFaculties.forEach((facultyId) => {
        updateRoles(facultyId);
      });

      const updatedFaculties = selectedFaculties.map((faculty) => ({
        _id: faculty._id,
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        email: faculty.email,
        photo: faculty.photo,
      }));
      const newGroups = selectedGroups.map((group) => ({
        id: group._id,
        title: group.title,
        groupId: group.id,
      }));
      const updatedPanel = {
        ...selectedPanel,
        groups: [...selectedPanel.groups, ...newGroups],
        faculties: [...selectedPanel.faculties, ...updatedFaculties],
      };
      console.log(updatedFaculties);
      const panelUpdateData = {
        newGroups: selectedGroups,
        newFaculties: updatedFaculties,
      };
      console.log(panelUpdateData);
      axios
        .put(
          `http://localhost:3002/updatePanel/${selectedPanel._id}`,
          panelUpdateData
        )
        .then((response) => {
          setSelectedPanel(response.data);
          setSelectedGroups([]);
          setSelectedFaculties([]);
          closeEditFacultyModal();
          setModalContent("faculties");
          getAllFaculties();
          getAllGroups();
          getAllEvaluatorPanels();
          openEditModal(response.data);
          toast({
            title: "Panel updated",
            description: "Faculty Member added successfully",
            duration: 3000,
            isClosable: true,
            position: "top",
            status: "success",
          });
        })
        .catch((error) => {
          console.error("Error updating panel ", error);
        });
    }
  };
  const addNewGroups = () => {
    if (selectedGroups.length > 0) {
      const newGroups = selectedGroups.map((group) => ({
        id: group._id,
        title: group.title,
        groupId: group.id,
      }));
      const updatedPanel = {
        ...selectedPanel,
        groups: [...selectedPanel.groups, ...newGroups],
      };

      const panelUpdateData = {
        newGroups: selectedGroups,
        newFaculties: selectedPanel.faculties, // Add new faculties if required
      };

      axios
        .put(
          `http://localhost:3002/updatePanel/${selectedPanel._id}`,
          panelUpdateData
        )
        .then((response) => {
          setSelectedPanel(response.data);
          setSelectedGroups([]);
          setSelectedFaculties([]);
          closeEditGroupModal();
          setModalContent("faculties");
          getAllEvaluatorPanels();
          openEditModal(response.data);
          toast({
            title: "Panel updated",
            description: "Group added successfully",
            duration: 3000,
            isClosable: true,
            position: "top",
            status: "success",
          });
        })
        .catch((error) => {
          console.error("Error updating panel ", error);
        });
    }
  };
  const deleteFacultyFromPanel = (facultyId) => {
    console.log(facultyId);
    console.log(selectedPanel._id);
    axios
      .delete(
        `http://localhost:3002/deleteFacultyFromPanel?panelId=${selectedPanel._id}&facultyId=${facultyId}`
      )
      .then((response) => {
        setSelectedPanel(response.data);
        getAllEvaluatorPanels();
        getAllFaculties();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteGroupFromPanel = (group) => {
    axios
      .delete(
        `http://localhost:3002/deleteGroupFromPanel?panelId=${selectedPanel._id}&groupId=${group.id}`
      )
      .then((response) => {
        setSelectedPanel(response.data);
        getAllEvaluatorPanels();
        getAllGroups();
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
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
            <ModalBody>{renderModalContent()}</ModalBody>
            {modalContent === "groups" && (
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={handleBackButtonClick}>
                  Back
                </Button>
              </ModalFooter>
            )}
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
              mb={4}
              position="relative">
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                colorScheme="red"
                position="absolute"
                top={2}
                right={2}
                onClick={() => deletePanel(panel._id)}
              />
              <IconButton
                icon={<EditIcon />}
                size="sm"
                position="absolute"
                colorScheme="green"
                top={14}
                right={2}
                onClick={() => openEditModal(panel)}
              />
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
                    <Button colorScheme="blue">{group.title}</Button>
                  </Box>
                ))}
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Panel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPanel && (
              <>
                <Heading size="md" mb={4}>
                  Panel Members
                </Heading>
                <Stack spacing={4}>
                  {selectedPanel.faculties.map((faculty, index) => (
                    <Flex key={index} align="center">
                      <Avatar
                        size="md"
                        src={`data:image/jpeg;base64,${faculty.photo}`}
                        mr={4}
                      />
                      <Text>
                        {faculty.firstName} {faculty.lastName}
                      </Text>
                      <IconButton
                        icon={<CloseIcon />}
                        size="sm"
                        colorScheme="red"
                        ml="auto"
                        isDisabled={selectedPanel.faculties.length === 2}
                        onClick={() => {
                          deleteFacultyFromPanel(faculty._id);
                        }}
                      />
                    </Flex>
                  ))}
                </Stack>

                <Button
                  onClick={openEditFacultyModal}
                  colorScheme="green"
                  mt={4}>
                  Add Faculty
                </Button>

                <Heading size="md" mt={6} mb={4}>
                  Groups Assigned
                </Heading>
                <Stack spacing={4}>
                  {selectedPanel.groups.map((group, index) => (
                    <Flex key={index} align="center">
                      <Text>{group.title}</Text>
                      <IconButton
                        icon={<CloseIcon />}
                        size="sm"
                        colorScheme="red"
                        ml="auto"
                        isDisabled={selectedPanel.groups.length === 1}
                        onClick={() => {
                          deleteGroupFromPanel(group);
                        }}
                      />
                    </Flex>
                  ))}
                </Stack>

                <Button onClick={openEditGroupModal} colorScheme="green" mt={4}>
                  Add Groups
                </Button>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeEditModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditGroupModalOpen} onClose={closeEditGroupModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Groups</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{renderModalContent()}</ModalBody>
          <ModalFooter>
            <Button
              onClick={addNewGroups}
              colorScheme="blue"
              isDisabled={selectedGroups.length === 0}>
              Add Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditFacultyModalOpen} onClose={closeEditFacultyModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Faculty</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{renderModalContent()}</ModalBody>
          <ModalFooter>
            <Button
              onClick={addNewFaculty}
              colorScheme="blue"
              isDisabled={selectedFaculties.length === 0}>
              Add Faculty
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AssignEvaluators;
