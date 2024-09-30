import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Container for the card */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md text-center">
        {/* App Title */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome to <span className="text-green-500">Groupify</span>
        </h1>

        {/* App description */}
        <p className="text-sm text-gray-600 mb-6">
          Groupify is your ultimate solution to create, manage, and collaborate
          with groups efficiently. Whether {"you're"} organizing a team, planning a
          project, or just connecting with friends, Groupify makes it simple and
          secure.
        </p>

        {/* Call to action buttons */}
        <div className="flex justify-between space-x-4">
          <Link to="/login">
            <button className="btn w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="btn w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Register
            </button>
          </Link>
        </div>
      </div>

      {/* Extra information below the buttons */}
      <div className="mt-6 max-w-lg text-center text-gray-600">
        <p>
          Start building your groups today. Easily set up private or public
          groups, invite members, and manage everything in one place. Your
          journey to organized collaboration starts here!
        </p>
      </div>
    </div>
  );
}
