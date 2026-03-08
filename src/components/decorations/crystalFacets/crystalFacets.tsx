import React from "react"

export const CrystalFacets: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,210,111,0.10)_0%,rgba(255,210,111,0.035)_32%,rgba(14,31,51,0.0)_62%)] opacity-70" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(60deg,rgba(255,210,111,0.065)_0px,rgba(255,210,111,0.065)_1px,transparent_1px,transparent_22px)] opacity-65" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(-60deg,rgba(230,235,240,0.045)_0px,rgba(230,235,240,0.045)_1px,transparent_1px,transparent_28px)] opacity-55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,210,111,0.18),transparent_55%)] mix-blend-screen" />
    </div>
  )
}
