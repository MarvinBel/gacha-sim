import React, { useEffect } from "react";
import Countdown from "../components/Countdown";
import FloatingImages from "../components/FloatingImages";

const CountdownPage: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <FloatingImages />
      <Countdown />
    </div>
  );
};

export default CountdownPage;