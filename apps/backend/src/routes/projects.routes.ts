import { Router } from "express";

import {
    createProjectController,
    deleteProjectController,
    getProjectController,
    getProjectsController,
    updateProjectController
} from "../projects/projects.controller.js";
import {
    authMiddleware,
    projectAccessMiddleware,
    projectOwnerMiddleware,
    projectQueryAccessMiddleware,
    projectParentBodyAccessMiddleware
} from "../middlewares/auth.middleware.js";
import { paramCheckMiddleware } from "../middlewares/validation.middlewere.js";

const router: Router = Router();

router.use(authMiddleware);

router.get(
    "/",
    projectQueryAccessMiddleware,
    getProjectsController
);
router.get(
    "/:projectId",
    paramCheckMiddleware('projectId'),
    projectAccessMiddleware,
    getProjectController
);
router.post(
    "/",
    projectParentBodyAccessMiddleware,
    createProjectController
);
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