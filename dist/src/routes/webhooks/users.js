"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webhooks_1 = require("@clerk/express/webhooks");
const express_1 = __importDefault(require("express"));
const config_1 = require("../../config");
const usersSchema_1 = require("../../models/usersSchema");
const drizzle_orm_1 = require("drizzle-orm");
const app = (0, express_1.default)();
app.post("/users/webhook", express_1.default.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const evt = yield (0, webhooks_1.verifyWebhook)(req);
        // Do something with payload
        // For this guide, log payload to console
        const eventType = evt.type;
        // console.log(
        //   `Received webhook with ID ${id} and event type of ${eventType}`
        // );
        // console.log("Webhook payload:", evt.data);
        if (eventType === "user.created") {
            const { id, first_name, last_name, image_url } = (_a = evt === null || evt === void 0 ? void 0 : evt.data) !== null && _a !== void 0 ? _a : "";
            yield config_1.db.insert(usersSchema_1.users).values({
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
            yield config_1.db.delete(usersSchema_1.users).where((0, drizzle_orm_1.eq)(usersSchema_1.users.clerkId, id));
        }
        if (eventType === "user.updated") {
            const { id, first_name, last_name, image_url } = evt.data;
            if (!id) {
                return new Response("Missing user id", { status: 400 });
            }
            yield config_1.db
                .update(usersSchema_1.users)
                .set({
                name: `${first_name} ${last_name}`,
                imageUrl: image_url,
            })
                .where((0, drizzle_orm_1.eq)(usersSchema_1.users.clerkId, id));
        }
        return res.status(200).send("Webhook received");
    }
    catch (err) {
        console.error("Error verifying webhook:", err);
        return res.status(400).send("Error verifying webhook");
    }
}));
exports.default = app;
