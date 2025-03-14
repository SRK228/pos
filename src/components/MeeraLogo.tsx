import React from "react";

interface MeeraLogoProps {
  className?: string;
}

const MeeraLogo = ({ className = "h-16" }: MeeraLogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-2xl font-bold text-primary">Meera</span>
    </div>
  );
};

export default MeeraLogo;
