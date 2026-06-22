const express =
  require("express");

const router =
  express.Router();

const {
  generateAIResources
} = require(
  "../controllers/aiResourceController"
);

router.post(
  "/generate",
  generateAIResources
);

module.exports = router;