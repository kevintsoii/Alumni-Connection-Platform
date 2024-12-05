// import profilePic from "/profilepic.png";
import { useState, useEffect } from "react";

function ActivityWall() {
  const token = localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState({});
  const [comments, setComments] = useState({});

  const [newComment, setNewComment] = useState("");

  const toggleDropdown = (postID) => {
    setIsOpen((prev) => ({
      ...prev,
      [postID]: !prev[postID],
    }));

    if (!comments[postID]) {
      fetchComments(postID);
    }
  };

  const [error, setError] = useState("");
  const [wallError, setWallError] = useState("");

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    text: "",
    medias: [],
  });

  const [likes, setLikes] = useState([]);

  const [mediaItems, setMediaItems] = useState([]);
  const [newMedia, setNewMedia] = useState({ url: "", type: "url" });

  const addMedia = () => {
    if (mediaItems.length >= 5) {
      setError("You can only add up to 5 media items per post.");
      return;
    }

    if (newMedia.url.trim()) {
      const updatedMediaItems = [...mediaItems, newMedia];
      setMediaItems(updatedMediaItems);
      setNewMedia({ url: "", type: "url" });
      setNewPost({
        ...newPost,
        medias: updatedMediaItems.map((media) => [media.url, media.type]),
      });
    }
  };

  const removeMedia = (index) => {
    const updatedMediaItems = mediaItems.filter((_, i) => i !== index);
    setMediaItems(updatedMediaItems);
    setNewPost({
      ...newPost,
      medias: updatedMediaItems.map((media) => [media.url, media.type]),
    });
  };

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
        console.log(data);

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

  const addComment = async (id) => {
    if (newComment.trim() !== "") {
      try {
        const response = await fetch(`http://localhost:8000/comments/${id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ comment: newComment }),
        });

        const data = await response.json();

        if (data.message) {
          fetchComments(id);
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

  const fetchComments = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/comments/${id}/`, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });

      const data = await response.json();

      console.log(data);
      if (data.error) {
        setWallError(data.error);
        if (data.error === "Invalid token") {
          setWallError("You must be logged in.");
        }
      } else {
        setComments((prev) => ({
          ...prev,
          [id]: data.comments,
        }));
      }
    } catch (error) {
      console.error("Error fetching posts :", error);
    }
  };

  const handleLike = async (id, deletes = false) => {
    try {
      const response = await fetch(`http://localhost:8000/likes/${id}/`, {
        method: deletes ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      const data = await response.json();

      if (data.message) {
        if (deletes) {
          setLikes(likes.filter((like) => like !== id));
        } else {
          setLikes([...(likes || []), id]);
        }

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postID === id
              ? {
                  ...post,
                  likes: post.likes + (deletes ? -1 : 1),
                }
              : post
          )
        );
      } else if (data.error) {
        setWallError(data.error);
      }
    } catch (error) {
      setWallError(error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await fetch("http://localhost:8000/likes/", {
          method: "GET",
          headers: { Authorization: `${token}` },
        });

        const data = await response.json();

        if (data.error) {
          setWallError(data.error);
          if (data.error == "Invalid token") {
            setWallError("You must be logged in.");
          }
        } else {
          setLikes(data.likes);
        }
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };
    fetchProtectedData();
  }, []);

  function renderNewPostForm() {
    return (
      <>
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
        </div>

        <div className="">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter media URL"
              value={newMedia.url}
              onChange={(e) =>
                setNewMedia({ ...newMedia, url: e.target.value })
              }
              className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newMedia.type}
              onChange={(e) =>
                setNewMedia({ ...newMedia, type: e.target.value })
              }
              className="bg-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="photo">Photo</option>
              <option value="url">URL</option>
              <option value="video">Video</option>
            </select>
            <button
              onClick={addMedia}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>

          <ul className="flex flex-wrap gap-3 mt-4">
            {mediaItems.map((media, index) => (
              <li
                key={index}
                className="flex items-center px-3 py-2 gap-3 justify-between bg-gray-50 rounded-lg m-1 shadow"
              >
                <p className="text-sm truncate">
                  <strong>{media.type}:</strong> {media.url}
                </p>
                <button
                  onClick={() => removeMedia(index)}
                  className="font-bold text-red-500"
                >
                  X
                </button>
              </li>
            ))}
          </ul>

          {error && <p className="text-red-500 text-center my-4">{error}</p>}
        </div>

        <hr className="border-1 p-2 text-black mt-4"></hr>
      </>
    );
  }

  // return (
  //   <div className="space-y-4">
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchPosts();
              }
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
            <p className="text-gray-500 mt-1">Author: {post.creator}</p>
            <p className="text-black mt-2">{post.text}</p>

            {post.media.length > 0 && (
              <div className="flex items-center gap-x-4 gap-y-4 flex-wrap mt-3">
                {post.media.map((media, index) => (
                  <a
                    key={index}
                    href={
                      media.url.includes("http")
                        ? media.url
                        : `https://${media.url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:text-blue-700 visited:text-purple-500"
                  >
                    <span className="text-black">{media.type}: </span>
                    {media.url}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2 items-center text-center">
              <p className="text-gray-500">{post.likes} likes</p>
              <button
                onClick={() =>
                  likes?.includes(post.postID)
                    ? handleLike(post.postID, true)
                    : handleLike(post.postID)
                }
                className={`${
                  likes?.includes(post.postID) ? "bg-red-500" : "bg-green-500"
                } text-white rounded-full px-4 py-1 hover:bg-opacity-75`}
              >
                {likes?.includes(post.postID) ? "Unlike" : "Like"}
              </button>

              <div className="">
                <button
                  onClick={() => toggleDropdown(post.postID)}
                  className={`my-2 ${
                    isOpen[post.postID] ? "text-gray-600" : "text-gray-500"
                  }`}
                >
                  {isOpen[post.postID] ? "Hide" : "Show Comments"}
                </button>
              </div>
            </div>

            {isOpen[post.postID] && (
              <>
                {comments[post.postID] ? (
                  <div className="border-gray-300 mt-1">
                    {comments[post.postID].map((comment, index) => (
                      <p key={index} className="text-gray-700">
                        <span className="font-medium">
                          {comment.first} {comment.last}
                        </span>
                        : {comment.comment}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p>No comments yet!</p>
                )}

                <div className="flex mt-2 gap-3">
                  <input
                    type="text"
                    placeholder="Enter Comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-96 bg-gray-200 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      addComment(post.postID);
                      setNewComment("");
                    }}
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityWall;
