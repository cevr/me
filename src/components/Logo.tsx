import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 78 36" version="1.1" {...props}>
      <title>Logo</title>
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fontFamily="Megrim"
        fontSize="48"
        fontWeight="400"
        letterSpacing="1.8"
      >
        <text id="CVR" fill="currentColor">
          <tspan x="-3" y="35">
            CVR
          </tspan>
        </text>
      </g>
    </svg>
  );
};

export default Logo;
