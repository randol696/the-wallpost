import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostForm } from "./PostForm";

describe("PostForm", () => {
  it("shows a validation error and does not submit when fields are empty", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<PostForm onSubmit={onSubmit} disabled={false} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/please fill in both/i);
  });

  it("submits trimmed values and clears the form", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<PostForm onSubmit={onSubmit} disabled={false} />);

    await user.type(screen.getByPlaceholderText(/nickname/i), "  Randol  ");
    await user.type(screen.getByPlaceholderText(/message/i), "  Hello wall  ");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({ user: "Randol", message: "Hello wall" });
    await waitFor(() => expect(screen.getByPlaceholderText(/nickname/i)).toHaveValue(""));
    expect(screen.getByPlaceholderText(/message/i)).toHaveValue("");
  });

  it("disables the submit button when disabled prop is true", () => {
    render(<PostForm onSubmit={vi.fn()} disabled={true} />);
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });
});
