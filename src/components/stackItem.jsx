import React, { useRef } from "react";
import { useAnimActions } from "../hooks/animStore";

const StackItem = ({ id, callback }) => {
  const stackItem = useRef();
  const { setCurrent } = useAnimActions();

  return (
    <div
      className="stack__item"
      style={{ backgroundImage: "url(/img/1.jpg)" }}
      ref={stackItem}
      onClick={async (e) => {
        setCurrent(id);
        callback(stackItem.current, id);
      }}></div>
  );
};

export default StackItem;
