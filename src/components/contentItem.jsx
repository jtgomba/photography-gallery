import React, { useRef, useEffect } from "react";
import { useAnimActions, useAnimProps } from "../hooks/animStore";
import { gsap } from "gsap";

const ContentItem = ({ id, location = "Osaka" }) => {
  const el = useRef(null);
  const title = useRef(null);
  const description = useRef(null);
  const texts = useRef(null);

  const { isOpen, current } = useAnimProps();
  const { setCurrentItem, addReactRef } = useAnimActions();
  useEffect(() => {
    texts.current = [...el.current.querySelectorAll(".oh > .oh__inner")];
    addReactRef(id, {
      el: el.current,
      title: title.current,
      description: description.current,
      texts: texts.current,
    });
  }, []);

  //   useEffect(() => {
  //     if (current === id) {
  //       setCurrentItem({
  //         el: el.current,
  //         title: title.current,
  //         description: description.current,
  //         texts: texts.current,
  //       });
  //     }
  //   }, [current]);

  return (
    <div
      className="content__item"
      ref={el}>
      <h2
        className="content__item-title"
        ref={title}>
        <span className="oh">
          <span className="oh__inner">Queen of </span>
        </span>
        <span className="oh">
          <span className="oh__inner">the Sea</span>
        </span>
      </h2>
      <div
        className="content__item-description"
        ref={description}>
        <p className="oh">
          <strong className="oh__inner">{location}, 1986</strong>
        </p>
        <p className="oh">
          <span className="oh__inner">
            Hidesato felt very sorry for the Dragon King on hearing his story,
            and readily promised to do what he could to help him.
          </span>
        </p>
      </div>
    </div>
  );
};

export default ContentItem;
