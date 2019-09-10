var express = require("express");
var striptags = require("striptags");
var moment = require("moment");
var firebaseAdminDb = require("../connections/firebase_admin");
var router = express.Router();

const categoriesRef = firebaseAdminDb.ref("categories");
const articlesRef = firebaseAdminDb.ref("articles");

router.get("/", function(req, res, next) {
    let categories;
    categoriesRef
        .once("value")
        .then((snapshot) => {
            categories = snapshot.val();
            return articlesRef.orderByChild("updateTime").once("value");
        })
        .then((snapshot) => {
            const articles = [];

            snapshot.forEach((snapshotChild) => {
                const article = snapshotChild.val();
                if (article.status === "public") {
                    article.id = snapshotChild.key;
                    articles.push(article);
                }
            });
            res.render("index", { articles, categories, striptags, moment });
        });
});

router.get("/post", function(req, res, next) {
    res.render("post", { title: "Express" });
});

module.exports = router;
