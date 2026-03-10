import React from "react";

const GlowingStars = ({ children, className = "" }) => (
  <div className={`relative glowing-stars ${className}`}> 
    {children}
    {/* background handled via CSS pseudo-elements */}
  </div>
);

export default GlowingStars;
