/////////////////////////////// IMPORTS  ////////////////////////////////
import dotenv from "dotenv"
import express from "express"
import fs from "fs"
import https from "https"
import replyUnreadMails from "./helpers/gmail.js"
import { authURL, oauth2Client } from "./helpers/oauth.js"
import getSSL from "./helpers/ssl.js"
dotenv.config()
/////////////////////////   INITIALIZATION         //////////////////////
const app = express()
const server = https.createServer(getSSL(), app)
// middleware
app.use(express.json())

/////////////////////////////// ROUTES ////////////////////////////////
// route to google signle sign on
app.get("/oauth/callback", (req, res) => {
  res.redirect(authURL)
})
// google sso redirects here
app.get("/success", async (req, res) => {
  // authentification code provided by google
  const authCode = req.query.code
  const { tokens } = await oauth2Client.getToken(authCode)
  // append token to tokens.json
  const tokensJSON = JSON.parse(fs.readFileSync("./tokens.json", "utf8"))
  tokensJSON.push(tokens)
  fs.writeFileSync("./tokens.json", JSON.stringify(tokensJSON))

  res.send("success")
})
/////////////////////////////// SERVER ////////////////////////////////
server.listen(443, () => {
  console.log("https://7afb-122-161-75-70.ngrok-free.app/oauth/callback")
})

/////////////////////////////   SET TOKENS ////////////////////////////////
if (!fs.existsSync("./tokens.json"))
  fs.writeFileSync("./tokens.json", JSON.stringify([]))
const tokens = JSON.parse(fs.readFileSync("./tokens.json", "utf8")) || []
/////////////////////////////// MAIN ////////////////////////////////
// start a job that checks for new mails @ 5 min intervals
replyUnreadMails(tokens)
setInterval(() => {
  replyUnreadMails(tokens)
}, 1000 * 60 * 5)
