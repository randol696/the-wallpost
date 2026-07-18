import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostItem } from "./PostItem";

const post = { id: "1", user: "Randol", message: "Hello wall", uid: "author-uid" };

describe("PostItem", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not show a delete button when the current user is not the author", () => {
    render(<PostItem post={post} canDelete={false} onDelete={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /delete post/i })).not.toBeInTheDocument();
  });

  it("calls onDelete only after the user confirms", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<PostItem post={post} canDelete={true} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete post/i }));
    expect(onDelete).not.toHaveBeenCalled();

    window.confirm.mockReturnValue(true);
    await user.click(screen.getByRole("button", { name: /delete post/i }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
