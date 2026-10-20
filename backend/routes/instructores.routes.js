import { Router } from "express";
import { instructorCtrl } from "../controller/instructor.controller.js";
import { instructorVali } from "../validations/instructor.validation.js";

const {
  validateRegisterInstructor,
  validateUpdateInstructor,
  validateExistInstructor,
} = instructorVali;

const {
  registerInstructor,
  getInstructores,
  getInstructorId,
  updateInstructor,
  activeInstructor,
  inactiveInstructor,
  deleteInstructor,
} = instructorCtrl;

const routerInstructor = Router();

// GET /api/instructores                 -> lista todos
routerInstructor.get("/", getInstructores);

// GET /api/instructores/:id             -> uno por id
routerInstructor.get("/:id", validateExistInstructor, getInstructorId);

// POST /api/instructores/register       -> crear
routerInstructor.post(
  "/register",
  validateRegisterInstructor,
  registerInstructor
);

// PUT /api/instructores/update/:id      -> actualizar
routerInstructor.put("/update/:id", validateUpdateInstructor, updateInstructor);

// PUT /api/instructores/active/:id      -> activar
routerInstructor.put("/active/:id", validateExistInstructor, activeInstructor);

// PUT /api/instructores/inactive/:id    -> desactivar
routerInstructor.put(
  "/inactive/:id",
  validateExistInstructor,
  inactiveInstructor
);

// DELETE /api/instructores/:id          -> eliminar del sistema
routerInstructor.delete("/:id", validateExistInstructor, deleteInstructor);

export { routerInstructor };
