import dotenv from "dotenv"
import express from "express"
import fs from "fs"
import https from "https"
import replyUnreadMails from "./helpers/gmail.js"
import { authURL, oauth2Client } from "./helpers/oauth.js"
import getSSL from "./helpers/ssl.js"
dotenv.config()

const app = express()
const server = https.createServer(getSSL(), app)

app.use(express.json())

app.get("/oauth/callback", (req, res) => {
  res.redirect(authURL)
})

app.get("/success", async (req, res) => {
  const authCode = req.query.code

  const { tokens } = await oauth2Client.getToken(authCode)
  const tokensJSON = JSON.parse(fs.readFileSync("./tokens.json", "utf8"))
  tokensJSON.push(tokens)
  fs.writeFileSync("./tokens.json", JSON.stringify(tokensJSON))

  res.send(tokens)
})

server.listen(443, () => {
  console.log("https://7afb-122-161-75-70.ngrok-free.app/oauth/callback")
})

if (!fs.existsSync("./tokens.json"))
  fs.writeFileSync("./tokens.json", JSON.stringify([]))
const tokens = JSON.parse(fs.readFileSync("./tokens.json", "utf8")) || []

replyUnreadMails(tokens)
setInterval(() => {
  replyUnreadMails(tokens)
}, 1000 * 60 * 5)
