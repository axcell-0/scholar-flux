import { Suspense } from "react";
import VerifyCodeClient from "./VerifyCodeClient";

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading verification page...</div>}>
      <VerifyCodeClient />
    </Suspense>
  );
}