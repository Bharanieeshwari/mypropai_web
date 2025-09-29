import React, { useState, useEffect } from "react";

const CircularProgress = ({ percentage = 100, duration = 1000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const progressValue = Math.min(
        start + (elapsed / duration) * (percentage - start),
        percentage
      );

      setProgress(progressValue);

      if (progressValue < percentage) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage, duration]);

  const degrees = (progress / 100) * 360;

  let progressColor = "#FDC1C1";
  let BackgroundColor = "#C6F8CE";

  if (progress === 100) {
    progressColor = "#1AC536";
  } else if (progress >= 90) {
    progressColor = "#10b981";
    BackgroundColor = "#C6F8CE";
  } else if (progress >= 60) {
    progressColor = "#f97316";
    BackgroundColor = "#FEDCB3";
  } else {
    progressColor = "#ef4444";
    BackgroundColor = "#FDC1C1";
  }

  return (
    <div className="relative w-32 h-32 flex items-center justify-center rounded-full">
      <div
        className="absolute inset-0 rounded-full transform -scale-x-100"
        style={{
          background: `conic-gradient(${progressColor} ${degrees}deg, ${BackgroundColor} ${degrees}deg)`,
          transition: "background 0.1s linear",
        }}
      ></div>

      {/* Inner Circle */}
      <div className="absolute inset-[10px] bg-white rounded-full flex items-center justify-center">
        <div className="text-center">
          <div
            className={`text-2xl font-semibold ${
              progress === 100
                ? "text-[#1AC536]"
                : progress >= 90
                ? "text-green-500"
                : progress >= 60
                ? "text-orange-500"
                : "text-red-500"
            }`}
          >
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
