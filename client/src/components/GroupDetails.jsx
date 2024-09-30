import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGroupDetails } from "../hooks/index";
import Loading from "../components/Loading";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import JoinGroupForm from "./JoinGroupForm";

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

  if (!group) return <p>No group found.</p>;

  return (
    <div className="flex flex-col items-center">
      <img
        className="w-full h-64 object-cover rounded-xl"
        src={group.coverImg}
        alt="Group"
      />

      <div className="text-center">
        <h1 className="font-semibold px-8 py-2">{group.name}</h1>
        <p className="text-sm pb-4">{group.description}</p>
        <p className="text-sm pb-1">
          Admin: <span className="font-semibold">{group.admin.firstName}</span>
        </p>
        <p className="text-sm pb-1">Members: {group.members.length} Members</p>
        <p className="text-sm pb-1">
          Created:{" "}
          {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })}
        </p>
        <p className="text-sm pb-1">
          Date: {new Date(group.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-center gap-4 mt-3">
        <Link to="..">
          <button className="btn w-32 app-secondary-btn">Cancel</button>
        </Link>
        <JoinGroupForm />
      </div>
    </div>
  );
}

GroupDetails.propTypes = {
  groupId: PropTypes.string,
};
