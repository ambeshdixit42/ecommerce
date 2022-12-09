const express = require("express")
const { registerUser,loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, deleteUser, updateUserRole } = require("../controllers/userController")
const {isAuthenticatedUser , authoriseRoles} = require("../middleware/auth")


const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authoriseRoles("admin"),getAllUser)
router.route("/admin/user/:id").get(isAuthenticatedUser,authoriseRoles("admin"),getSingleUser)
router.route("/admin/user/:id").delete(isAuthenticatedUser,authoriseRoles("admin"),deleteUser)
router.route("/admin/user/:id").put(isAuthenticatedUser,authoriseRoles("admin"),updateUserRole)


module.exports = router