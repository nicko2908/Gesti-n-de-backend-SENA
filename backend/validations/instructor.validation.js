/**
 * @fileoverview Cadenas de validacion para las rutas de instructor.
 * Mismo patron que aprendiz.validation.js: todas las reglas de un campo van
 * encadenadas y separadas por .bail(). Ver la explicacion completa alla.
 * @module validations/instructor.validation
 */
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { instructorHelper } from "../helpers/instructor.helper.js";

const { validateExistInstructorById, validateExistDocumento } = instructorHelper;

const instructorVali = {};

/**
 * Valida los datos para registrar un instructor.
 */
instructorVali.validateRegisterInstructor = [
  check("documento", "El documento es obligatorio")
    .trim()
    .notEmpty()
    .bail()
    .custom(async (documento) => {
      await validateExistDocumento(documento);
    }),
  check("nombre", "El nombre es obligatorio").trim().notEmpty(),
  check("email", "El email es obligatorio")
    .trim()
    .notEmpty()
    .bail()
    .isEmail()
    .withMessage("El email no es valido"),
  check("especialidad", "La especialidad es obligatoria").trim().notEmpty(),
  validateFields,
];

/**
 * Valida los datos para actualizar un instructor.
 */
instructorVali.validateUpdateInstructor = [
  check("id", "El id no es valido")
    .isMongoId()
    .bail()
    .custom(async (id) => {
      await validateExistInstructorById(id);
    }),
  check("documento", "El documento es obligatorio")
    .trim()
    .notEmpty()
    .bail()
    .custom(async (documento, { req }) => {
      await validateExistDocumento(documento, req.params.id);
    }),
  check("nombre", "El nombre es obligatorio").trim().notEmpty(),
  check("email", "El email es obligatorio")
    .trim()
    .notEmpty()
    .bail()
    .isEmail()
    .withMessage("El email no es valido"),
  check("especialidad", "La especialidad es obligatoria").trim().notEmpty(),
  validateFields,
];

/**
 * Valida que el id enviado por la url corresponda a un instructor existente.
 */
instructorVali.validateExistInstructor = [
  check("id", "El id no es valido")
    .isMongoId()
    .bail()
    .custom(async (id) => {
      await validateExistInstructorById(id);
    }),
  validateFields,
];

export { instructorVali };
