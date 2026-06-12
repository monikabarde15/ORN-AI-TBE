import { Router, type IRouter } from "express";
import healthRouter from "./health";
import metaRouter from "./meta";
import authRouter from "./auth";
import candidatesRouter from "./candidates";
import cvRouter from "./cv";
import projectsRouter from "./projects";
import evaluationRouter from "./evaluation";
import recruiterRouter from "./recruiter";
import adminRouter from "./admin";
import demoRouter from "./demo";
import trainingRouter from "./training";
import blogRouter from "./blog";
import payment from "./payment";
import liveSessions from "./live-sessions";
import learningPaths from "./learning-paths";



const router: IRouter = Router();

router.use(healthRouter);
router.use(metaRouter);
router.use(authRouter);
router.use(candidatesRouter);
router.use(cvRouter);
router.use(projectsRouter);
router.use(evaluationRouter);
router.use(recruiterRouter);
router.use(adminRouter);
router.use(demoRouter);
router.use(trainingRouter);
router.use(blogRouter);
router.use(payment);
router.use(liveSessions);
router.use(learningPaths);

export default router;
