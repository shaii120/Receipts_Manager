import { Router } from "express";

import {
    createProjectController,
    deleteProjectController,
    getProjectsController,
    updateProjectController
} from "../projects/projects.controller.js";
import {
    authMiddleware,
    projectOwnerMiddleware
} from "../middlewares/auth.middleware.js";
import { paramCheckMiddleware } from "../middlewares/validation.middlewere.js";

const router: Router = Router();

router.use(authMiddleware);

router.get(
    "/",
    getProjectsController
);
router.post("/", createProjectController);
router.put(
    "/:projectId",
    paramCheckMiddleware('projectId'),
    projectOwnerMiddleware,
    updateProjectController
);
router.delete(
    "/:projectId",
    paramCheckMiddleware('projectId'),
    projectOwnerMiddleware,
    deleteProjectController
);

export default router;