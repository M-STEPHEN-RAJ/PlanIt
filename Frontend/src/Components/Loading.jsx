import React from 'react';
import Lottie from "lottie-react";
import loading from '../assets/loading-animation.json';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 bg-opacity-80 z-50">
      <Lottie 
        animationData={loading} 
        loop={true} 
        style={{ width: 80, height: 80 }} 
      />
    </div>
  )
}

export default Loading