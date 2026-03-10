import React from "react";

const LampEffect = ({ children, className = "" }) => (
  <div className={`relative lamp-effect ${className}`}> 
    {children}
    <div className="absolute inset-0 pointer-events-none lamp-glow" />
  </div>
);

export default LampEffect;
