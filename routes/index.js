var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});

router.get("/post", function(req, res, next) {
    res.render("post", { title: "Express" });
});

module.exports = router;
