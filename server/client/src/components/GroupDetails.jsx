import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGroupDetails } from "../hooks/index";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import useSendRequest from "../hooks/useSendRequest";
import { getAuthToken } from "../utils/utils"; // Import getAuthToken utility

export default function GroupDetails({ groupId }) {
  const { group, loading, error, fetchGroupDetails } = useGroupDetails(groupId);
  const { loading: requestLoading, sendRequest } = useSendRequest();
  const { isAuthenticated } = useAuth();
  const [isUserMemberOrAdmin, setIsUserMemberOrAdmin] = useState(false);

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
        } catch (error) {
          console.error("Error checking user membership:", error);
        }
      }
    };

    checkUserMembership();
  }, [group, groupId, isAuthenticated]);

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
      </div>
    </div>
  );
}

GroupDetails.propTypes = {
  groupId: PropTypes.string.isRequired,
};
