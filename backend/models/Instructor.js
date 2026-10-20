/**
 * @typedef {Object} Instructor
 * @property {string} documento - Numero de documento (unico).
 * @property {string} nombre - Nombre completo del instructor.
 * @property {string} email - Correo del instructor.
 * @property {string} especialidad - Area o especialidad que imparte.
 * @property {number} status - 0 = activo, 1 = inactivo.
 * @property {Date} createdAt - Fecha de creacion.
 * @property {Date} updatedAt - Fecha de ultima actualizacion.
 */
import { Schema, model } from "mongoose";

const InstructorSchema = new Schema(
  {
    documento: {
      type: String,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    especialidad: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Instructor", InstructorSchema);
