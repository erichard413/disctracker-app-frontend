import "../../stylesheets/Skeleton/Skeleton.css";
import React from "react";

export function Skeleton({ size }) {
  return (
    <div
      className="skeleton"
      style={{
        width: size,
      }}
    ></div>
  );
}

export function SkeletonH2Subtitle({ size }) {
  return (
    <div
      className="skeleton skeleton-h2-subtitle"
      style={{ width: `${size}` }}
    ></div>
  );
}

export function SkeletonList({ amount, children }) {
  return (
    <>
      {Array.from({ length: amount }).map((_, i) => (
        <React.Fragment key={i}>{children}</React.Fragment>
      ))}
    </>
  );
}
