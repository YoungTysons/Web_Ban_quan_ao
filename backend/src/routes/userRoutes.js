const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  updateUserRole, 
  deleteUser 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
