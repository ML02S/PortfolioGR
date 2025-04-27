import React, { useState, useEffect, useContext, memo, useRef, useMemo } from "react";
import { RightArrow } from "./arrows";
import { CardsContext } from "../cardsContext";
import { motion } from "framer-motion";
import { works } from "../data/works";
import "../styles/globals.css";

interface WorkData {
  id: string;
  url: string;
  year: string;
}

const fonts = [
  'Patriot, sans-serif',
  'Dearest, monospace',
  'Arizonia, serif',
  'Bilbo, Charcoal, sans-serif',
  'ShadowHand, Geneva, sans-serif',
  'Agnes, Times, serif',
  'PicNic, Geneva, sans-serif',
  'Knighthings Spikeless, Geneva, sans-serif',
];

const AnimatedText = ({ text }: { text: string }) => {
  const [fontState, setFontState] = useState({
    activeFonts: Array(text.length).fill("inherit"),
    currentIndex: -1,
    isResetting: false,
  });

  const isTextAnimatingRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  const resetToOriginalFont = useMemo(() => {
    return () => {
      setFontState((prev) => ({
        ...prev,
        isResetting: true,
      }));

      text.split("").forEach((_: string, index: number) => {
        setTimeout(() => {
          setFontState((prev) => {
            const newFonts = [...prev.activeFonts];
            newFonts[index] = "inherit";
            const allReset = newFonts.every((font) => font === "inherit");
            return {
              activeFonts: newFonts,
              currentIndex: -1,
              isResetting: !allReset,
            };
          });
        }, index * 300);
      });
    };
  }, [text]);

  useEffect(() => {
    const initialAnimation = () => {
      isTextAnimatingRef.current = true;
      const timer = setInterval(() => {
        setFontState((prev) => {
          if (prev.currentIndex >= text.length - 1) {
            clearInterval(timer);
            isTextAnimatingRef.current = false;
            setTimeout(resetToOriginalFont, 1000);
            return prev;
          }
          const newFonts = [...prev.activeFonts];
          const nextIndex = prev.currentIndex + 1;
          newFonts[nextIndex] = fonts[Math.floor(Math.random() * fonts.length)];
          return {
            ...prev,
            activeFonts: newFonts,
            currentIndex: nextIndex,
          };
        });
      }, 300);
      return () => clearInterval(timer);
    };

    const delayTimer = setTimeout(initialAnimation, 500);
    return () => clearTimeout(delayTimer);
  }, [text, resetToOriginalFont]);

  const handleTextHover = () => {
    if (isTextAnimatingRef.current || fontState.isResetting || isHovered) return;

    setIsHovered(true);
    isTextAnimatingRef.current = true;

    text.split("").forEach((_: string, index: number) => {
      setTimeout(() => {
        setFontState((prev) => {
          const newFonts = [...prev.activeFonts];
          newFonts[index] = fonts[Math.floor(Math.random() * fonts.length)];
          return { ...prev, activeFonts: newFonts };
        });

        if (index === text.length - 1) {
          setTimeout(() => {
            resetToOriginalFont();
            isTextAnimatingRef.current = false;
            setIsHovered(false);
          }, 1000);
        }
      }, index * 225);
    });
  };

  return (
    <div
      className="hover-font"
      onMouseEnter={handleTextHover}
      style={{
        display: 'inline-block',
        margin: 0,
      }}
    >
      <h1 style={{ lineHeight: 1.2, margin: 0 }}>
        {text.split("").map((letter: string, index: number) => (
          <span
            key={index}
            style={{
              fontFamily: fontState.activeFonts[index],
              transition: "font-family 0.3s ease",
              display: "inline-block",
              verticalAlign: 'top',
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </h1>
    </div>
  );
};

const HoverableWork = memo(({ id, url, year }: WorkData) => {
  const { setFocusedCard } = useContext(CardsContext);
  return (
    <motion.a
      href={url}
      className="hoverable-work"
      onHoverStart={() => setFocusedCard(id)}
      onHoverEnd={() => setFocusedCard(null)}
      style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
    >
      <span>{id}</span> <span style={{ color: "#b9b9b9" }}>{year}</span>
    </motion.a>
  );
});
HoverableWork.displayName = 'HoverableWork';

const WorksIndex = memo(({ works, className }: { works: WorkData[]; className?: string }) => (
  <div className={`works-index ${className || ''}`}>
    {works.map((work: WorkData) => (
      <HoverableWork key={work.id} id={work.id} url={work.url} year={work.year} />
    ))}
  </div>
));
WorksIndex.displayName = 'WorksIndex';

export default function Header() {
  return (
    <div className="header">
      <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
        <div
          className="header-card"
          style={{
            transform: "none",
            paddingInline: 8,
            paddingBlock: 4,
            height: "210px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <AnimatedText text="Portfolio Max Stokla" />
          <span>
          I enjoy working on projects that combine technology and graphic design. <br />
          In my free time, I like to explore history and topography.<br /><br />
          I am currently studying Communication and Multimedia Design<br />
          at Avans University of Applied Sciences in Breda.  {" "}
            <br />
            <br />
            <a className="about-link" href="/about">
              Contact <RightArrow />
            </a>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "row", paddingTop: 2, gap: 15 }}>
          <WorksIndex works={works.slice(0, Math.ceil(works.length / 2))} />
          <WorksIndex works={works.slice(Math.ceil(works.length / 2))} className="work2" />
        </div>
      </div>
    </div>
  );
}