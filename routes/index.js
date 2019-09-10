var express = require("express");
var striptags = require("striptags");
var moment = require("moment");
var firebaseAdminDb = require("../connections/firebase_admin");
var router = express.Router();

const categoriesRef = firebaseAdminDb.ref("categories");
const articlesRef = firebaseAdminDb.ref("articles");

router.get("/", function(req, res, next) {
    const currentPage = req.query.page || 1;

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

            articles.reverse();

            const totalCount = articles.length;
            const perPages = 3;
            const totalPages = Math.ceil(totalCount / perPages);
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            const startItemIndex = (currentPage - 1) * 3;
            const endItemIndex = currentPage * 3 - 1;

            const filterArticles = articles.filter(function(article, i) {
                return i >= startItemIndex && i <= endItemIndex;
            });

            res.render("index", {
                articles: filterArticles,
                categories,
                striptags,
                moment,
                totalPages,
                currentPage,
                hasPreviousPage: currentPage > 1,
                hasNextPage: currentPage < totalPages,
            });
        });
});

router.get("/post/:id", function(req, res, next) {
    const id = req.param("id");

    let categories;
    categoriesRef
        .once("value")
        .then((snapshot) => {
            categories = snapshot.val();
            return articlesRef.child(id).once("value");
        })
        .then((snapshot) => {
            const article = snapshot.val();
            article.id = snapshot.key;

            res.render("post", { article, categories, striptags, moment });
        });
});

module.exports = router;
