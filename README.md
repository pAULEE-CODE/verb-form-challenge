# Verb Form Challenge

A browser based English verb practice project. The solo and challenge modes use the same canonical verb bank at [`shared-assets/verb-bank.js`](shared-assets/verb-bank.js).

## Play

- [Single player preview](solo/verb-form-challenge.html)
- [Challenge mode with boids](challenge/verb-challenge-boids-predatory.html)

These builds run in a browser. The solo preview is a local/static practice build. Online solo scores and the leaderboard use the Google Apps Script project in [`apps-script/`](apps-script/README.md).

## Project layout

- `shared-assets/verb-bank.js` — canonical verb data shared by the static game builds.
- `solo/` — single player browser build.
- `challenge/` — challenge build and boid animation.
- `apps-script/` — online solo app and score API source.

The Apps Script app includes a copy of the canonical verb bank as `VerbBank.html`; keep it synchronized with `shared-assets/verb-bank.js` whenever the list changes so both modes continue to use the same data.

## GitHub Pages

This repository can serve the static preview builds. In GitHub, open **Settings → Pages** and choose **Deploy from a branch**, branch `main`, folder `/(root)`. The Apps Script folder is source for a separate Google Apps Script deployment; GitHub Pages does not run Apps Script server code.

The online score service uses a Google Sheet. Its ID is configured in Apps Script project properties rather than stored in this public repository. Keep the spreadsheet's sharing settings restricted to the intended audience.

## Research data

The online solo app records a completed session only after the player chooses to submit it. See the Apps Script README for stored fields and deployment details.
