# Online solo app (Google Apps Script)

This web app serves the single-player quiz, records explicitly submitted scores in the `Online High Scores` tab of the results spreadsheet, and shows the top ten scores.

## Storage format

One row represents one completed ten-question session. The nickname is 1–6 letters; no real name or school number is requested. Each row stores score, answer times, verb forms, selected and correct answers, client type, and a unique session ID.

The browser calls `getLeaderboard` and `submitScore` through `google.script.run`. Future Android and Unity clients can use the same score contract through the web app's `/exec` endpoint: `GET ?api=leaderboard` returns leaderboard JSON; `POST` JSON with `action: "submitScore"` records a session. The server checks answer-record consistency and calculates score and tie-break time from submitted answers. Submissions are self-reported and the public board is not a secure competition ranking.

## Install and deploy

1. Open the results spreadsheet and use **Extensions → Apps Script** to create or open its bound project.
2. Copy `Code.gs`; create HTML files named `Index` and `VerbBank` and paste their matching files; enable `appsscript.json` in Project Settings and paste the manifest.
3. In **Project Settings → Script Properties**, add `SCORE_SPREADSHEET_ID` with the ID of the results spreadsheet. The identifier is kept out of this public repository.
4. Save, run `getLeaderboard` once from the editor, and approve spreadsheet access.
5. Deploy as a web app, running as the deploying account and allowing the intended players to access it. Share the resulting `/exec` URL.

The Apps Script HTML service hosts the online solo page, so its browser score calls are same-project calls. Android and Unity use the JSON endpoint and do not need `google.script.run`.

`VerbBank.html` is a copy of the canonical [`shared-assets/verb-bank.js`](../shared-assets/verb-bank.js). Keep them identical when the verb data changes.
