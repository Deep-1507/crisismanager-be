import express from "express";
import { getUserLocation } from "../controllers/locationController.js";
import { triggerCallAgent } from "../controllers/locationController.js";

const router = express.Router();

router.post("/get-location", getUserLocation);
router.post("/call", triggerCallAgent);

export default router;