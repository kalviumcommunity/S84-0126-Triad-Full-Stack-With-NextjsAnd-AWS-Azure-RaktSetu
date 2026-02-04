import { NextResponse } from "next/server";
import { logger } from "./logger";
import { ERROR_CODES } from "./errorCodes";

interface ErrorContext {
  route?: string;
  method?: string;
  [key: string]: unknown;
}

export function handleError(
  error: unknown,
  context: string | ErrorContext = "Unknown"
): NextResponse {
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract error details
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";
  const errorStack = error instanceof Error ? error.stack : undefined;
  const errorName = error instanceof Error ? error.name : "UnknownError";

  // Prepare context for logging
  const logContext: Record<string, unknown> =
    typeof context === "string" ? { route: context } : { ...context };

  // Log full error details internally
  logger.error(errorMessage, {
    ...logContext,
    errorName,
    stack: errorStack,
    error: error instanceof Error ? error.toString() : String(error),
  });

  // Return response based on environment
  if (isDevelopment) {
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          details: {
            name: errorName,
            stack: errorStack,
          },
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  // Production: return generic user-safe message
  return NextResponse.json(
    {
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}
