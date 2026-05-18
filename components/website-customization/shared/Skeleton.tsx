import React from 'react'

const Skeleton = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => {
  return (
    <div className={`animate-pulse rounded-md bg-black/[0.06] ${className}`} style={style} />
  );
}

export default Skeleton