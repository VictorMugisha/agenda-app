import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "../utils/utils";

const GroupRequests = ({ groupId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/requests`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRequest = async (requestId, action) => {
    try {
      const response = await fetch(
        `/api/groups/${groupId}/requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );
      if (!response.ok) throw new Error(`Failed to ${action} request`);
      fetchRequests(); // Refresh the list after handling a request
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-4">Loading requests...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Joining Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-600 italic">No pending requests</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="bg-gray-50 p-4 rounded-md shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-800">
                    {request.user.firstName} {request.user.lastName}
                  </span>
                  <span className="text-gray-500 ml-2">@{request.user.username}</span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRequest(request._id, "accept")}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(request._id, "decline")}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

GroupRequests.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default GroupRequests;
