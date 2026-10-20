import Instructor from "../models/Instructor.js";

const instructorCtrl = {};

// Registrar un nuevo instructor
instructorCtrl.registerInstructor = async (req, res) => {
  const { documento, nombre, email, especialidad } = req.body;
  try {
    const newInstructor = new Instructor({
      documento: documento.trim(),
      nombre: nombre.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
      especialidad: especialidad.toUpperCase().trim(),
    });
    await newInstructor.save();
    res.json({ msg: "Instructor registrado correctamente" });
  } catch (error) {
    res.status(400).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Listar instructores (opcionalmente filtrados por status: /api/instructores?status=0)
instructorCtrl.getInstructores = async (req, res) => {
  const { status } = req.query;
  try {
    const instructores = await Instructor.find(status ? { status } : {}).sort({
      createdAt: -1,
    });
    res.json(instructores);
  } catch (error) {
    res.status(400).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Obtener un instructor por id
instructorCtrl.getInstructorId = async (req, res) => {
  const { id } = req.params;
  try {
    const instructor = await Instructor.findById(id);
    res.json(instructor);
  } catch (error) {
    res.status(400).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Actualizar un instructor
instructorCtrl.updateInstructor = async (req, res) => {
  const { id } = req.params;
  const { documento, nombre, email, especialidad } = req.body;
  try {
    await Instructor.findByIdAndUpdate(id, {
      documento: documento.trim(),
      nombre: nombre.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
      especialidad: especialidad.toUpperCase().trim(),
    });
    res.json({ msg: "Instructor actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Activar instructor (status 0)
instructorCtrl.activeInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    await Instructor.findByIdAndUpdate(id, { status: 0 });
    res.json({ msg: "Instructor activado correctamente" });
  } catch (error) {
    res.status(400).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Desactivar instructor (status 1)
instructorCtrl.inactiveInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    await Instructor.findByIdAndUpdate(id, { status: 1 });
    res.json({ msg: "Instructor desactivado correctamente" });
  } catch (error) {
    res.status(400).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Eliminar un instructor del sistema
instructorCtrl.deleteInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    await Instructor.findByIdAndDelete(id);
    res.json({ msg: "Instructor eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ msg: "No fue posible terminar la operacion" });
  }
};

export { instructorCtrl };
