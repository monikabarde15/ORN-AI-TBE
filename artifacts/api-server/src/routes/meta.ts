import { Router, type IRouter } from "express";
import { ListRegionsResponse, ListRolesResponse } from "@workspace/api-zod";
import { REGIONS, ROLES } from "../lib/regions";

const router: IRouter = Router();

router.get("/meta/regions", (_req, res) => {
  const data = {
    phase1: REGIONS.filter((r) => r.phase === 1),
    phase2: REGIONS.filter((r) => r.phase === 2),
  };
  res.json(ListRegionsResponse.parse(data));
});

router.get("/meta/roles", (_req, res) => {
  res.json(ListRolesResponse.parse(ROLES));
});

export default router;
