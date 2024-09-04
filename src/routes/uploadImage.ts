import express, { Request, Response } from "express";
import multer from "multer";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const bucket = admin.storage().bucket();
      const blob = bucket.file(`images/${req.file.originalname}`);
      await blob.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      const imageUrl = await blob.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      res.json({ imageUrl: imageUrl[0] });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

export default router;
