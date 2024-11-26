import profilePic from "../assets/profile-pic.png";
import UserProfile from '../components/UserProfile';

function ActivityWall() {
  const activities = [
    {
      id: 1,
      user: "John Doe",
      content: "Just joined a new project!",
      timestamp: "2h ago",
    },
    {
      id: 2,
      user: "Jane Smith",
      content: "Looking for volunteers for our upcoming event.",
      timestamp: "4h ago",
    },
    {
      id: 3,
      user: "Mike Johnson",
      content: "Excited to announce our new fundraising campaign!",
      timestamp: "1d ago",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <img src={profilePic} alt="User" className="w-12 h-12 rounded-full" />
          <input
            type="text"
            placeholder="Start a post"
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {activities.map((activity) => (
        <div key={activity.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <img
              src={profilePic}
              alt={activity.user}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{activity.user}</h3>
              <span className="text-sm text-gray-500">
                {activity.timestamp}
              </span>
            </div>
          </div>
          <p className="mt-2">{activity.content}</p>
          <div className="mt-4 flex space-x-4">
            <button className="text-gray-500 hover:text-blue-600">Like</button>
            <button className="text-gray-500 hover:text-blue-600">
              Comment
            </button>
            <button className="text-gray-500 hover:text-blue-600">Share</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityWall;
