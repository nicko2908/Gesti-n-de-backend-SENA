import Instructor from "../models/Instructor.js";

/**
 * Funciones de apoyo para las validaciones de instructor.
 * Un helper solo consulta la base de datos y lanza un Error si algo no cumple.
 * @namespace instructorHelper
 */
const instructorHelper = {};

/**
 * Valida que exista un instructor con ese id.
 * @param {string} id
 * @throws {Error} Si el instructor no existe.
 */
instructorHelper.validateExistInstructorById = async (id) => {
  const instructor = await Instructor.findById(id);
  if (!instructor) {
    throw new Error("El instructor no existe");
  }
};

/**
 * Valida que el documento no este repetido.
 * @param {string} documento
 * @param {string} [id=null] - Id a excluir (se usa al actualizar).
 * @throws {Error} Si el documento ya esta registrado.
 */
instructorHelper.validateExistDocumento = async (documento, id = null) => {
  const instructor = await Instructor.findOne({ documento: documento.trim() });
  if (instructor) {
    if (!id || instructor._id.toString() !== id.toString()) {
      throw new Error("El documento ya esta registrado");
    }
  }
};

export { instructorHelper };
