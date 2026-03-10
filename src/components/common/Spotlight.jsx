import React from "react";

const Spotlight = ({ children, className = "" }) => (
  <div className={`relative spotlight ${className}`}> 
    {children}
    <div className="absolute inset-0 pointer-events-none animate-spotlight" />
  </div>
);

export default Spotlight;
