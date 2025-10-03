import express, { Request, Response } from "express";
import { db } from "../../config";
import { trainersTable, userDetails } from "../../models/usersSchema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

// secret key for JWT — keep this in env variables
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

app.post(
  "/register",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const { name, surname, mobile, email, imageUrl, password } = req.body;
    try {
      if (!email || !name) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and name field!",
          status: 400,
        });
      }

      // Check if user already exists
      const existing = await db
        .select()
        .from(userDetails)
        .where(eq(userDetails.email, email))
        .limit(1);
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: "User already exists",
          status: 409,
        });
      }

      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      const dbRes = await db
        .insert(userDetails)
        .values({
          email,
          name,
          password: hashed,
          surname: surname ?? null,
          phoneNumber: mobile ?? null,
          imageUrl: imageUrl ?? null,
        })
        .returning();

      const newUser = dbRes?.[0];

      if (!newUser?.id) {
        res.status(400).json({
          success: false,
          message: "Something went wrong while registering",
          status: 400,
        });
      }

      // Create JWT token
      const token = jwt.sign({ userId: newUser?.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(201).json({
        success: true,
        message: "User registered",
        token,
        status: 201,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).json({
        success: false,
        message: "Failed to register. Please try again later",
      });
    }
  }
);

app.post(
  "/login",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const isUserExist = await db
        .select()
        .from(userDetails)
        .where(eq(userDetails.email, email))
        .limit(1);

      if (isUserExist.length < 1) {
        res.status(404).json({
          success: false,
          message: "User not found!",
          status: 404,
        });
      }

      const user = isUserExist?.[0];

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
          status: 401,
        });
      }

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        status: 200,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).json({
        success: false,
        message: "Failed to login. Please try again later",
        status: 400,
      });
    }
  }
);

// add trainer
app.get(
  "/add-trainer",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const trainers = [
      {
        name: "Alice Johnson",
        specialization: "Bodybuilding",
        experience: "8", // years of experience (extra field)
        image: "session-1.jpg",
        bio: "Alice specializes in muscle building programs and hypertrophy training.",
      },
      {
        name: "Ben Smith",
        specialization: "Cardio",
        image: "session-2.jpg",
        experience: "5",
        bio: "Ben leads high intensity interval training (HIIT) and endurance sessions.",
      },
      {
        name: "Claire Lee",
        specialization: "Fitness & Wellness",
        image: "session-3.jpg",
        experience: "6",
        bio: "Claire provides balanced full-body routines and flexibility training.",
      },
      {
        name: "David Patel",
        specialization: "CrossFit",
        image: "session-4.jpg",
        experience: "7",
        bio: "David coaches functional strength and mixed modal WODs.",
      },
      {
        name: "Elena Martinez",
        specialization: "Nutrition & Conditioning",
        image: "",
        experience: "4",
        bio: "Elena guides on diet plans and metabolic conditioning to support training.",
      },
    ];

    try {
      const trainerRes = await db
        .insert(trainersTable)
        .values(trainers)
        .returning();

      if (trainerRes?.length < 1) {
        return res.status(400).json({
          success: false,
          message: "Failed to add trainer",
          status: 400,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Trainer added successfully",
        status: 200,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).json({
        success: false,
        message: "Failed to login. Please try again later",
        status: 400,
      });
    }
  }
);

// get all trainer
app.get(
  "/get-trainer",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    try {
      const trainerRes = await db.select().from(trainersTable);

      console.log(trainerRes, "lliii");

      if (trainerRes?.length < 1) {
        return res.status(400).json({
          success: true,
          message: "Failed to get trainer",
          status: 400,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Found Trainer",
        data: trainerRes,
        status: 200,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).json({
        success: false,
        message: "Failed to login. Please try again later",
        status: 400,
      });
    }
  }
);

export default app;
