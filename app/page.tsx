"use client";

import { InspeccionForm } from "@/components/inspeccion-form";

export default function Home() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover sm:bg-contain"
      style={{
        backgroundImage: "url('/viacotur.png')",
        backgroundSize: "90%",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-0" />
      <div className="relative z-10 max-w-md w-full bg-white bg-opacity-90 rounded-md shadow-lg p-6 m-4">
        <InspeccionForm />
      </div>
    </div>
  );
}
