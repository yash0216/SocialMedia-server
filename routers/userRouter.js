const router = require("express").Router();
const UserController = require("../controllers/userController");
const requireUser = require("../middlewares/requireUser");
router.post(
  "/follow",
  requireUser,
  UserController.followOrUnFollowUserController
);
router.get("/getFeedData", requireUser, UserController.getPostsOfFollowing);
router.get("/getMyPosts", requireUser, UserController.getMyPosts);
router.get("/getUserPosts", requireUser, UserController.getUserPosts);
router.delete("/", requireUser, UserController.deleteMyProfile);
router.get("/getMyInfo", requireUser, UserController.getMyInfo);
router.put("/", requireUser, UserController.updateUserProfile);
router.post("/getUserProfile", requireUser, UserController.getUserProfile);

module.exports = router;
