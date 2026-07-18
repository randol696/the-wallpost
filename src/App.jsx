import { useAuth } from "./hooks/useAuth";
import { usePosts } from "./hooks/usePosts";
import { PostForm } from "./components/PostForm";
import { PostList } from "./components/PostList";
import "./App.css";

function App() {
  const { user, authError } = useAuth();
  const { posts, loading, error, hasMore, loadMore, addPost, removePost } = usePosts();

  const handleSubmit = async ({ user: nickname, message }) => {
    if (!user) return;
    await addPost({ user: nickname, message, uid: user.uid });
  };

  return (
    <div className="container">
      <h1>The Wallpost</h1>
      <PostForm onSubmit={handleSubmit} disabled={!user} />
      {(error || authError) && (
        <p className="formError" role="alert">
          {error || authError}
        </p>
      )}
      {loading ? (
        <p className="loadingState">Loading posts...</p>
      ) : (
        <PostList
          posts={posts}
          currentUid={user?.uid}
          onDelete={removePost}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}
    </div>
  );
}

export default App;
