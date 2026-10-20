/**
 * Restringe una ruta a usuarios con rol ADMIN.
 * Debe usarse después de validateJWT, que es quien deja el usuario en req.
 */
const validateAdmin = (req, res, next) => {
  if (req.usuario?.rol !== "ADMIN") {
    return res
      .status(403)
      .json({ msg: "No tienes permisos para administrar usuarios" });
  }
  next();
};

export { validateAdmin };
