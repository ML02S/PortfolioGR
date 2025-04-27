"use client";

import Image from "next/image";
import { worksReversed } from "../data/works";
import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { RightArrow, UpRightArrow } from "./arrows";
import { CardsContext } from "../cardsContext";
import Matter from 'matter-js';
import { Mouse, MouseConstraint } from 'matter-js';

export default function Cards() {
  const [screen, setScreen] = useState<Window | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { focusedCard } = useContext(CardsContext);
  const engineRef = useRef<Matter.Engine | null>(null);
  const cardsRef = useRef<{ [key: number]: Matter.Body }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardPositions, setCardPositions] = useState<{ [key: number]: { x: number; y: number; angle: number } }>({});

  const cardPadding = 8; // Match the card's CSS padding
  const cardBorderRadius = 8; // Match the card's CSS border-radius

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
  const scale = isMobile ? 0.6 : 1;

  useEffect(() => {
    setScreen(window);
    setLoading(false);

    // Initialize physics engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.002 }
    });
    engineRef.current = engine;

    // Create walls
    const wallOptions = { isStatic: true, render: { visible: false } };
    const headerHeight = 120; // Adjust if your header is taller
    const walls = [
      Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 60, wallOptions), // bottom
      Matter.Bodies.rectangle(-30, window.innerHeight / 2, 60, window.innerHeight, wallOptions), // left
      Matter.Bodies.rectangle(window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight, wallOptions), // right
      Matter.Bodies.rectangle(window.innerWidth / 2, -30, window.innerWidth, 60, wallOptions), // top
    ];

    // Create cards
    const cards = worksReversed.map((item, index) => {
      // The card's visual size includes padding
      const cardWidth = (item.width + 2 * cardPadding) * scale;
      const cardHeight = (item.height + 2 * cardPadding) * scale;
      // Randomize X position within the viewport
      const x = Math.random() * (window.innerWidth - cardWidth) + cardWidth / 2;
      // Start above the header, but randomize Y a bit
      const y = headerHeight + cardHeight / 2 - 100 - Math.random() * 100;
      // Randomize initial angle between -20 and 20 degrees
      const angle = (Math.random() - 0.5) * (Math.PI / 9);
      const card = Matter.Bodies.rectangle(x, y, cardWidth, cardHeight, {
        angle,
        restitution: 0.2,
        friction: 0.3,
        frictionAir: 0.02,
        render: { visible: false }
      });
      // Give a small random initial velocity and spin
      Matter.Body.setVelocity(card, {
        x: (Math.random() - 0.5) * 5,
        y: Math.random() * 2
      });
      Matter.Body.setAngularVelocity(card, (Math.random() - 0.5) * 0.2);
      cardsRef.current[index] = card;
      return card;
    });

    Matter.Composite.add(engine.world, [...walls, ...cards]);

    Matter.Engine.run(engine);

    // Update card positions
    let animationFrameId: number;
    const updatePositions = () => {
      if (engineRef.current) {
        Matter.Engine.update(engineRef.current, 1000 / 60); // Manually advance the physics engine
      }
      const newPositions: { [key: number]: { x: number; y: number; angle: number } } = {};
      Object.entries(cardsRef.current).forEach(([index, body]) => {
        newPositions[Number(index)] = {
          x: body.position.x,
          y: body.position.y,
          angle: body.angle
        };
      });
      setCardPositions(newPositions);
      animationFrameId = requestAnimationFrame(updatePositions);
    };
    updatePositions();

    // Handle window resize
    const handleResize = () => {
      walls[0].position.x = window.innerWidth / 2;
      walls[0].position.y = window.innerHeight + 30;
      walls[2].position.x = window.innerWidth + 30;
      walls[3].position.x = window.innerWidth / 2;
      walls[3].position.y = -30;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Engine.clear(engine);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // MouseConstraint setup in a separate effect
  useEffect(() => {
    if (!engineRef.current || !containerRef.current) return;
    const engine = engineRef.current;
    const mouse = Mouse.create(containerRef.current as HTMLElement);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.Composite.add(engine.world, mouseConstraint);
    return () => {
      Matter.Composite.remove(engine.world, mouseConstraint);
    };
  }, [containerRef.current]);

  // Only use Framer Motion for hover/active effects, not for position/rotation
  return !loading ? (
    <div ref={containerRef} className="cards-container" style={{ pointerEvents: 'auto' }}>
      {worksReversed.map((item, index) => {
        if (screen === undefined) return null;
        const cardInFocus = focusedCard !== null ? (focusedCard === item.id ? true : false) : true;
        const position = cardPositions[index];
        if (!position) return null;
        return (
          <motion.div
            key={typeof item.img_url === 'string' ? item.img_url : item.img_url.src}
            className="card-container"
            style={{
              position: 'absolute',
              left: position.x - (item.width + 2 * cardPadding) / 2,
              top: position.y - (item.height + 2 * cardPadding) / 2,
              width: item.width + 2 * cardPadding,
              height: item.height + 2 * cardPadding,
              transform: `rotate(${position.angle * (180 / Math.PI)}deg)`,
              zIndex: 2
            }}
            whileHover={{ translateY: -4 }}
            whileTap={{ scale: 1.01 }}
          >
            <div
              className={`card-${index} card`}
              style={{
                filter: cardInFocus ? "unset" : "(12px)",
                opacity: cardInFocus ? 1 : 0,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(5px)",
                width: item.width + 2 * cardPadding,
                height: item.height + 2 * cardPadding,
                overflow: 'hidden',
                borderRadius: cardBorderRadius
              }}
            >
              <div className="card-header">
                <a className="card-name card-link" href={item.url}>
                  <span>{item.id}</span>
                  {item.external ? <UpRightArrow /> : <RightArrow />}
                </a>
                <span className="card-name" style={{ opacity: 0.2 }}>
                  {item.year}
                </span>
              </div>
              <Image
                src={item.img_url}
                alt={typeof item.img_url === 'string' ? item.img_url : item.img_url.src}
                width={item.width}
                height={item.height}
                draggable={false}
                priority={true}
                style={{
                  borderRadius: cardBorderRadius - 2, // slightly less than card for a nice effect
                  width: `calc(100% - 16px)`,         // 8px padding on each side
                  height: `calc(100% - 40px)`,        // 8px padding top/bottom + space for header (24px header)
                  objectFit: 'cover',
                  margin: 8,
                  display: 'block',
                  background: '#eee'
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  ) : null;
}