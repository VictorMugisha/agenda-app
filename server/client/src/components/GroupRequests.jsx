import PropTypes from 'prop-types';
import { useGroupRequests } from '../hooks/useGroupRequests';
import Loading from './Loading';

export default function GroupRequests({ groupId }) {
  const { requests, loading, error, handleRequest } = useGroupRequests(groupId);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-sm">Error loading requests: {error}</p>;

  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Join Requests</h2>
      {requests.length === 0 ? (
        <p className="text-sm text-gray-600">No pending requests.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => (
            <li key={request._id} className="bg-white p-3 rounded shadow-sm flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="font-medium text-sm">{request.user.firstName} {request.user.lastName}</p>
                <p className="text-xs text-gray-600">{new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequest(request._id, 'accept')}
                  className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequest(request._id, 'reject')}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

GroupRequests.propTypes = {
  groupId: PropTypes.string.isRequired,
};
