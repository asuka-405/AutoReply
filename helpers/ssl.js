import dotenv from "dotenv"
import fs from "fs"
dotenv.config()
export default function getSSL() {
  const SSL_KEY = fs.readFileSync(process.env.SSL_KEY, "utf8")
  const SSL_CERT = fs.readFileSync(process.env.SSL_CERT, "utf8")

  return {
    key: SSL_KEY,
    cert: SSL_CERT,
  }
}
