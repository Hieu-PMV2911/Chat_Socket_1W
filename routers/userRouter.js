const express = require('express');
const {
  registerUser,
  authUser,
  allUsers,
  loginAzure,
  getAllDataAzure
} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, allUsers);
// router.route('/').post(registerUser);
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/login_azure', loginAzure);
router.get('/get_all_azure', getAllDataAzure);

module.exports = router;
