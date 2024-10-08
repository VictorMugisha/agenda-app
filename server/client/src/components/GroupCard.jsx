import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function GroupCard({ group, isMyGroup }) {
  const { currentUser } = useCurrentUser();

  const isAdmin = currentUser && group.admin._id === currentUser._id;

  return (
    <div className="card shadow-md bg-app-primary relative">
      {isAdmin && (
        <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Admin
        </span>
      )}
      <div className="card-body">
        <h2 className="card-title text-base">{group.name}</h2>
        <p className="text-sm">{group.description}</p>
        <h3 className="text-sm">
          Admin: <span className="font-semibold">{group.admin.firstName}</span>
        </h3>
        <div className="card-actions justify-end">
          <Link to={`/app/group/${group._id}`}>
            <button className="btn w-32 app-secondary-btn">View</button>
          </Link>
          {isMyGroup && (
            <Link to={`/app/group/${group._id}/chat`}>
              <button className="btn w-32 app-primary-btn">Chat</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

GroupCard.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    coverImg: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    admin: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  isMyGroup: PropTypes.bool,
};
