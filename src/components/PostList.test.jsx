import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostList } from "./PostList";

describe("PostList", () => {
  it("renders an empty state when there are no posts", () => {
    render(
      <PostList posts={[]} currentUid="me" onDelete={vi.fn()} hasMore={false} onLoadMore={vi.fn()} />
    );
    expect(screen.getByText(/be the first to post/i)).toBeInTheDocument();
  });

  it("renders a load more button when hasMore is true", () => {
    const posts = [{ id: "1", user: "Randol", message: "Hi", uid: "me" }];
    render(
      <PostList posts={posts} currentUid="me" onDelete={vi.fn()} hasMore={true} onLoadMore={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: /load more/i })).toBeInTheDocument();
  });
});
