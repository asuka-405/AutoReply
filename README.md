# Project Overview

This project is an automated email reply system leveraging the Gmail API. It includes several key files responsible for OAuth2 authentication, Gmail interaction, SSL setup, and the main server.

## Files

### [index.js](index.js)

- Entry point for the application.
- Sets up an Express server with HTTPS.
- Defines routes for Google Single Sign-On (SSO).
- Periodically checks for unread emails and sends automated replies.

### [gmail.js](gmail.js)

- Manages interactions with the Gmail API.
- Includes functions for replying to unread emails, moving emails to custom labels, and checking for new mails.

### [oauth.js](oauth.js)

- Handles OAuth2 authentication using the Google API client library.
- Generates authorization URLs and retrieves OAuth2 clients from tokens.

### [scopes.json](scopes.json)

- Defines the OAuth2 scopes required for Gmail API access.

### [ssl.js](ssl.js)

- Manages SSL key and certificate retrieval for secure server setup.

### [.env.example](.env.example)

- Example configuration file with environment variable placeholders.

### [package.json](package.json)

- Project configuration file with dependencies and scripts.

## Dependencies

- **Express:** Web framework for handling HTTP requests.
- **googleapis:** Google API client library.
- **dotenv:** Module for loading environment variables.
- **nodemon:** Development utility for automatic server restarts.

## Usage

1. Copy `.env.example` to `.env` and fill in your Google Cloud and NGrok details.
2. Install dependencies using `yarn install`.
3. Run the development server using `yarn dev`.
