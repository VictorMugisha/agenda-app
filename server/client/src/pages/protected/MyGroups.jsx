import { useEffect, useState } from "react";
import { useMyGroups } from "../../hooks/useMyGroups";
import GroupCard from "../../components/GroupCard";
import Loading from "../../components/Loading";

export default function MyGroups() {
  const { groups, loading, error, fetchMyGroups } = useMyGroups();
  const [groupSearch, setGroupSearch] = useState("");

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  if (loading) return <Loading />;
  
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-semibold pb-3">My Groups</h1>
      <input
        type="text"
        className="input input-bordered w-full mb-4"
        placeholder="Search my groups..."
        value={groupSearch}
        onChange={(e) => setGroupSearch(e.target.value)}
      />
      <div className="grid md:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <GroupCard key={group._id} group={group} isMyGroup={true} />
        ))}
      </div>
    </div>
  );
}
