import PropTypes from "prop-types";

export default function GroupCard({ group }) {
  return (
    <div className="card shadow-md bg-app-primary">
      <div className="card-body">
        <h2 className="card-title text-base">{group.name}</h2>
        <p className="text-sm">{group.description}</p>
        <h3 className="text-sm">
          Admin: <span className="font-semibold">{group.admin.firstName}</span>
        </h3>
        <div className="card-actions justify-end">
          <button className="btn w-32 app-secondary-btn">View</button>
          <button className="btn w-32 app-primary-btn">Join</button>
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
};
