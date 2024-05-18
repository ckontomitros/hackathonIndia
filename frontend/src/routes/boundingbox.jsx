import React from 'react';

const BoundingBox = ({ top, left, height, width }) => {
  const boundingBoxStyle = {
    top: `${top}%`,
    left: `${left}%`,
    height: `${height}%`,
    width: `${width}%`,
    borderRadius: '25%',
  };

  return (
    <div className="absolute bg-white opacity-25" style={boundingBoxStyle}></div>
  );
};

export default BoundingBox;
