# Verb Form Challenge

A browser based English verb practice project. The solo and challenge modes use the same canonical verb bank at [`shared-assets/verb-bank.js`](shared-assets/verb-bank.js).

## Play

GitHub's repository file view shows HTML source code. Once GitHub Pages is enabled for this repository, use these game links:

- [Single player preview](https://paulee-code.github.io/verb-form-challenge/solo/verb-form-challenge.html)
- [Challenge mode with boids](https://paulee-code.github.io/verb-form-challenge/challenge/verb-challenge-boids-predatory.html)

These builds run in a browser. The solo preview is a static practice build. Online solo scores and the leaderboard use the Google Apps Script project in [`apps-script/`](apps-script/README.md).

## USB testing

For the current answer-choice test, use [the experimental standalone build](challenge/usb/verb-challenge-choice-test.html). It supports 2–4 players, 3–8 choices (default 3), and hidden random rounds of 8–12 questions. Open its file page on GitHub and choose **Download raw file**, then copy the HTML file to the USB drive.

The regular self-contained challenge build remains at [challenge/usb/verb-challenge-boids-predatory.html](challenge/usb/verb-challenge-boids-predatory.html). Both files embed their verb data. The experimental choice test is separate from the browser builds while the kids try it.

## Rebuild the USB version

The USB file is a generated bundle of the modular challenge and canonical verb bank. Make changes in the modular challenge or shared bank, then regenerate the one-file version with:

```sh
python3 scripts/build_standalone_challenge.py
```

This keeps the downloadable HTML in sync with the same source used by the web build.

## Returning to the project

Start with [PROJECT_STATUS.md](PROJECT_STATUS.md) for the handover, then read [BUILD_MODES.md](BUILD_MODES.md) before changing a build.

## Build rules

See [BUILD_MODES.md](BUILD_MODES.md) for the three test versions and the rules for keeping their data and spelling logic aligned.

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
