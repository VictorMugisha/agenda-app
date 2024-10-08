import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGroupDetails, useDeleteGroup } from "../hooks/index";
import { useAuth } from "../hooks/useAuth";
import { useLeaveGroup } from "../hooks/useLeaveGroup";
import Loading from "../components/Loading";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import useSendRequest from "../hooks/useSendRequest";
import { getAuthToken } from "../utils/utils";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import GroupRequests from "./GroupRequests";
import EditGroupForm from "./EditGroupForm";

export default function GroupDetails({ groupId }) {
  const { group, setGroup, loading, error, fetchGroupDetails } =
    useGroupDetails(groupId);
  const { loading: requestLoading, sendRequest } = useSendRequest();
  const { isAuthenticated } = useAuth();
  const [isUserMemberOrAdmin, setIsUserMemberOrAdmin] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    deleteGroup,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteGroup();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const { leaveGroup, loading: leaveLoading } = useLeaveGroup();

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  useEffect(() => {
    const checkUserMembership = async () => {
      if (group && isAuthenticated) {
        try {
          const response = await fetch(`/api/groups/${groupId}/membership`, {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          });
          const data = await response.json();
          setIsUserMemberOrAdmin(data.isMember || data.isAdmin);
          setIsUserAdmin(data.isAdmin);
          setHasPendingRequest(data.hasPendingRequest);
        } catch (error) {
          console.error("Error checking user membership:", error);
        }
      }
    };

    checkUserMembership();
  }, [group, groupId, isAuthenticated]);

  const handleDeleteGroup = async () => {
    const success = await deleteGroup(groupId);
    if (success) {
      onClose();
      navigate("/app/mygroups");
    }
  };

  const handleUpdateGroup = (updatedGroup) => {
    setGroup((prevGroup) => ({
      ...prevGroup,
      ...updatedGroup,
    }));
    fetchGroupDetails();

    setShowEditForm(false);
  };

  const handleLeaveGroup = async () => {
    const success = await leaveGroup(groupId);
    if (success) {
      fetchGroupDetails();
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  if (!group) return <p className="text-center">No group found.</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      <img
        className="w-full h-64 object-cover rounded-lg mb-6"
        src={group.coverImg}
        alt="Group"
      />

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
        <p className="text-gray-600 text-sm mb-4">{group.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-semibold">Admin:</span>{" "}
            {group.admin.firstName} {group.admin.lastName}
          </p>
          <p>
            <span className="font-semibold">Members:</span>{" "}
            <Link
              to={`/app/group/${groupId}/members`}
              className="text-blue-500 hover:underline"
            >
              {group.members.length} Members
            </Link>
          </p>
          <p>
            <span className="font-semibold">Created:</span>{" "}
            {formatDistanceToNow(new Date(group.createdAt), {
              addSuffix: true,
            })}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(group.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6 w-full">
        <div className="flex flex-wrap gap-4 w-full">
          <Link to=".." className="w-full sm:w-1/2">
            <button className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-6 rounded-lg shadow-md w-full">
              Cancel
            </button>
          </Link>
          {isUserMemberOrAdmin ? (
            <Link to={`/app/group/${groupId}/chat`} className="w-full sm:w-1/2">
              <button className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-6 rounded-lg shadow-md w-full">
                Open
              </button>
            </Link>
          ) : hasPendingRequest ? (
            <button
              className="btn bg-yellow-200 text-yellow-800 py-2 px-6 rounded-lg shadow-md cursor-not-allowed w-full sm:w-1/2"
              disabled
            >
              Pending
            </button>
          ) : (
            <button
              className="btn app-primary-btn text-gray-700 hover:bg-gray-300 py-2 px-6 rounded-lg shadow-md w-full sm:w-1/2"
              onClick={() => sendRequest(groupId)}
              disabled={requestLoading}
              style={{ cursor: requestLoading ? "not-allowed" : "pointer" }}
            >
              Request
            </button>
          )}
        </div>
        {isUserAdmin && (
          <div className="flex flex-wrap gap-4 w-full">
            <button
              className="btn bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 rounded-lg shadow-md w-full sm:w-1/2"
              onClick={() => setShowEditForm(true)}
            >
              Edit Group
            </button>
            <button
              className="btn bg-red-500 text-white hover:bg-red-600 py-2 px-6 rounded-lg shadow-md w-full sm:w-1/2"
              onClick={onOpen}
            >
              Delete Group
            </button>
          </div>
        )}
        {isUserMemberOrAdmin && !isUserAdmin && (
          <button
            className="btn bg-red-500 text-white hover:bg-red-600 py-2 px-6 rounded-lg shadow-md w-full"
            onClick={handleLeaveGroup}
            disabled={leaveLoading}
          >
            {leaveLoading ? "Leaving..." : "Leave Group"}
          </button>
        )}
      </div>

      {isUserAdmin && <GroupRequests groupId={groupId} />}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this group? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteGroup}
              isLoading={deleteLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {deleteError && <p className="text-red-500 mt-4">{deleteError}</p>}

      <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <EditGroupForm group={group} onUpdate={handleUpdateGroup} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

GroupDetails.propTypes = {
  groupId: PropTypes.string.isRequired,
};
