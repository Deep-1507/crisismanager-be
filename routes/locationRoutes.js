import express from "express";
import { getUserLocation } from "../controllers/locationController.js";

const router = express.Router();

router.post("/get-location", getUserLocation);

export default router;