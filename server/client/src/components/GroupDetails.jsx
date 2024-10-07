import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGroupDetails, useDeleteGroup } from "../hooks/index";
import { useAuth } from "../hooks/useAuth";
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
import GroupRequests from './GroupRequests';
import EditGroupForm from './EditGroupForm';

export default function GroupDetails({ groupId }) {
  const { group: initialGroup, loading, error, fetchGroupDetails } = useGroupDetails(groupId);
  const [group, setGroup] = useState(null);
  const { loading: requestLoading, sendRequest } = useSendRequest();
  const { isAuthenticated } = useAuth();
  const [isUserMemberOrAdmin, setIsUserMemberOrAdmin] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteGroup, loading: deleteLoading, error: deleteError } = useDeleteGroup();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  useEffect(() => {
    if (initialGroup) {
      setGroup(initialGroup);
    }
  }, [initialGroup]);

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
    setGroup(updatedGroup);
    setShowEditForm(false);
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
            {group.members.length} Members
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

      <div className="flex justify-center space-x-4">
        <Link to="..">
          <button className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-6 rounded-lg shadow-md">
            Cancel
          </button>
        </Link>
        {isUserMemberOrAdmin ? (
          <Link to={`/app/group/${groupId}/chat`}>
            <button className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-6 rounded-lg shadow-md">
              Open
            </button>
          </Link>
        ) : hasPendingRequest ? (
          <button
            className="btn bg-yellow-200 text-yellow-800 py-2 px-6 rounded-lg shadow-md cursor-not-allowed"
            disabled
          >
            Pending
          </button>
        ) : (
          <button
            className="btn app-primary-btn text-gray-700 hover:bg-gray-300 py-2 px-6 rounded-lg shadow-md"
            onClick={() => sendRequest(groupId)}
            disabled={requestLoading}
            style={{ cursor: requestLoading ? "not-allowed" : "pointer" }}
          >
            Request
          </button>
        )}
        {isUserAdmin && (
          <button
            className="btn bg-red-500 text-white hover:bg-red-600 py-2 px-6 rounded-lg shadow-md"
            onClick={onOpen}
          >
            Delete Group
          </button>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this group? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteGroup} isLoading={deleteLoading}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {deleteError && <p className="text-red-500 mt-4">{deleteError}</p>}

      {isUserAdmin && (
        <>
          <button onClick={() => setShowEditForm(true)}>Edit Group</button>
          <GroupRequests groupId={groupId} />
        </>
      )}

      {showEditForm && (
        <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
          <EditGroupForm 
            group={group} 
            onUpdate={handleUpdateGroup}
          />
        </Modal>
      )}
    </div>
  );
}

GroupDetails.propTypes = {
  groupId: PropTypes.string.isRequired,
};