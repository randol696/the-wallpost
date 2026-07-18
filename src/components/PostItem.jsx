import { formatTimestamp } from "../utils/formatTimestamp";

export function PostItem({ post, canDelete, onDelete }) {
  const handleDelete = () => {
    const confirmed = window.confirm("Delete this post? This cannot be undone.");
    if (confirmed) {
      onDelete(post.id);
    }
  };

  return (
    <div className={`postMessage${post.pending ? " pending" : ""}`}>
      <div className="message">
        <p>
          <i className="fi fi-rr-comment-alt"></i> {post.message}
        </p>
        <div className="userNamePost">
          <span>Said by:</span>
          <p>
            <i className="fi fi-rr-users"></i> {post.user}
          </p>
          {post.createdAt && (
            <time className="postTime">{formatTimestamp(post.createdAt)}</time>
          )}
          {canDelete && (
            <button onClick={handleDelete} disabled={post.pending}>
              Delete Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
