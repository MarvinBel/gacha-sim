import React, { useEffect, useState, useRef } from "react";
import mlImages from "../data/ml.json";
import ssrImages from "../data/ssr.json";
import srImages from "../data/sr.json";
import rImages from "../data/r.json";

const loadImages = () => {
  const folders = [
    { name: "ml", images: mlImages },
    { name: "ssr", images: ssrImages },
    { name: "sr", images: srImages },
    { name: "r", images: rImages },
  ];

  const images: string[] = [];

  folders.forEach((folder) => {
    folder.images.forEach((item: { filename: string }) => {
      images.push(`/characters/${folder.name}/${item.filename}`);
    });
  });

  return images;
};

const FloatingImages: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<string[]>([]);

  useEffect(() => {
    setImageFiles(loadImages());
  }, []);

  const imagesRef = useRef<any[]>([]);

  useEffect(() => {
    const moveImages = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      imagesRef.current.forEach((img: any) => {
        img.x += img.speedX;
        img.y += img.speedY;

        if (img.x <= 0 || img.x + img.width >= screenWidth) {
          img.speedX = -img.speedX;
        }

        if (img.y <= 0 || img.y + img.height >= screenHeight) {
          img.speedY = -img.speedY; 
        }

        const imageElement = document.getElementById(img.id);
        if (imageElement) {
          imageElement.style.left = `${img.x}px`;
          imageElement.style.top = `${img.y}px`;
        }
      });

      requestAnimationFrame(moveImages);
    };

    moveImages();

    return () => cancelAnimationFrame(moveImages);
  }, []);

  return (
    <div className="min-h-screen absolute inset-0 overflow-hidden">
      {imageFiles.map((src, index) => {
        const speedX = Math.random() * 0.5 + 0.5;
        const speedY = Math.random() * 0.5 + 0.5;
        const width = 100;
        const height = 100;

        imagesRef.current[index] = {
          id: `image-${index}`,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speedX,
          speedY,
          width,
          height,
        };

        return (
          <img
            key={index}
            id={`image-${index}`}
            src={src}
            alt={`character ${index}`}
            className="absolute transition-opacity duration-300"
            style={{
              left: `${imagesRef.current[index].x}px`,
              top: `${imagesRef.current[index].y}px`,
              opacity: 0.05,
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: -1,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingImages;
