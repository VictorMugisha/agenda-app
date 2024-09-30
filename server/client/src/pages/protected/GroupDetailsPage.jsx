import { useParams } from "react-router-dom";
import GroupDetails from "../../components/GroupDetails";

export default function GroupDetailsPage() {
  const { id: groupId } = useParams();

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-semibold pb-7">Group Details</h1>

      <GroupDetails groupId={groupId} />
    </div>
  );
}
