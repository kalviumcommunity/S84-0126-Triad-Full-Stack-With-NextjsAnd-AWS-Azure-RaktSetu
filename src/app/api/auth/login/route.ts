import { ERROR_CODES } from "@/lib/errorCodes";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { loginSchema } from "@/lib/schemas/authSchema";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return sendError(
        "Invalid input",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        parsed.error.flatten()
      );
    }

    const email = parsed.data.email.trim();
    const password = parsed.data.password;

    if (!email || !email.includes("@") || password.length < 6) {
      return sendError(
        "Invalid credentials",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // NOTE: This is a mock authentication for demo purposes.
    // Replace with real DB lookup / password check in production.
    const token = "mock.jwt.token";

    return sendSuccess({ token });
  } catch {
    return sendError("Bad request", ERROR_CODES.VALIDATION_ERROR, 400);
  }
}
