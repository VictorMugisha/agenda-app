import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  ModalBody,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useJoinGroup } from "../hooks/index";
import PropTypes from "prop-types";

export default function JoinGroupForm({ groupId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [inputType, setInputType] = useState("password");

  const { joinGroup, group } = useJoinGroup(groupId);

  const handleInputChange = (e) => {
    setError(false);
    setInput(e.target.value);
  };

  async function joinGroupHandler() {
    try {
      if (!input) {
        setError(true);
        return;
      }

      await joinGroup(input);
      onClose()
    } catch (error) {
      console.log(error);
    }
  }

  function showPassword() {
    setInputType(inputType === "password" ? "text" : "password");
  }

  if (group) {
    return <p>Joined group successfully</p>;
  }

  return (
    <>
      <button className="btn w-32 app-primary-btn" onClick={onOpen}>
        Join
      </button>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={{ base: "90%", md: "400px" }}>
          <ModalHeader>Joining Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={error}>
              <FormLabel>Group Password</FormLabel>
              <Input
                type={inputType}
                value={input}
                onChange={handleInputChange}
              />
              {error && (
                <FormErrorMessage>Password is required.</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={showPassword}>
              {inputType === "password" ? "Show" : "Hide"}
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={joinGroupHandler}>
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

JoinGroupForm.propTypes = {
  groupId: PropTypes.string,
};
