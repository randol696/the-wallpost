import { useState } from "react";

const MAX_USER_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 500;

export function PostForm({ onSubmit, disabled }) {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedUser = user.trim();
    const trimmedMessage = message.trim();

    if (!trimmedUser || !trimmedMessage) {
      setValidationError("Please fill in both your nickname and a message.");
      return;
    }

    setValidationError("");
    await onSubmit({ user: trimmedUser, message: trimmedMessage });
    setUser("");
    setMessage("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <i className="fi fi-rr-users"> </i>
      <input
        type="text"
        placeholder="Nickname..."
        value={user}
        maxLength={MAX_USER_LENGTH}
        onChange={(event) => setUser(event.target.value)}
      />
      <textarea
        placeholder="Message..."
        value={message}
        maxLength={MAX_MESSAGE_LENGTH}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button type="submit" id="submit" disabled={disabled}>
        Submit
      </button>
      {validationError && (
        <p className="formError" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
}
