import { EmptyState } from "./EmptyState";
import { PostItem } from "./PostItem";

export function PostList({ posts, currentUid, onDelete, hasMore, onLoadMore }) {
  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="postwall">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          canDelete={post.uid === currentUid}
          onDelete={onDelete}
        />
      ))}
      {hasMore && (
        <button className="loadMoreButton" onClick={onLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}
