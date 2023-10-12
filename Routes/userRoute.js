const UserSpec = require("../Controllers/user");
var router = require("express").Router();

router.post("/userEmail", UserSpec.register);
router.get("/userOtp", UserSpec.getOtp);
router.post("/userGoogle", UserSpec.getGoogle);
router.post("/userVerifyEmail", UserSpec.verifyEmail);
router.post("/generateOtp", UserSpec.generateOTP);
router.post("/otpVerify", UserSpec.otpVerify);
router.post("/passwordVerify",UserSpec.passwordVerify)

module.exports = router;
