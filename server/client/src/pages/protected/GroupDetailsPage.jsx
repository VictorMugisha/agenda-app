import { useParams } from "react-router-dom";
import GroupDetails from "../../components/GroupDetails";

export default function GroupDetailsPage() {
  const { id: groupId } = useParams();

  return (
    <div className="container mx-auto py-8 mb-6">
      <h1 className="text-3xl font-bold text-center mb-8">Group Details</h1>
      <GroupDetails groupId={groupId} />
    </div>
  );
}
