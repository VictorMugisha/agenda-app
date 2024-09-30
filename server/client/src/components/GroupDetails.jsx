import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGroupDetails } from "../hooks/index";
import Loading from "../components/Loading";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
// import JoinGroupForm from "./JoinGroupForm";

export default function GroupDetails({ groupId }) {
  const { group, loading, error, fetchGroupDetails } = useGroupDetails(groupId);

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

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
        <Link to="/app/group-chat">
          <button className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-6 rounded-lg shadow-md">
            Open
          </button>
        </Link>
        {/* <JoinGroupForm groupId={groupId} /> */}
      </div>
    </div>
  );
}

GroupDetails.propTypes = {
  groupId: PropTypes.string.isRequired,
};
