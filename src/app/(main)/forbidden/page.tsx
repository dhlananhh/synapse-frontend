"use client";

import React from "react";
import ForbiddenDisplay from "@/components/shared/ForbiddenDisplay";

export default function ForbiddenPage() {
  return (
    <ForbiddenDisplay
      title="403 - Forbidden"
      description="You do not have permission to access this page. This could be a private community that you have not joined yet, or a resource restricted to moderators."
    />
  );
}
