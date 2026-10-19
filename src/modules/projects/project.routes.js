const express = require("express");
const router = express.Router();

const projectController = require("./project.controller");
const validate = require("../../middlewares/validate");
const validateQuery = require("../../middlewares/validateQuery");
const authenticate = require("../auth/auth.middleware");
const { createProjectSchema, listProjectsSchema, updateProjectsSchema } = require("./project.validation");
router.use(authenticate);

router.post(
    "/",
    validate(createProjectSchema),
    projectController.createProject
);

router.get(
    "/",
     validateQuery(listProjectsSchema),
    projectController.getAllProjects
);


router.patch(
    "/:id",
    validate(updateProjectsSchema),
    projectController.updateProject
);

router.delete(
    "/:id",
    projectController.deleteProject
);

router.get("/:id", projectController.getProjectById);

module.exports = router;