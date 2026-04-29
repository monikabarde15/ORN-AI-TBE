import { Router, type IRouter } from "express";
import healthRouter from "./health";
import metaRouter from "./meta";
import candidatesRouter from "./candidates";
import evaluationRouter from "./evaluation";
import recruiterRouter from "./recruiter";
import adminRouter from "./admin";
import demoRouter from "./demo";
import trainingRouter from "./training";

const router: IRouter = Router();

router.use(healthRouter);
router.use(metaRouter);
router.use(candidatesRouter);
router.use(evaluationRouter);
router.use(recruiterRouter);
router.use(adminRouter);
router.use(demoRouter);
router.use(trainingRouter);

export default router;
