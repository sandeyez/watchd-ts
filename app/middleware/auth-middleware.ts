import { auth } from "@/auth";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = await getWebRequest();
    console.log(request);

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user.id;

    if (!userId) {
      throw new Response("Unauthorized", { status: 401 });
    }

    return next({
      context: {
        userId,
      },
    });
  }
);
