import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
export default function HomePage() {
  const [groupSearch, setGroupSearch] = useState("");
  return (
    <div className="mt-4">
      <h1 className="text-2xl font-semibold pb-3">Available Groups</h1>
      <label className="input input-bordered flex items-center gap-2 bg-app-primary rounded-3xl">
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

      <div className="mt-4">
        <h1 className="text-lg pb-3">Available Groups</h1>

        <div className="grid md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="card shadow-md bg-app-primary">
            <div className="card-body">
              <h2 className="card-title text-base">Group Name</h2>
              <p className="text-sm">Group Description</p>
              <h3 className="text-sm">
                Admin:{" "}
                <span className="font-semibold">
                  Lastname
                </span>
              </h3>
              <div className="card-actions justify-end">
                <button className="btn w-32 app-primary-btn">Join</button>
              </div>
            </div>
          </div>

          <div className="card shadow-md bg-app-primary">
            <div className="card-body">
              <h2 className="card-title text-base">Group Name</h2>
              <p className="text-sm">Group Description</p>
              <h3 className="text-sm">
                Admin:{" "}
                <span className="font-semibold">
                  Lastname
                </span>
              </h3>
              <div className="card-actions justify-end">
                <button className="btn w-32 app-primary-btn">Join</button>
              </div>
            </div>
          </div>

          <div className="card shadow-md bg-app-primary">
            <div className="card-body">
              <h2 className="card-title text-base">Group Name</h2>
              <p className="text-sm">Group Description</p>
              <h3 className="text-sm">
                Admin:{" "}
                <span className="font-semibold">
                  Lastname
                </span>
              </h3>
              <div className="card-actions justify-end">
                <button className="btn w-32 app-primary-btn">Join</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
