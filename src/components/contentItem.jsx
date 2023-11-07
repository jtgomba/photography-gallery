import React, { useRef, useEffect } from "react";
import { useAnimActions, useAnimProps } from "../hooks/animStore";
import { gsap } from "gsap";

const ContentItem = ({ id,
  title1,
  title2,
  subtitle,
  desc }) => {
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
          <span className="oh__inner">{title1}</span>
        </span>
        <span className="oh">
          <span className="oh__inner">{title2}</span>
        </span>
      </h2>
      <div
        className="content__item-description"
        ref={description}>
        <p className="oh">
          <strong className="oh__inner">{subtitle}</strong>
        </p>
        <p className="oh">
          <span className="oh__inner">
            {desc}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ContentItem;
