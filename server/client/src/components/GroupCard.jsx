import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useGroupMembership } from "../hooks/useGroupMembership";

export default function GroupCard({ group }) {
  const navigate = useNavigate();

  // Safely access properties
  const groupId = group?._id || group?.id;
  const groupName = group?.name || 'Unnamed Group';
  const groupDescription = group?.description || 'No description available';
  const adminName = group?.admin?.firstName || 'Unknown';

  const { isMember, isAdmin, hasPendingRequest, loading, error } = useGroupMembership(groupId);

  const handleClick = () => {
    if (groupId) {
      if (isMember) {
        navigate(`/app/group/${groupId}/chat`);
      } else {
        navigate(`/app/group/${groupId}`);
      }
    }
  };

  if (!groupId) {
    console.error("Group object is missing '_id' or 'id' property:", group);
    return null;
  }

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (error) {
    console.error("Error checking group membership:", error);
    // You might want to handle this error more gracefully
  }

  return (
    <div 
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer"
      tabIndex={0}
      role="button"
      aria-label={`Group ${groupName}. ${isAdmin ? 'You are the admin.' : isMember ? 'You are a member.' : hasPendingRequest ? 'Your join request is pending.' : 'Click to view details.'}`}
    >
      <h2 className="text-lg font-semibold mb-1 truncate" title={groupName}>
        {groupName}
      </h2>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2" title={groupDescription}>
        {groupDescription}
      </p>
      <p className="text-xs text-gray-500">
        Admin: {adminName}
      </p>
      {isAdmin && (
        <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Admin
        </span>
      )}
      {isMember && !isAdmin && (
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Member
        </span>
      )}
      {hasPendingRequest && (
        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Pending
        </span>
      )}
    </div>
  );
}

GroupCard.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    admin: PropTypes.shape({
      _id: PropTypes.string,
      firstName: PropTypes.string,
    }),
  }).isRequired,
};
