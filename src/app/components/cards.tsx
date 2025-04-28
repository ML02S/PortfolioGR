"use client";

import Image from "next/image";
import { worksReversed } from "../data/works";
import { useState, useEffect, useRef, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { RightArrow, UpRightArrow } from "./arrows";
import { CardsContext } from "../cardsContext";
import Matter from 'matter-js';
import { Mouse, MouseConstraint } from 'matter-js';
import MobileMenu from './MobileMenu';

const CardHeader = ({ item, index }: { item: any, index: number }) => {
  const arrowControls = useAnimation();

  return (
    <motion.div 
      className="card-header" 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        padding: '8px',
        cursor: 'pointer'
      }}
      onClick={() => window.location.href = item.url}
    >
      <motion.div 
        className="card-name" 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onHoverStart={() => {
          arrowControls.start({
            rotate: -45,
            transition: { duration: 0.2 }
          });
        }}
        onHoverEnd={() => {
          arrowControls.start({
            rotate: 0,
            transition: { duration: 0.2 }
          });
        }}
        variants={{
          hover: {
            color: "#666666",
            x: 4
          },
          tap: {
            color: "#444444",
            x: 2
          }
        }}
        whileHover="hover"
        whileTap="tap"
      >
        <span>{item.id}</span>
        <motion.span
          style={{ color: "inherit" }}
          animate={arrowControls}
        >
          {item.external ? <UpRightArrow /> : <RightArrow />}
        </motion.span>
      </motion.div>
      <span className="card-year" style={{ 
        opacity: 0.2,
        fontSize: '0.8em'
      }}>
        {item.year}
      </span>
    </motion.div>
  );
};

export default function Cards() {
  const [screen, setScreen] = useState<Window | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { focusedCard } = useContext(CardsContext);
  const engineRef = useRef<Matter.Engine | null>(null);
  const cardsRef = useRef<{ [key: number]: Matter.Body }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardPositions, setCardPositions] = useState<{ [key: number]: { x: number; y: number; angle: number } }>({});
  const isDraggingRef = useRef(false);
  const dragStartTimeRef = useRef(0);

  const cardPadding = 8; // Match the card's CSS padding
  const cardBorderRadius = 8; // Match the card's CSS border-radius

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
  const scale = isMobile ? 0.5 : 1;

  useEffect(() => {
    setScreen(window);
    setLoading(false);

    // Initialize physics engine with different settings for mobile
    const engine = Matter.Engine.create({
      gravity: { 
        x: 0, 
        y: isMobile ? 0.5 : 1, 
        scale: isMobile ? 0.001 : 0.002 
      }
    });
    engineRef.current = engine;

    // Create walls with adjusted positions for mobile
    const wallOptions = { isStatic: true, render: { visible: false } };
    const headerHeight = isMobile ? 80 : 120; // Smaller header on mobile

    // Create cards with adjusted physics for mobile
    const cards = worksReversed.map((item, index) => {
      const cardWidth = (item.width + 2 * cardPadding) * scale;
      const cardHeight = (item.height + 2 * cardPadding) * scale;
      
      // Calculate grid position for better distribution
      const cardsPerRow = isMobile ? 2 : 3;
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      
      // Calculate spacing between cards
      const horizontalSpacing = window.innerWidth / (cardsPerRow + 1);
      const verticalSpacing = (window.innerHeight - headerHeight) / (Math.ceil(worksReversed.length / cardsPerRow) + 1);
      
      // Position cards in a grid-like pattern
      const x = horizontalSpacing * (col + 1);
      const y = headerHeight + (verticalSpacing * (row + 1));
      
      // Randomize angle within a smaller range for better visibility
      const angle = (Math.random() - 0.5) * (Math.PI / 18); // ±10 degrees
      
      const card = Matter.Bodies.rectangle(x, y, cardWidth, cardHeight, {
        angle,
        restitution: isMobile ? 0.1 : 0.2,
        friction: isMobile ? 0.5 : 0.3,
        frictionAir: isMobile ? 0.05 : 0.02,
        render: { visible: false },
        // Add a small margin to prevent cards from overlapping
        chamfer: { radius: 5 }
      });

      // Very gentle initial velocity on mobile
      Matter.Body.setVelocity(card, {
        x: (Math.random() - 0.5) * (isMobile ? 1 : 5),
        y: Math.random() * (isMobile ? 0.5 : 2)
      });
      Matter.Body.setAngularVelocity(card, (Math.random() - 0.5) * (isMobile ? 0.05 : 0.2));
      
      cardsRef.current[index] = card;
      return card;
    });

    // Adjust walls to be closer to the viewport on mobile
    const wallMargin = isMobile ? 10 : 30;
    const walls = [
      Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallMargin, window.innerWidth, 60, wallOptions), // bottom
      Matter.Bodies.rectangle(-wallMargin, window.innerHeight / 2, 60, window.innerHeight, wallOptions), // left
      Matter.Bodies.rectangle(window.innerWidth + wallMargin, window.innerHeight / 2, 60, window.innerHeight, wallOptions), // right
      Matter.Bodies.rectangle(window.innerWidth / 2, -wallMargin, window.innerWidth, 60, wallOptions), // top
    ];

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
      walls[0].position.y = window.innerHeight + wallMargin;
      walls[2].position.x = window.innerWidth + wallMargin;
      walls[3].position.x = window.innerWidth / 2;
      walls[3].position.y = -wallMargin;
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

    // Track when dragging starts
    mouseConstraint.mouse.element.addEventListener('mousedown', () => {
      isDraggingRef.current = true;
      dragStartTimeRef.current = Date.now();
    });

    // Track when dragging ends
    mouseConstraint.mouse.element.addEventListener('mouseup', () => {
      isDraggingRef.current = false;
    });

    Matter.Composite.add(engine.world, mouseConstraint);
    return () => {
      Matter.Composite.remove(engine.world, mouseConstraint);
    };
  }, [containerRef.current]);

  const handleCardClick = (url: string) => {
    // Only navigate if it's a quick click (not a drag)
    if (!isDraggingRef.current && Date.now() - dragStartTimeRef.current < 200) {
      window.location.href = url;
    }
  };

  // Only use Framer Motion for hover/active effects, not for position/rotation
  return !loading ? (
    <>
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
              zIndex: 2,
              cursor: 'grab'
            }}
            whileHover={{ translateY: -4 }}
            whileTap={{ scale: 1.01, cursor: 'grabbing' }}
          >
            <div
              className={`card-${index} card`}
              style={{
                filter: cardInFocus ? "unset" : "blur(12px)",
                opacity: cardInFocus ? 1 : 0,
                backdropFilter: "blur(5px)",
                width: item.width + 2 * cardPadding,
                height: item.height + 2 * cardPadding,
                overflow: 'hidden',
                borderRadius: cardBorderRadius,
                position: 'relative'
              }}
            >
              <CardHeader item={item} index={index} />
              <Image
                src={item.img_url}
                alt={typeof item.img_url === 'string' ? item.img_url : item.img_url.src}
                width={item.width}
                height={item.height}
                draggable={false}
                priority={true}
                style={{
                    borderRadius: cardBorderRadius - 2,
                    width: `calc(100% - 16px)`,
                    height: `calc(100% - 40px)`,
                  objectFit: 'cover',
                  margin: 8,
                  display: 'block',
                    marginTop: '40px'
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
      {isMobile && <MobileMenu />}
    </>
  ) : null;
}