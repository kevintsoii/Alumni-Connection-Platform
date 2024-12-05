// import profilePic from "/profilepic.png";
import { useState, useEffect } from "react";

function ActivityWall() {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("permission_level");

  const [searchQuery, setSearchQuery] = useState("");

  const [error, setError] = useState("");
  const [wallError, setWallError] = useState("");

  const [posts, setPosts] = useState([]);

  const [newPost, setNewPost] = useState({
    title: "",
    text: "",
  });

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/posts/?searchQuery=${encodeURIComponent(
          searchQuery
        )}`,
        {
          method: "GET",
          headers: { Authorization: `${token}` },
        }
      );

      const data = await response.json();

      console.log(data);
      if (data.error) {
        setWallError(data.error);
        if (data.error === "Invalid token") {
          setWallError("You must be logged in.");
        }
      } else {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts :", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (newPost.title.trim() !== "" && newPost.text.trim() !== "") {
      try {
        const response = await fetch("http://localhost:8000/posts/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(newPost),
        });

        const data = await response.json();

        if (data.message) {
          window.location.reload();
        } else if (data.error) {
          setError(data.error);
        }
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("All fields must be filled out!");
    }
  };

  // const handleAddComment = (id, comment) => {
  //   if (comment) {
  //     setActivities((prevActivities) =>
  //       prevActivities.map((activity) =>
  //         activity.id === id
  //           ? { ...activity, comments: [...activity.comments, comment] }
  //           : activity
  //       )
  //     );
  //   }
  // };

  function renderNewPostForm() {
    if (userType == "staff" || userType == "student" || userType == "alumni") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="flex-grow bg-gray-100 rounded-full py-2 px-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Post Description"
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
            className="flex-grow bg-gray-100 rounded-full py-2 px-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleCreatePost}
            className="w-full bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
          >
            Create Post
          </button>

          {error && <p className="text-red-500 text-center my-4">{error}</p>}
        </div>
      );
    }
  }

  // return (
  //   <div className="space-y-4">
  //     <div className="bg-white rounded-lg shadow-md p-4">
  //       <div className="flex items-center space-x-4">
  //         <img src={profilePic} alt="User" className="w-12 h-12 rounded-full" />
  //         <input
  //           type="text"
  //           placeholder="Start a post"
  //           value={newPostContent}
  //           onChange={(e) => setNewPostContent(e.target.value)}
  //           className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         />
  //         <button
  //           onClick={handleCreatePost}
  //           className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
  //         >
  //           Post
  //         </button>
  //       </div>
  //     </div>
  //     <div className="bg-white rounded-lg shadow-md p-4">
  //       <input
  //         type="text"
  //         placeholder="Search by title"
  //         value={searchQuery}
  //         onChange={(e) => setSearchQuery(e.target.value)}
  //         className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //       />
  //     </div>
  //     {filteredActivities.map((activity) => (
  //       <div key={activity.id} className="bg-white rounded-lg shadow-md p-4">
  //         <div className="flex items-center space-x-4">
  //           <img
  //             src={profilePic}
  //             alt={activity.user}
  //             className="w-12 h-12 rounded-full"
  //           />
  //           <div>
  //             <h3 className="font-semibold">{activity.user}</h3>
  //             <span className="text-sm text-gray-500">
  //               {activity.timestamp}
  //             </span>
  //           </div>
  //         </div>
  //         <p className="mt-2">{activity.content}</p>
  //         <div className="mt-4 flex space-x-4">
  //           <button
  //             onClick={() => handleLike(activity.id)}
  //             className="text-gray-500 hover:text-blue-600"
  //           >
  //             {activity.likedByUser ? "Unlike" : "Like"} ({activity.likes})
  //           </button>
  //           <button
  //             onClick={() =>
  //               handleAddComment(activity.id, prompt("Enter your comment:"))
  //             }
  //             className="text-gray-500 hover:text-blue-600"
  //           >
  //             Comment
  //           </button>
  //         </div>
  //         {activity.comments.length > 0 && (
  //           <div className="mt-4">
  //             <button
  //               className="text-gray-500 hover:text-blue-600"
  //               onClick={(e) =>
  //                 e.currentTarget.nextElementSibling.classList.toggle("hidden")
  //               }
  //             >
  //               View Comments ({activity.comments.length})
  //             </button>
  //             <div className="hidden mt-2 space-y-2">
  //               {activity.comments.map((comment, index) => (
  //                 <div key={index} className="bg-gray-100 p-2 rounded-md">
  //                   <p className="text-sm text-gray-800">{comment}</p>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     ))}
  //   </div>
  // );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Posts</h1>

        {renderNewPostForm()}

        <div className="flex bg-[#fbfbf9] rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Search by Post Title"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="mx-3 px-2 bg-blue-300 rounded-xl"
            onClick={() => fetchPosts()}
          >
            Search
          </button>
        </div>

        {wallError && (
          <p className="text-red-500 text-center my-4">{wallError}</p>
        )}

        {posts.map((post) => (
          <div
            key={post.postID}
            className="bg-[#fbfbf9] rounded-lg shadow-md p-4 mt-4"
          >
            <h3 className="font-semibold text-xl">{post.title}</h3>
            <p className="text-gray-500 mt-2">{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityWall;
