import { useEffect } from "react";
import { useAvailableGroups } from "../hooks/index";
import { useMyGroups } from "../hooks/useMyGroups";
import GroupCard from "./GroupCard";
import PropTypes from "prop-types";
import Loading from "./Loading";

export default function AvailableGroups({ searchQuery }) {
  const { groups, loading, error, availableGroups } = useAvailableGroups();
  const { groups: myGroups } = useMyGroups();

  useEffect(() => {
    availableGroups();
  }, [availableGroups]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />
  
  if (error)
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
        {filteredGroups.map((group) => (
          <GroupCard 
            key={group._id} 
            group={group} 
            isMyGroup={myGroups.some(myGroup => myGroup._id === group._id)}
          />
        ))}
      </div>
    </div>
  );
}

AvailableGroups.propTypes = {
  searchQuery: PropTypes.string,
};
