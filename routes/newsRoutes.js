const express = require("express");
const router = express.Router();

const { getNewsData } = require("../controllers/newsController");

router.route("/:page").get(getNewsData);

module.exports = router;
