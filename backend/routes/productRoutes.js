const express= require("express");
const {getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductreview, getProductreviews, deletereview} = require("../controllers/productControllers");
const { isAuthenticatedUser , authoriseRoles} = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getProductDetails);
router.route("/admin/product/new").post(isAuthenticatedUser,authoriseRoles("admin"),createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,authoriseRoles("admin"),updateProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUser,authoriseRoles("admin"),deleteProduct);
router.route("/review").put(isAuthenticatedUser,createProductreview)
router.route("/reviews").get(getProductreviews)
router.route("/reviews").delete(isAuthenticatedUser,deletereview)

module.exports = router;