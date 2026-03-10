import React from "react";

const ShimmerBadge = ({ children, className = "" }) => (
  <span className={`relative inline-block shimmer-badge ${className}`}> 
    {children}
    <span className="absolute inset-0 bg-white/20 animate-shimmer mix-blend-overlay pointer-events-none" />
  </span>
);

export default ShimmerBadge;
