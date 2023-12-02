import { google } from "googleapis"
import getOauth2Client from "./oauth.js"

/////////////////////////////// MAIN FUNCTION //////////////////////////
// reply to unread mails for each token
// tokens: array of tokens
// for each token set up a gmail client
// check for unread mails
// for each unread mail
// send reply
// mark mail as replied
export default function replyUnreadMails(tokens) {
  tokens.forEach(async (token) => {
    const auth = await getOauth2Client(token)
    const gmail = google.gmail({ version: "v1", auth })
    const mails = await checkForNewMails(gmail)
    if (!mails) return
    mails.forEach(async (mail) => {
      await sendReply(gmail, mail.id)
      await moveMailToRepliedLabel(gmail, mail.id)
    })
  })
}

/////////////////////////////// UTILITY FUNCTIONS //////////////////////////
export async function moveMailToRepliedLabel(gmail, id) {
  await gmail.users.messages.modify({
    userId: "me",
    id,
    requestBody: {
      removeLabelIds: ["UNREAD"],
      addLabelIds: ["FIRST_REPLY"],
    },
  })
}

export async function checkForNewMails(gmail) {
  const res = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread",
  })
  return res.data.messages || []
}

async function sendReply(gmail, id) {
  const originalMessage = await gmail.users.messages.get({
    userId: "me",
    id,
  })

  const replyText = await getReplyText(originalMessage.data)
  if (!replyText) return

  const base64EncodedEmail = Buffer.from(replyText)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  return await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      threadId: originalMessage.data.threadId,
      raw: base64EncodedEmail,
    },
  })
}
// get reply text from original message
// originalMessage: message object
// extract from, to, subject from original message
// construct reply text
// return reply text
async function getReplyText(originalMessage) {
  if (!originalMessage.payload) return
  // extract from, to, subject from original message
  const fromHeader = originalMessage.payload.headers.find(
    (header) => header.name === "From"
  )
  const subjectHeader = originalMessage.payload.headers.find(
    (header) => header.name === "Subject"
  )
  const toHeader = originalMessage.payload.headers.find(
    (header) => header.name === "To"
  )
  if (!fromHeader || !subjectHeader || !toHeader) return

  const to = fromHeader.value
  const from = toHeader.value
  const subject = subjectHeader.value
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`
  const contentType = "text/html; charset=utf-8"
  if (!from || !to || !subject) return

  // construct reply text
  const raw = [
    `From: ${from}`,
    `To: ${to}`,
    `Content-Type: ${contentType}`,
    "MIME-Version: 1.0",
    `Subject: Re: ${utf8Subject}`,
    "",
    "<b>Hello!</b> This is an automated reply.",
  ].join("\n")
  return raw
}
