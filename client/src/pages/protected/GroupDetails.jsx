import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useGroupDetails } from "../../hooks";

export default function GroupDetails() {
  const { id: groupId } = useParams();

  const { group, loading, error, fetchGroupDetails } = useGroupDetails(groupId);

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  if (loading) return <p>Loading group details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!group) return <p>No group found.</p>;

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-semibold pb-3">Group Details</h1>

      <div className="flex flex-col items-center">
        <img
          className="w-full h-64 object-cover rounded-xl"
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Group"
        />

        <div className="text-center">
          <h1 className="font-semibold px-8 py-2">{group.name}</h1>
          <p className="text-sm pb-4">{group.description}</p>
          <p className="text-sm pb-1">
            Admin:{" "}
            <span className="font-semibold">{group.admin.firstName}</span>
          </p>
          <p className="text-sm pb-1">
            Members: {group.members.length} Members
          </p>
          <p className="text-sm pb-1">
            Created: {new Date(group.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-3">
          <Link to="..">
            <button className="btn w-32 app-secondary-btn">Cancel</button>
          </Link>
          <button className="btn w-32 app-primary-btn">Join</button>
        </div>
      </div>
    </div>
  );
}
