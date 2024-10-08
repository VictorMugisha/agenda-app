import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import AvailableGroups from "../../components/AvailableGroups";

export default function HomePage() {
  const [groupSearch, setGroupSearch] = useState("");
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-semibold pb-3">Available Groups</h1>
      <label className="input input-bordered flex items-center gap-2 bg-app-primary rounded-3xl mb-4">
        <IoSearchOutline className="text-xl" />
        <input
          type="text"
          className="grow"
          placeholder="Search for groups..."
          name="groupSearch"
          value={groupSearch}
          onChange={(e) => setGroupSearch(e.target.value)}
        />
      </label>

      <div className="flex-grow overflow-hidden">
        <AvailableGroups searchQuery={groupSearch} />
      </div>
    </div>
  );
}
