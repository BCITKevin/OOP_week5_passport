import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";
import { getUserByEmailIdAndPassword } from "../controllers/userController";
import { userModel } from "../models/userModel";
import { Session } from "inspector";
import passportGitHubStrategy from "../middleware/passportStrategies/githubStrategy";
import { readdirSync } from "fs";

const router = express.Router();

declare module "express-session" {
  interface SessionData {
    messages: string[];
  }
}

router.get("/login", forwardAuthenticated, (req, res) => {
  const errorMsg = req.session.messages;
  console.log(errorMsg);
  res.render('login', {errorMsg: errorMsg});
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
);

router.get('/login/github',
  passport.authenticate('github', { scope: [ 'profile', 'id' ] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/auth/login');
  })

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
