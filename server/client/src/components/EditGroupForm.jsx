import PropTypes from "prop-types";
import { useState } from "react";
import { getAuthToken } from "../utils/utils";

const EditGroupForm = ({ group, onUpdate }) => {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [coverImg, setCoverImg] = useState(group.coverImg);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/groups/${group._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, coverImg }),
      });
      if (!response.ok) throw new Error("Failed to update group");
      const updatedGroup = await response.json();
      onUpdate(updatedGroup);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Group Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Group Description"
        required
      />
      <input
        type="text"
        value={coverImg}
        onChange={(e) => setCoverImg(e.target.value)}
        placeholder="Cover Image URL"
      />
      <button type="submit">Update Group</button>
      {error && <p>Error: {error}</p>}
    </form>
  );
};

EditGroupForm.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverImg: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditGroupForm;
