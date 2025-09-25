import React from "react";

const Progressbar = ({ progress }) => {

  return (
    
    <div className="flex flex-col justify-center items-center gap-1">
      <svg width="50px" height="50px" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />

        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="8"
          strokeDasharray={2 * Math.PI * 45}                       
          strokeDashoffset={(2 * Math.PI * 45) - (2 * Math.PI * 45) * Math.min(Math.max(progress, 0.5), 100) / 100}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />

        {/* Value text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="20"
          className="text-xl font-semibold fill-gray-700"
        >
          {Number(Math.min(Math.max(progress, 0), 100).toFixed(0))}%
        </text>
      </svg>

      <p className="text-[10px] text-gray-500">Completed</p>
    </div>
  );
};

export default Progressbar;
