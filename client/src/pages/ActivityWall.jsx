import profilePic from "/profilepic.png";
import UserProfile from "../components/UserProfile";
import { useState } from "react";

function ActivityWall() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      user: "John Doe",
      content: "Just joined a new project!",
      timestamp: "2h ago",
      likes: 0,
      comments: [],
      likedByUser: false,
    },
    {
      id: 2,
      user: "Jane Smith",
      content: "Looking for volunteers for our upcoming event.",
      timestamp: "4h ago",
      likes: 0,
      comments: [],
      likedByUser: false,
    },
    {
      id: 3,
      user: "Mike Johnson",
      content: "Excited to announce our new fundraising campaign!",
      timestamp: "1d ago",
      likes: 0,
      comments: [],
      likedByUser: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const handleLike = (id) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              likes: activity.likedByUser
                ? activity.likes - 1
                : activity.likes + 1,
              likedByUser: !activity.likedByUser,
            }
          : activity
      )
    );
  };

  const handleAddComment = (id, comment) => {
    if (comment) {
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === id
            ? { ...activity, comments: [...activity.comments, comment] }
            : activity
        )
      );
    }
  };

  const handleCreatePost = () => {
    if (newPostContent.trim() !== "") {
      const newPost = {
        id: activities.length + 1,
        user: "Current User",
        content: newPostContent,
        timestamp: "Just now",
        likes: 0,
        comments: [],
        likedByUser: false,
      };
      setActivities([newPost, ...activities]);
      setNewPostContent("");
    }
  };

  const filteredActivities = activities.filter((activity) =>
    activity.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <img src={profilePic} alt="User" className="w-12 h-12 rounded-full" />
          <input
            type="text"
            placeholder="Start a post"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreatePost}
            className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {filteredActivities.map((activity) => (
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
            <button
              onClick={() => handleLike(activity.id)}
              className="text-gray-500 hover:text-blue-600"
            >
              {activity.likedByUser ? "Unlike" : "Like"} ({activity.likes})
            </button>
            <button
              onClick={() =>
                handleAddComment(activity.id, prompt("Enter your comment:"))
              }
              className="text-gray-500 hover:text-blue-600"
            >
              Comment
            </button>
          </div>
          {activity.comments.length > 0 && (
            <div className="mt-4">
              <button
                className="text-gray-500 hover:text-blue-600"
                onClick={(e) =>
                  e.currentTarget.nextElementSibling.classList.toggle("hidden")
                }
              >
                View Comments ({activity.comments.length})
              </button>
              <div className="hidden mt-2 space-y-2">
                {activity.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded-md">
                    <p className="text-sm text-gray-800">{comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ActivityWall;
