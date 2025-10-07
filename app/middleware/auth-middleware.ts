import { getAuth } from "@clerk/tanstack-react-start/server";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = await getWebRequest();
    console.log(request);

    const auth = await getAuth(request);

    console.log(auth);

    const userId = auth.userId;

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
