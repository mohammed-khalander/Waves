'use client';

import { FallbackProps } from "react-error-boundary";
import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

export function TRPCErrorFallback({ error }: FallbackProps) {
  let message = "Something went wrong";

  if (error instanceof TRPCClientError) {
    // Narrow it manually with a type assertion
    const trpcError = error as TRPCClientError<AppRouter>;
    message = trpcError.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="p-4 rounded-md bg-red-50 text-red-700">
      <h2 className="font-semibold">Error</h2>
      <p>{message}</p>
    </div>
  );
}