var express = require("express");
var router = express.Router();
var firebaseAdminDb = require("../connections/firebase_admin");

const categoriesRef = firebaseAdminDb.ref("categories");

router.get("/archives", function(req, res) {
    res.render("dashboard/archives", { title: "Express" });
});

router.get("/article", function(req, res) {
    res.render("dashboard/article", { title: "Express" });
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
