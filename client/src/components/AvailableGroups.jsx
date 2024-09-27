import { useEffect } from "react";
import { useAvailableGroups } from "../hooks/index";
import GroupCard from "./GroupCard";
import PropTypes from "prop-types";

export default function AvailableGroups({ searchQuery }) {
  const { groups, loading, error, availableGroups } = useAvailableGroups();

  useEffect(() => {
    availableGroups();
  }, [availableGroups]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  if (error)
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="grid md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
      {filteredGroups.map((group) => (
        <GroupCard key={group._id} group={group} />
      ))}
    </div>
  );
}

AvailableGroups.propTypes = {
  searchQuery: PropTypes.string,
};
