const express = require("express");
const router = express.Router();
const multer = require("multer"); //import multer, a Node.js middleware for handling `multipart/form-data`. This is mainly used for file uploads.
const path = require("path");

const upload = multer({
  // Define how and where the files should be stored
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      //'destination' determines the folder where uploaded files will be saved
      cb(null, path.join(__dirname, "..", "uploads/user"));
      // __dirname gives current file's directory path
      //path.join is used to construct a platform-independent path to the "uploads/user" folder
    },
    filename: function (req, file, cb) {
      //'filename' determines the name the file will have when saved, file.originalname is the file's original name from the client
      cb(null, file.originalname); //You can also customize here to avoid overwriting, e.g., add timestamp
    },
  }),
});

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/myprofile").get(isAuthenticatedUser, getUserProfile);
router.route("/password/change").put(isAuthenticatedUser, changePassword);
router.route("/update").put(isAuthenticatedUser, updateProfile);

//Admin routes
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
