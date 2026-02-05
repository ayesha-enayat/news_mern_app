import { useState, useEffect } from 'react';
import { FiSend, FiEdit2, FiTrash2, FiHeart, FiCornerDownRight } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { newsAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Comments = ({ newsId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  const fetchComments = async () => {
    try {
      const res = await newsAPI.getComments(newsId);
      setComments(res.data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await newsAPI.addComment(newsId, {
        content: newComment,
        parentCommentId: replyTo
      });

      if (replyTo) {
        // Add reply to existing comment
        setComments(comments.map(comment => {
          if (comment._id === replyTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), res.data.data]
            };
          }
          return comment;
        }));
      } else {
        setComments([{ ...res.data.data, replies: [] }, ...comments]);
      }

      setNewComment('');
      setReplyTo(null);
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleUpdate = async (commentId, content) => {
    try {
      await commentAPI.update(commentId, { content });
      
      setComments(comments.map(comment => {
        if (comment._id === commentId) {
          return { ...comment, content, isEdited: true };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply._id === commentId ? { ...reply, content, isEdited: true } : reply
            )
          };
        }
        return comment;
      }));
      
      setEditingComment(null);
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentAPI.delete(commentId);
      
      setComments(comments.filter(comment => {
        if (comment._id === commentId) return false;
        if (comment.replies) {
          comment.replies = comment.replies.filter(reply => reply._id !== commentId);
        }
        return true;
      }));
      
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleLike = async (commentId) => {
    if (!isAuthenticated) {
      toast.info('Please login to like comments');
      return;
    }

    try {
      const res = await commentAPI.toggleLike(commentId);
      
      setComments(comments.map(comment => {
        if (comment._id === commentId) {
          return { ...comment, likesCount: res.data.likesCount };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply._id === commentId ? { ...reply, likesCount: res.data.likesCount } : reply
            )
          };
        }
        return comment;
      }));
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const [editContent, setEditContent] = useState(comment.content);

    return (
      <div className={`${isReply ? 'ml-12 mt-4' : 'border-b pb-4 mb-4'}`}>
        <div className="flex items-start gap-3">
          <img
            src={comment.user?.avatar || 'https://via.placeholder.com/40'}
            alt={comment.user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{comment.user?.name}</span>
              <span className="text-sm text-gray-500">
                {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>

            {editingComment === comment._id ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-lg resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(comment._id, editContent)}
                    className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingComment(null)}
                    className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 mt-1">{comment.content}</p>
            )}

            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => handleLike(comment._id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
              >
                <FiHeart size={14} />
                {comment.likesCount || 0}
              </button>
              {!isReply && (
                <button
                  onClick={() => setReplyTo(comment._id)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
                >
                  <FiCornerDownRight size={14} />
                  Reply
                </button>
              )}
              {user?._id === comment.user?._id && (
                <>
                  <button
                    onClick={() => setEditingComment(comment._id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map(reply => (
              <CommentItem key={reply._id} comment={reply} isReply />
            ))}
          </div>
        )}

        {/* Reply form */}
        {replyTo === comment._id && (
          <form onSubmit={handleSubmit} className="ml-12 mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Reply to ${comment.user?.name}...`}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-primary-500"
              rows={2}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm flex items-center gap-2"
              >
                <FiSend size={14} /> Reply
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyTo(null);
                  setNewComment('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>

      {/* New Comment Form */}
      {!replyTo && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isAuthenticated ? "Write a comment..." : "Please login to comment"}
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-primary-500"
            rows={3}
            disabled={!isAuthenticated}
          />
          <button
            type="submit"
            disabled={!isAuthenticated || !newComment.trim()}
            className="mt-2 px-6 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend /> Post Comment
          </button>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-4">Loading comments...</div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
      ) : (
        <div>
          {comments.map(comment => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
