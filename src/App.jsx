import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);
import { Observer } from "gsap/Observer";
gsap.registerPlugin(Observer);
import { useWindowSize } from "@uidotdev/usehooks";

import ContentItem from "./components/contentItem";
import StackItem from "./components/stackItem";
import { useAnimActions, useAnimProps } from "./hooks/animStore";

const body = document.body;

function App() {
  const size = useWindowSize();

  const content = useRef();
  const stack = useRef();
  const slides = useRef();
  // const scrollObserver = useRef(
  //   Observer.create({
  //     type: "wheel,touch,pointer",
  //     wheelSpeed: -1,
  //     //onDown: scrollFn,
  //     //onUp: scrollFn,
  //     tolerance: 10,
  //     preventDefault: true,
  //   })
  // );

  const backCtrl = useRef();
  const navArrowsPrev = useRef();
  const navArrowsNext = useRef();

  const [isAnimating, setIsAnimating] = useState(false);
  const { isOpen, current, totalItems, currentItem, reactRefs } =
    useAnimProps();
  const { setOpen, setCurrent } = useAnimActions();

  function callback(stackItem, id) {
    if (isAnimating || isOpen) {
      return;
    }
    setIsAnimating(true);

    //scrollObserver.current.enable();

    body.classList.add("oh");

    const scrollY = window.scrollY;

    content.current.classList.add("content--open");

    if (stackItem) {
      stackItem.classList.add("stack__item--current");
    }
    //currentItem.el.classList.add("content__item--current");
    reactRefs.get(id).el.classList.add("content__item--current");

    const items = [
      ...stack.current.querySelectorAll(
        ".stack__item:not(.stack__item--empty)"
      ),
    ];
    const state = Flip.getState(items, { props: "opacity" });

    slides.current.appendChild(stack.current);

    const itemCenter = stackItem.offsetTop + stackItem.offsetHeight / 2;
    // seems to solve a bug in firefox
    document.documentElement.scrollTop = document.body.scrollTop = 0;

    gsap.set(stack.current, {
      y: size.height / 2 - itemCenter + scrollY,
    });
    // seems to solve a bug in firefox
    document.documentElement.scrollTop = document.body.scrollTop = 0;

    // Flip
    Flip.from(state, {
      duration: 1,
      ease: "expo",
      onComplete: () => {
        setOpen(true);
        setIsAnimating(false);
      },
      // seems to solve a bug in firefox
      onStart: () =>
        (document.documentElement.scrollTop = document.body.scrollTop =
          scrollY),
      absoluteOnLeave: true,
    })
      .to(
        [...document.querySelectorAll(".title > .oh > .oh__inner")],
        {
          duration: 0.9,
          ease: "expo",
          yPercent: -101,
        },
        0
      )
      .to(
        //currentItem.texts,
        reactRefs.get(id).texts,
        {
          duration: 1,
          ease: "expo",
          startAt: { yPercent: 101 },
          yPercent: 0,
        },
        0
      )
      .to(
        backCtrl.current,
        {
          duration: 1,
          ease: "expo",
          startAt: { opacity: 0 },
          opacity: 1,
        },
        0
      )
      .to(
        [navArrowsPrev.current, navArrowsNext.current],
        {
          duration: 1,
          ease: "expo",
          startAt: {
            opacity: 0,
            y: (pos) => (pos ? -150 : 150),
          },
          y: 0,
          opacity: (pos) =>
            (id - 1 === 0 && !pos) || (id - 1 === totalItems - 1 && pos)
              ? 0
              : 1,
        },
        0
      );
  }

  function close() {
    if (isAnimating || !isOpen) {
      return;
    }
    setIsAnimating(true);

    //scrollObserver.current.disable();

    const items = [
      ...stack.current.querySelectorAll(
        ".stack__item:not(.stack__item--empty)"
      ),
    ];

    items[current - 1].classList.remove("stack__item--current");

    body.classList.remove("oh");

    const state = Flip.getState(items, { props: "opacity" });
    document.querySelector(".stack-wrap").appendChild(stack.current);

    gsap.set(stack.current, {
      y: 0,
    });

    // Flip
    Flip.from(state, {
      duration: 1,
      ease: "expo",
      onComplete: () => {
        //currentItem.el.classList.remove("content__item--current");
        reactRefs.get(current).el.classList.remove("content__item--current");
        setCurrent(-1);
        setOpen(false);
        setIsAnimating(false);
      },
      absoluteOnLeave: true,
    })
      .to(
        [...document.querySelectorAll(".title > .oh > .oh__inner")],
        {
          duration: 0.9,
          ease: "expo",
          startAt: { yPercent: 101 },
          yPercent: 0,
        },
        0
      )
      .to(
        //currentItem.texts,
        reactRefs.get(current).texts,
        {
          duration: 1,
          ease: "expo",
          yPercent: -101,
        },
        0
      )
      .to(
        backCtrl.current,
        {
          duration: 1,
          ease: "expo",
          opacity: 0,
        },
        0
      )
      .to(
        [navArrowsPrev.current, navArrowsNext.current],
        {
          duration: 1,
          ease: "expo",
          y: (pos) => (pos ? 100 : -100),
          opacity: 0,
        },
        0
      );
  }

  function navigate(direction) {
    if (
      isAnimating ||
      (direction === "next" && current - 1 === totalItems - 1) ||
      (direction === "prev" && current - 1 === 0)
    )
      return;
    setIsAnimating(true);

    const items = [
      ...stack.current.querySelectorAll(
        ".stack__item:not(.stack__item--empty)"
      ),
    ];

    const previousCurrent = current;
    const currentItem = items[previousCurrent - 1];
    const newCurrent = direction === "next" ? current + 1 : current - 1;
    setCurrent(direction === "next" ? current + 1 : current - 1);
    const upcomingItem = items[newCurrent - 1];

    currentItem.classList.remove("stack__item--current");
    upcomingItem.classList.add("stack__item--current");

    // show/hide arrows
    gsap.set(navArrowsPrev.current, { opacity: newCurrent - 1 > 0 ? 1 : 0 });
    gsap.set(navArrowsNext.current, {
      opacity: newCurrent - 1 < totalItems - 1 ? 1 : 0,
    });

    gsap
      .timeline()
      .to(stack.current, {
        duration: 1,
        ease: "expo",
        y:
          direction === "next"
            ? `-=${size.height / 2 + size.height * 0.02}`
            : `+=${size.height / 2 + size.height * 0.02}`,
        onComplete: () => {
          setIsAnimating(false);
        },
      })
      .to(
        reactRefs.get(previousCurrent).texts,
        {
          duration: 0.2,
          ease: "power1",
          yPercent: direction === "next" ? 101 : -101,
          onComplete: () =>
            reactRefs
              .get(previousCurrent)
              .el.classList.remove("content__item--current"),
        },
        0
      )
      .to(
        reactRefs.get(newCurrent).texts,
        {
          duration: 0.9,
          ease: "expo",
          startAt: { yPercent: direction === "next" ? -101 : 101 },
          onStart: () =>
            reactRefs
              .get(newCurrent)
              .el.classList.add("content__item--current"),
          yPercent: 0,
        },
        0.2
      );
  }

  return (
    <div className="loading">
      <main>
        <div className="frame">
          <div className="frame__logo">
            <h2 className="frame__logo-title">Yamada Taro</h2>
            <span className="frame__logo-subtitle">フォトグラフィー</span>
          </div>
        </div>
        <div
          className="content"
          ref={content}>
          <ContentItem
            id={1}
            location="Osaka1"
          />
          <ContentItem
            id={2}
            location="Kyoto2"
          />
          <ContentItem
            id={3}
            location="Kyoto3"
          />
          <ContentItem
            id={4}
            location="Kyoto4"
          />
          <ContentItem
            id={5}
            location="Kyoto5"
          />
          <ContentItem
            id={6}
            location="Kyoto6"
          />
          <ContentItem
            id={7}
            location="Kyoto7"
          />
          <ContentItem
            id={8}
            location="Kyoto8"
          />
          <ContentItem
            id={9}
            location="Kyoto9"
          />
          <ContentItem
            id={10}
            location="Kyoto10"
          />
          <button
            className="content__back unbutton"
            ref={backCtrl}
            onClick={() => {
              close();
            }}>
            <svg
              aria-hidden="true"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4939 20.5644C11.1821 20.8372 10.7083 20.8056 10.4356 20.4939L3.43557 12.4939C3.18814 12.2111 3.18814 11.7889 3.43557 11.5061L10.4356 3.50613C10.7083 3.1944 11.1822 3.16281 11.4939 3.43557C11.8056 3.70834 11.8372 4.18216 11.5644 4.49388L5.65283 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L5.65283 12.75L11.5644 19.5061C11.8372 19.8179 11.8056 20.2917 11.4939 20.5644Z" />
            </svg>
            <span className="oh__inner">Back</span>
          </button>
          <nav className="content__nav-wrap">
            <button
              className="content__nav content__nav--prev unbutton"
              ref={navArrowsPrev}
              onClick={() => {
                navigate("prev");
              }}>
              <svg
                width="100"
                height="267"
                viewBox="0 0 100 267">
                <path
                  d="M49.894 2.766v262.979"
                  strokeLinecap="square"
                />
                <path
                  fill="none"
                  d="M99.75 76.596C73.902 76.596 52.62 43.07 49.895 0 47.168 43.07 25.886 76.596.036 76.596"
                />
              </svg>
            </button>
            <button
              className="content__nav content__nav--next unbutton"
              ref={navArrowsNext}
              onClick={() => {
                navigate("next");
              }}>
              <svg
                width="100"
                height="267"
                viewBox="0 0 100 267">
                <path
                  d="M49.894 2.766v262.979"
                  strokeLinecap="square"
                />
                <path
                  fill="none"
                  d="M99.75 76.596C73.902 76.596 52.62 43.07 49.895 0 47.168 43.07 25.886 76.596.036 76.596"
                />
              </svg>
            </button>
          </nav>
        </div>
        <div
          className="slides"
          ref={slides}></div>
        <div className="stack-wrap">
          <div
            className="stack"
            ref={stack}>
            <div className="stack__item stack__item--empty"></div>
            <StackItem
              callback={callback}
              id={1}
            />
            <StackItem
              callback={callback}
              id={2}
            />
            <StackItem
              callback={callback}
              id={3}
            />
            <StackItem
              callback={callback}
              id={4}
            />
            <StackItem
              callback={callback}
              id={5}
            />
            <StackItem
              callback={callback}
              id={6}
            />
            <StackItem
              callback={callback}
              id={7}
            />
            <StackItem
              callback={callback}
              id={8}
            />
            <StackItem
              callback={callback}
              id={9}
            />
            <StackItem
              callback={callback}
              id={10}
            />
            <div className="stack__item stack__item--empty"></div>
          </div>
        </div>
        <div className="title">
          <h2 className="title__main oh">
            <span className="oh__inner">Photography</span>
          </h2>
          <span className="title__sub oh">
            <span className="oh__inner">1986 &mdash; 2022</span>
          </span>
        </div>
      </main>
    </div>
  );
}

export default App;
