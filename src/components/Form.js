import React, { useRef } from "react";

const Form = ({ handleSubmit }) => {
  // add a form that takes a message an saves it on-chain (?)
  // the "wave" should be a confirmation that the user submits the message. Like the button the user presses onSubmit"
  const msgInputRef = useRef();

  const onSubmitHandler = (e) => {
    const msg = msgInputRef.current.value;
    e.preventDefault();
    handleSubmit(msg);
  };

  return (
    <form className={"bio"} onSubmit={onSubmitHandler}>
      <div>Type your message below!</div>
      <div style={{padding: 20}}>
        <input id="msg" type="text" ref={msgInputRef} />
      </div>
      <div>
        <button type="submit">
          <span role="img" aria-label="wave">
            👋
          </span>
          at Me
        </button>
      </div>
    </form>
  );
};

export default Form;
