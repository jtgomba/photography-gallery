import React, { useRef } from "react";
import { useAnimActions } from "../hooks/animStore";

const StackItem = ({ id, callback, img }) => {
  const stackItem = useRef();
  const { setCurrent } = useAnimActions();

  return (
    <div
      className="stack__item"
      style={{ backgroundImage: `url(${img})` }}
      ref={stackItem}
      onClick={async (e) => {
        setCurrent(id);
        callback(stackItem.current, id);
      }}></div>
  );
};

export default StackItem;
