import dotenv from "dotenv"
import fs from "fs"
import { google } from "googleapis"
import path from "path"
import process from "process"
dotenv.config()

const SCOPES = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "helpers", "scopes.json"), "utf8")
)

const oauth2Client = new google.auth.OAuth2(
  process.env.GC_OAUTH_CID,
  process.env.GC_OAUTH_CS,
  `${process.env.XPOSED_URL}/success`
)
const authURL = oauth2Client.generateAuthUrl({
  scope: SCOPES,
  include_granted_scopes: true,
  access_type: "offline",
})

export default async function getOauth2Client(token) {
  await oauth2Client.setCredentials(token)
  return oauth2Client
}
export { authURL, oauth2Client }
