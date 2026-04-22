"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

// Use dynamic import for SwaggerUI to prevent SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Fetch the spec dynamically from our API
    fetch("/api/swagger")
      .then((res) => res.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}
