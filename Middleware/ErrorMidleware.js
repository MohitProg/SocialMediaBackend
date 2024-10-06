export const Errormiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Backend Error";
  const extraDetails = err.extraDetails || "Error From Backend ";
  return res.status(status).json({ success: false, message, extraDetails });
};
