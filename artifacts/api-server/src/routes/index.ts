import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gamesRouter from "./games";
import brandingDraftsRouter from "./branding-drafts";
import customUiRequestsRouter from "./custom-ui-requests";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gamesRouter);
router.use(brandingDraftsRouter);
router.use(customUiRequestsRouter);

export default router;
