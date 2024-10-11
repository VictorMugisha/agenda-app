import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useGroupMembership } from "../hooks/useGroupMembership";

export default function GroupCard({ group }) {
  const navigate = useNavigate();

  const groupId = group?._id || group?.id;
  const groupName = group?.name || 'Unnamed Group';
  const groupDescription = group?.description || 'No description available';
  const adminName = group?.admin?.firstName || 'Unknown';

  const { isMember, isAdmin, hasPendingRequest } = useGroupMembership(groupId);

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

  return (
    <div 
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="bg-gray-100 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer relative"
      tabIndex={0}
      role="button"
      aria-label={`Group ${groupName}. ${isAdmin ? 'You are the admin.' : isMember ? 'You are a member.' : hasPendingRequest ? 'Your join request is pending.' : 'Click to view details.'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold truncate flex-grow" title={groupName}>
          {groupName}
        </h2>
        <div className="flex flex-col gap-1">
          {isAdmin && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Admin
            </span>
          )}
          {isMember && !isAdmin && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Member
            </span>
          )}
          {hasPendingRequest && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Pending
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2" title={groupDescription}>
        {groupDescription}
      </p>
      <p className="text-xs text-gray-500">
        Admin: {adminName}
      </p>
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
