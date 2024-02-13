import express from "express";
import sessions, { SessionData } from "express-session";
import store from "express-session";
const router = express.Router();
const app = express();
app.use(express.urlencoded({ extended: true }));
import { ensureAuthenticated, ensureAdminAuthenticated } from "../middleware/checkAuth";
import { database, userModel } from "../models/userModel";
import { allowedNodeEnvironmentFlags } from "process";
import { session } from "passport";

router.get("/", (req, res) => {
  res.send("welcome");
});


router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const userInfo = req.user;
  const userRole = req.user?.role;
  const session: any = [];
  if (req.sessionStore.all === undefined) throw new Error("error appears.");
  req.sessionStore.all((err, sessions: any) => {
    if(err) {
      console.log(err);
    }
    if (sessions != null) {
      const sessionKeys = Object.keys(sessions);
      sessionKeys.forEach((sessionId) => {
        const sessionData = sessions[sessionId];
        const userData = {
          sessionId: sessionId,
          userId: sessionData["passport"].user,
        }
        session.push(userData);
      })
      console.log("마지막 세션: ",session);
      console.log('all the sessions are: ', sessionKeys);
      if (userRole !== "admin") {
        res.render("dashboard", {
          userInfo: userInfo,
        });
      } else {
        res.render("admin", { userInfo: userInfo, userData: session });
      }
    }
  })
});

router.get('/dashboard/revoke/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId; //qa3GmjRv5oSEKRhGwexdE3JnuNRoJvhz
  console.log("-------------------")
  console.log(sessionId);
  console.log("-------------------")
  req.sessionStore.destroy(sessionId, (err) => {
    if(err) throw (err);
  })
    res.redirect('/auth/login')
})


export default router;