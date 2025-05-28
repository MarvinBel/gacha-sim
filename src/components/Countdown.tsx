import React, { useEffect, useState } from "react";

const Countdown: React.FC = () => {
  const targetDate = new Date("2025-06-05T12:00:00");

  const [timeLeft, setTimeLeft] = useState<string>("");

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    if (difference <= 0) {
      setTimeLeft("00:00:00:00");
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft(
      `${days.toString().padStart(2, "0")}:${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    );
  };

  useEffect(() => {
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen text-white relative z-10">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-6xl font-mono">{timeLeft}</div>
      </div>
    </div>
  );
};

export default Countdown;
