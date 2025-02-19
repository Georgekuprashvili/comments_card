import React, { useState, useEffect } from "react";
import "./App.css";
import photo1 from "./assets/Profile_img.svg";
import plus from "./assets/+.svg";
import minus from "./assets/-.svg";
import replyimg from "./assets/Reply.svg";
import Deleteimg from "./assets/delete.svg";
import edit from "./assets/edit.svg";

function App() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteReplyConfirm, setDeleteReplyConfirm] = useState(null);

  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
    setComments(savedComments);
  }, []);

  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [comments]);

  const addComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        text: newComment,
        replies: [],
        time: new Date(),
        userName: "George",
        likes: 0,
      };
      setComments([newCommentObj, ...comments]);
      setNewComment("");
    }
  };

  const deleteComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
    setDeleteConfirm(null);
  };

  const deleteReply = (commentId, replyId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== replyId),
          };
        }
        return comment;
      })
    );
    setDeleteReplyConfirm(null);
  };

  const updateLikes = (id, action) => {
    setComments((prevComments) => {
      const updatedComments = prevComments.map((comment) => {
        if (comment.id === id) {
          const updatedLikes =
            action === "increase" ? comment.likes + 1 : comment.likes - 1;
          return { ...comment, likes: updatedLikes };
        }
        return comment;
      });
      return updatedComments;
    });
  };

  const EditClick = (id) => {
    setIsEditing(id);
    const commentToEdit = comments.find((comment) => comment.id === id);
    setEditComment(commentToEdit.text);
  };

  const EditReplyClick = (commentId, replyId) => {
    setEditingReply(replyId);
    const replyToEdit = comments
      .find((comment) => comment.id === commentId)
      .replies.find((reply) => reply.id === replyId);
    setEditComment(replyToEdit.text);
  };

  const UpdateComment = (id) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, text: editComment } : comment
      )
    );
    setIsEditing(null);
  };

  const UpdateReply = (commentId, replyId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId ? { ...reply, text: editComment } : reply
              ),
            }
          : comment
      )
    );
    setEditingReply(null);
  };

  const ReplyClick = (id) => {
    setVisibleReplies((prevReplies) => ({
      ...prevReplies,
      [id]: !prevReplies[id],
    }));
    if (!replyText[id]) {
      setReplyText((prevText) => ({
        ...prevText,
        [id]: "",
      }));
    }
  };

  const AddReply = (parentId, replyText) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === parentId) {
          const newReply = {
            id: Date.now(),
            text: replyText,
            replies: [],
            time: new Date(),
            userName: "George",
            likes: 0,
          };
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        return comment;
      })
    );
    setVisibleReplies((prevReplies) => ({ ...prevReplies, [parentId]: false }));
  };

  const renderReplies = (commentId, replies) => {
    return replies.map((reply) => (
      <div
        key={reply.id}
        className="mt-2 p-4 bg-white rounded-lg shadow-md w-full max-w-[730px] ml-[60px] "
      >
        <div className="flex gap-4 items-center overflow-x-hidden">
          <div className="flex flex-col items-center justify-center gap-4 mt-2 bg-[#F5F6FA] w-[40px] h-[100px] rounded-[5px] ">
            <button
              onClick={() => updateLikes(reply.id, "increase")}
              className="cursor-pointer"
            >
              <img src={plus} alt="Plus" />
            </button>
            <span className="text-[#5357B6]">{reply.likes}</span>
            <button
              onClick={() => updateLikes(reply.id, "decrease")}
              className="cursor-pointer"
            >
              <img src={minus} alt="Minus" />
            </button>
          </div>
          <img src={photo1} alt="User" className="rounded-full w-8 h-8 mr-3" />
          <div className="flex justify-between w-[100%]">
            <div>
              <p className="font-semibold">{reply.userName}</p>
              <p className="text-xs text-gray-500">
                {new Date(reply.time).toLocaleString()}{" "}
              </p>
              <p className="mt-2">{reply.text}</p>
            </div>
            <div className="flex gap-[50px]">
              <button
                onClick={() => setDeleteReplyConfirm(reply.id)}
                className="text-red-500 flex items-center cursor-pointer"
              >
                <img src={Deleteimg} alt="Delete" className="mr-1" />
                Delete
              </button>
              <button
                onClick={() => EditReplyClick(reply.id)}
                className="text-blue-500 flex items-center cursor-pointer"
              >
                <img src={edit} alt="Edit" className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => ReplyClick(commentId)}
                className="text-blue-500 flex items-center cursor-pointer"
              >
                <img src={replyimg} className="mr-1" />
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="relative h-screen flex-col flex items-center w-[100%]">
      <div className="w-full max-w-[730px] fixed bottom-0 flex-shrink-0 rounded-lg bg-white flex items-start justify-around p-5 gap-2.5 mb-2.5">
        <img src={photo1} alt="Profile" />
        <textarea
          className="w-[506px] h-[96px] p-2"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={addComment}
          className="cursor-pointer w-[104px] h-[48px] bg-[#5357B6] text-white rounded-lg hover:bg-[#A4A6D3]"
        >
          SEND
        </button>
      </div>

      <div className="flex flex-col p-4 space-y-4 overflow-y-auto items-center w-[100%] ">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="bg-white p-4 rounded-lg shadow-md w-[730px] h-auto mb-2">
              <div className="flex gap-[24px] items-center">
                <div className="flex flex-col items-center bg-[#F5F6FA] p-2 rounded-lg h-[100px] justify-around w-[40px]">
                  <button
                    onClick={() => updateLikes(comment.id, "increase")}
                    className="cursor-pointer"
                  >
                    <img src={plus} alt="Plus" />
                  </button>
                  <span className="text-[#5357B6] text-center">
                    {comment.likes}
                  </span>
                  <button
                    onClick={() => updateLikes(comment.id, "decrease")}
                    className="cursor-pointer"
                  >
                    <img src={minus} alt="Minus" />
                  </button>
                </div>

                <div className="w-full">
                  <div className="flex justify-between items-center w-full gap-[100px]">
                    <div className="flex items-center">
                      <img
                        src={photo1}
                        alt="User"
                        className="rounded-full w-8 h-8 mr-3"
                      />
                      <div>
                        <p className="font-semibold">{comment.userName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.time).toLocaleString()}{" "}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-[50px]">
                      <button
                        onClick={() => setDeleteConfirm(comment.id)}
                        className="text-red-500 flex items-center cursor-pointer"
                      >
                        <img src={Deleteimg} alt="Delete" className="mr-1" />
                        Delete
                      </button>
                      <button
                        onClick={() => EditClick(comment.id)}
                        className="text-blue-500 flex items-center cursor-pointer"
                      >
                        <img src={edit} alt="Edit" className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => ReplyClick(comment.id)}
                        className="text-blue-500 flex items-center cursor-pointer"
                      >
                        <img src={replyimg} alt="Reply" className="mr-1" />
                        Reply
                      </button>
                    </div>
                  </div>

                  {isEditing === comment.id ? (
                    <div className="flex flex-col items-end">
                      <textarea
                        className="w-full mt-2 p-2 rounded-lg border-[#5357B6] border-[1px] outline-solid"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                      <button
                        onClick={() => UpdateComment(comment.id)}
                        className="mt-2 w-[104px] py-2 bg-[#5357B6] text-white rounded-lg"
                      >
                        UPDATE
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 w-[618px] h-[auto]">{comment.text}</p>
                  )}
                </div>
              </div>
            </div>

            {comment.replies.length > 0 &&
              renderReplies(comment.id, comment.replies)}
          </div>
        ))}
      </div>

      {comments.map(
        (comment) =>
          visibleReplies[comment.id] && (
            <div
              key={`reply-${comment.id}`}
              className="reply-section mt-4 p-4 w-[642px] bg-white border-[0px] rounded-lg ml-[90px] flex gap-[30px]"
            >
              <textarea
                className="w-full h-[96px] p-2 border-[#5357B6] border-[1px] outline-solid rounded-lg"
                placeholder="Write a reply..."
                onChange={(e) =>
                  setReplyText((prevText) => ({
                    ...prevText,
                    [comment.id]: e.target.value,
                  }))
                }
                value={replyText[comment.id] || ""}
              />
              <button
                onClick={() => AddReply(comment.id, replyText[comment.id])}
                className="cursor-pointer w-[104px] h-[48px] bg-[#5357B6] text-white rounded-lg hover:bg-[#A4A6D3]"
              >
                Reply
              </button>
            </div>
          )
      )}

      {deleteConfirm && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setDeleteConfirm(null);
          }}
          className="fixed inset-0 flex items-center justify-center bg-gray-300 opacity-95"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col align-baseline"
          >
            <h2 className="text-lg font-semibold">Delete comment</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this <br /> comment? This will
              remove the comment <br /> and can’t be undone.
            </p>
            <div className="mt-4 flex justify-between space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                onClick={() => deleteComment(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
