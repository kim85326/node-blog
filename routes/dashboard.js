var express = require("express");
var router = express.Router();
var firebaseAdminDb = require("../connections/firebase_admin");

const categoriesRef = firebaseAdminDb.ref("categories");
const articlesRef = firebaseAdminDb.ref("articles");

router.get("/archives", function(req, res) {
    res.render("dashboard/archives", { title: "Express" });
});

router.get("/articles/create", function(req, res) {
    categoriesRef.once("value", function(snapshot) {
        const categories = snapshot.val();
        res.render("dashboard/article", { categories });
    });
});

router.get("/articles/:id", function(req, res) {
    const id = req.param("id");
    let categories;
    categoriesRef
        .once("value", function(snapshot) {
            categories = snapshot.val();
        })
        .then(() => {
            return articlesRef.child(id).once("value");
        })
        .then((snapshot) => {
            let article = snapshot.val();
            res.render("dashboard/article", { article, categories });
        });
});

router.post("/articles/create", function(req, res) {
    const data = req.body;
    const articleRef = articlesRef.push();
    const id = articleRef.key;
    articleRef
        .set({
            title: data.title,
            content: data.content,
            status: data.status,
            category: data.category,
            updateTime: Math.floor(Date.now() / 1000),
        })
        .then(() => {
            res.redirect(`/dashboard/articles/${id}`);
        });
});

router.get("/categories", function(req, res) {
    const messages = req.flash("info");
    categoriesRef.once("value", function(snapshot) {
        const categories = snapshot.val();
        res.render("dashboard/categories", {
            categories,
            messages,
        });
    });
});

router.post("/categories/create", function(req, res) {
    const requestBody = req.body;

    categoriesRef
        .orderByChild("path")
        .equalTo(requestBody.path)
        .once("value")
        .then(function(snapshot) {
            if (snapshot.val() !== null) {
                req.flash("info", "已有相同路徑");
                res.redirect("/dashboard/categories");
            } else {
                categoriesRef
                    .push({
                        name: requestBody.name,
                        path: requestBody.path,
                    })
                    .then(() => {
                        res.redirect("/dashboard/categories");
                    });
            }
        });
});

router.post("/categories/delete/:id", function(req, res) {
    const id = req.param("id");
    categoriesRef
        .child(id)
        .remove()
        .then(() => {
            req.flash("info", "欄位已刪除");
            res.redirect("/dashboard/categories");
        });
});

module.exports = router;
