import { useState } from "react";
import { useCreateGroup } from "../../hooks/useCreateGroup";

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImg: null,
  });
  const { createGroup, error, loading, uploadingImage } = useCreateGroup();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createGroup(formData);
  };

  return (
    <div className="flex justify-center items-start py-8">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Create Group
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="Enter group description"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Cover Image (optional)
            </label>
            <input
              type="file"
              name="coverImg"
              accept="image/*"
              onChange={handleChange}
              className="file-input file-input-bordered w-full"
            />
            {uploadingImage && (
              <p className="text-blue-500 text-center mt-2">
                Uploading image...
              </p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn w-full app-primary-btn"
              disabled={loading || uploadingImage}
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
