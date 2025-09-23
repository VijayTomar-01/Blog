function requireAdmin(role = "admin") {
  return (req, res, next) => {
    if (!req.user || req.user?.role !== role) {
      return res
        .status(403)
        .json({ success: false, message: `Access denied. Only ${role} can perform this action` });
    }
    next();
  };
}

module.exports = requireAdmin;
