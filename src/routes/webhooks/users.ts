import { verifyWebhook } from "@clerk/express/webhooks";
import express, { Request, response, Response } from "express";
import { db } from "../../config";
import { users } from "../../models/usersSchema";
import { eq } from "drizzle-orm";

const app = express();

app.post(
  "/users/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const evt = await verifyWebhook(req);

      // Do something with payload
      // For this guide, log payload to console
      const eventType = evt.type;
      // console.log(
      //   `Received webhook with ID ${id} and event type of ${eventType}`
      // );
      // console.log("Webhook payload:", evt.data);

      if (eventType === "user.created") {
        const { id, first_name, last_name, image_url } = evt?.data ?? "";
        await db.insert(users).values({
          clerkId: id,
          name: `${first_name} ${last_name}`,
          imageUrl: image_url,
        });
      }

      if (eventType === "user.deleted") {
        const { id } = evt.data;

        if (!id) {
          return new Response("Missing user id", { status: 400 });
        }

        await db.delete(users).where(eq(users.clerkId, id));
      }

      if (eventType === "user.updated") {
        const { id, first_name, last_name, image_url } = evt.data;

        if (!id) {
          return new Response("Missing user id", { status: 400 });
        }

        await db
          .update(users)
          .set({
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
          })
          .where(eq(users.clerkId, id));
      }

      return res.status(200).send("Webhook received");
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).send("Error verifying webhook");
    }
  }
);

export default app;
