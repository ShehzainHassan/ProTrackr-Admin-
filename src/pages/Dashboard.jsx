import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

const MetricBox = ({ title, count, backgroundColor }) => {
  return (
    <Box
      w={["45%", "45%", "45%", "45%"]} // Adjusting width to ensure two boxes per row
      maxW="45%" // Max width to fit two boxes in one row
      h="150px"
      bg={backgroundColor}
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRadius="md"
      p={4}
      m={2}>
      <Text fontSize="lg" fontFamily="Open Sans, sans-serif">
        {title}
      </Text>
      <Box>
        <Heading size="3xl" fontFamily="Open Sans, sans-serif">
          <CountUp start={0} end={count} duration={2.5} />
        </Heading>
      </Box>
    </Box>
  );
};

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3002/allusers")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((err) => {
        console.error("Error fetching students ", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3002/allFaculties")
      .then((response) => {
        setFaculty(response.data);
      })
      .catch((err) => {
        console.error("Error fetching faculties ", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3002/allGroups")
      .then((response) => {
        setGroups(response.data);
      })
      .catch((err) => {
        console.error("Error fetching groups ", err);
      });
  }, []);

  return (
    <Box p={5} overflowX="hidden">
      <Heading mb={6}>Key Metrics</Heading>
      <Flex justify="space-around" wrap="wrap">
        <MetricBox
          title="Registered Students"
          count={students.length}
          backgroundColor="purple.500"
        />
        <MetricBox
          title="Registered Faculty Members"
          count={faculty.length}
          backgroundColor="green.500"
        />
        <MetricBox
          title="Total FYP Groups"
          count={groups.length}
          backgroundColor="blue.500"
        />
        <MetricBox
          title="Assigned Evaluators"
          count={15}
          backgroundColor="red.500"
        />
      </Flex>
    </Box>
  );
}
