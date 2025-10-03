import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import userAuth from "./routes/userAuth/userAuthentication";
import { model } from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware({ debug: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Server started...");
});

app.use("/api", userAuth);

// app.get("/hm", legacyRequireAuth, (req: Request, res: Response) => {
//   console.log('inside get req');
//   const { userId } = getAuth(req);
//   const userInfo = clerkClient.users.getUser(userId ?? "");

//   return res.json({ userInfo });
// });

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

// export default app;