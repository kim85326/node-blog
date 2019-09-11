var express = require("express");
var firebaseClient = require("../connections/firebaseClientConnection");
var router = express.Router();

router.get("/signup", function(req, res) {
    const messages = req.flash("error");

    res.render("dashboard/signup", { messages });
});

router.post("/signup", function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;

    if (confirmPassword !== password) {
        req.flash("error", "密碼不一致");
        res.redirect("/auth/signup");
        return;
    }

    firebaseClient
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            res.redirect("/auth/signin");
        })
        .catch((error) => {
            console.log(error);
            req.flash("error", error.message);
            res.redirect("/auth/signup");
        });
});

router.get("/signin", function(req, res) {
    const messages = req.flash("error");

    res.render("dashboard/signin", { messages });
});

router.post("/signin", function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    firebaseClient
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
            req.session.uid = response.user.uid;

            res.render("dashboard");
        })
        .catch((error) => {
            req.flash("error", error.message);
            res.redirect("/auth/signin");
        });
});

router.get("/signout", function(req, res) {
    req.session.uid = "";
    res.redirect("/auth/signin");
});

module.exports = router;
