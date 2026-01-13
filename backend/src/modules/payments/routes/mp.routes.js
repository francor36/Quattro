import { Router } from "express";
import { createMpPreference } from "../controllers/mp.controller.js";
import { mercadopagoWebhook } from "../controllers/mp.webhook.controller.js"

const router = Router();

router.post("/mp", createMpPreference);
router.post("/mp/webhook", mercadopagoWebhook);

export default router;
