import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import JoinGroupForm from "./JoinGroupForm";

export default function GroupCard({ group, isMyGroup }) {
  return (
    <div className="card shadow-md bg-app-primary">
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
      firstName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  isMyGroup: PropTypes.bool.isRequired,
};
