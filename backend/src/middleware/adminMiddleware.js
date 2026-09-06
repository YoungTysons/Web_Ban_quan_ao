const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Truy cập bị từ chối! Chức năng này chỉ dành cho quản trị viên.' });
  }
};

module.exports = { adminOnly };
