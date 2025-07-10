import { verifyWebhook } from "@clerk/tanstack-react-start/webhooks";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

import { db } from "@/db/index.server";
import { users } from "@/db/schema";
import { assertNever } from "@/lib/types";

const clerkEvents = ["user.created", "user.deleted"] as const;

export const ServerRoute = createServerFileRoute(
  "/webhooks/clerk/handle-events"
).methods({
  POST: async ({ request }) => {
    try {
      const body = await verifyWebhook(request);

      const schema = z.object({
        data: z.object({
          id: z.string(),
        }),
        type: z.literal(clerkEvents),
      });

      const { data, type } = schema.parse(body);

      if (type === "user.created") {
        const userCreatedSchema = z.object({
          id: z.string(),
        });

        const { id } = userCreatedSchema.parse(data);

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, id));

        if (existingUser.length > 0) {
          return new Response("User already exists", { status: 400 });
        }

        await db.insert(users).values({
          id,
        });

        return new Response("OK", { status: 200 });
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (type === "user.deleted") {
        const userDeletedSchema = z.object({
          id: z.string(),
        });

        const { id } = userDeletedSchema.parse(data);

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, id));

        if (existingUser.length === 0) {
          return new Response("User not found", { status: 400 });
        }

        await db
          .update(users)
          .set({
            status: "DELETED",
          })
          .where(eq(users.id, id));

        return new Response("OK", { status: 200 });
      }

      throw assertNever(type);
    } catch (error) {
      console.error(error);
      return new Response("Unauthorized", { status: 401 });
    }
  },
});
