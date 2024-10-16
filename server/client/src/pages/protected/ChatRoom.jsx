import { useParams } from "react-router-dom";

export default function ChatRoom() {
  const { friendId } = useParams();

  return (
    <div>
      <h1>Chat Room</h1>
      <p>Chat with friend ID: {friendId}</p>
      <p>This page is not implemented yet.</p>
    </div>
  );
}
