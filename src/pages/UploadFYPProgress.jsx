import { useState } from "react";
import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import Loading from "../Components/Loading";
import axios from "axios";
const UploadFYPProgress = () => {
  const [fyp1File, setFYP1File] = useState();
  const [fyp2File, setFYP2File] = useState();
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const toast = useToast();
  const uploadCSV = (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    axios
      .post("http://localhost:3002/uploadProgressCSV", formData, {
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
  const updateGroupProgress = (fypType) => {
    if (fypType === "FYP1") {
      setIsLoading1(true);
    } else {
      setIsLoading2(true);
    }
    axios
      .post("http://localhost:3002/updateGroupProgressFromCSV", {
        type: fypType,
      })
      .then((response) => {
        console.log(response.data);
        setIsLoading1(false);
        setIsLoading2(false);
        toast({
          title: "Progress updated successfully",
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

  const handleFYP1File = (e) => {
    const selectedFile = e.target.files[0];
    setFYP1File(selectedFile);
    uploadCSV(selectedFile, "FYP1");
  };
  const handleFYP2File = (e) => {
    const selectedFile = e.target.files[0];
    setFYP2File(selectedFile);
    uploadCSV(selectedFile, "FYP2");
  };

  return (
    <>
      <Heading mt={10} mb={4}>
        Upload FYP 1 Progress
      </Heading>
      <FormControl mb={4}>
        <FormLabel>Upload CSV File</FormLabel>
        <Input type="file" accept=".csv" onChange={(e) => handleFYP1File(e)} />
      </FormControl>
      <Flex flexDirection="column" alignItems="center">
        <Button
          onClick={() => {
            updateGroupProgress("FYP1");
          }}
          isDisabled={!fyp1File}
          colorScheme="purple">
          Upload Progress
        </Button>
        {isLoading1 && <Loading />}
      </Flex>

      <Heading mt={10} mb={4}>
        Upload FYP 2 Progress
      </Heading>
      <FormControl mb={4}>
        <FormLabel>Upload CSV File</FormLabel>
        <Input type="file" accept=".csv" onChange={(e) => handleFYP2File(e)} />
      </FormControl>
      <Flex flexDirection="column" alignItems="center">
        <Button
          onClick={() => {
            updateGroupProgress("FYP2");
          }}
          isDisabled={!fyp2File}
          colorScheme="purple">
          Upload Progress
        </Button>
        {isLoading2 && <Loading />}
      </Flex>
    </>
  );
};
export default UploadFYPProgress;
