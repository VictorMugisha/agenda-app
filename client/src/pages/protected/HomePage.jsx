import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
export default function HomePage() {
  const [groupSearch, setGroupSearch] = useState("");
  return (
    <div>
      <h1 className="text-2xl font-semibold pb-3">Available Groups</h1>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search for groups..."
          name="groupSearch"
          value={groupSearch}
          onChange={(e) => setGroupSearch(e.target.value)}
        />
        <IoSearchOutline />
      </label>
    </div>
  );
}
