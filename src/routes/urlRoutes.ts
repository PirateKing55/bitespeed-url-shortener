import { Router } from "express";
import { generateShortUrl, getLongUrl } from "../controllers/urlController";

const router = Router();

// POst endpoint for generating short urls
router.post("/generateShortUrl", generateShortUrl);

// GET endpoint for retriveing short urls
router.get("/getLongUrl/:shortUrl", getLongUrl);

export default router;
