import "../../stylesheets/Skeleton/Skeleton.css";
import React from "react";

export function Skeleton({ width, height = "1rem", borderRadius = null }) {
  return (
    <div
      className="skeleton"
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius ? borderRadius : null,
      }}
    ></div>
  );
}

export function SkeletonH2Subtitle({ width }) {
  return (
    <div
      className="skeleton skeleton-h2-subtitle"
      style={{ width: `${width}` }}
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
