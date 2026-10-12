# Project handover

**Last updated:** 12 October 2026  
**Purpose:** Quickly restore context after a break. Read this and [BUILD_MODES.md](BUILD_MODES.md) before making project changes.

## Why this project exists

The verb game began as a Unity project around 2016. After returning to it years later, the old Unity setup and earlier design decisions were difficult to recall. The current HTML/JavaScript project is the place to iterate on the game and settle its design before a later Android or Unity version.

Paul often develops several ideas at once. Keep this note current when a decision, build, or important test changes so the project can be resumed without relying on chat history.

## Legacy Unity project

The original Unity project from around 2016 may contain useful mechanics, assets, or design ideas. It has not yet been inspected as part of this HTML project. When Unity porting begins, review the original project before rebuilding: identify what can be recovered, compare it with the current browser prototype, and record what is carried forward, adapted, or left behind. Do not assume the old work is disposable or that its details are already known.

## Current project

Repository: [pAULEE-CODE/verb-form-challenge](https://github.com/pAULEE-CODE/verb-form-challenge)

| Version | Current source/build | Purpose |
|---|---|---|
| Single player | `solo/verb-form-challenge.html` | Static browser practice build; ten questions. |
| Challenge | `challenge/verb-challenge-boids-predatory.html` | Multiplayer challenge build; each round randomly has 8–12 questions, and players do not see how many remain. |
| Standalone | `challenge/usb/verb-challenge-boids-predatory.html` | Bundled one-file challenge for USB/offline testing on larger touchscreens. |

Online single-player scores are handled separately by the Google Apps Script source in `apps-script/`, with results stored in Google Sheets. GitHub Pages hosts static HTML; it does not run the Apps Script backend.

## Decisions to preserve

- The canonical verb data is `shared-assets/verb-bank.js`.
- Single player and Challenge must use the same verb list and spelling-mistake rules. Keep `apps-script/VerbBank.html` synchronized with the canonical list.
- Standalone is a bundled copy of Challenge, not a separate game or ruleset. Generate it with `python3 scripts/build_standalone_challenge.py`; do not edit the generated file by hand.
- In Challenge, a correct answer gives its winner ten boids in that player's color. A flock spawns together in the player's colored strip. Boids hunt opposing colors only within range; collisions between opposing boids remove both, while a player's own boids cannot cancel each other. The boids are a local spectator animation.
- The current design does not include the blob.
- The game is being prototyped in HTML first so gameplay and presentation can be tested before deciding on an Android or Unity port.

## Current web and data setup

- The repository is public. The Apps Script source reads the results spreadsheet ID from the Apps Script `SCORE_SPREADSHEET_ID` project property, so the ID is not stored in this repository.
- GitHub Pages can serve the static game once its source is set to branch `main`, folder `/(root)` in repository Settings → Pages.
- Online scores require a separate Apps Script deployment connected to the results spreadsheet. The current score endpoint accepts self-reported answer records; it is useful for prototype data collection, not secure competition ranking.
- Local HTML can be awkward on tablets. The USB standalone build exists for devices that can open local HTML. Hosting through Pages is the easier route where local-file support is limited.

## Active design direction

The game landing page should feel inviting and international, with people from around the world challenging each other. Keep boids out of the landing artwork; they are only a cosmetic in the local Challenge build. The landing page is intended to offer Single player and Challenge, with a global ranked version planned for the solo experience. Current visual work is to establish the artwork first, then place the interactive choices over it.

## Workflow for future game ideas

Start new ideas in a loose conversation and plan the concept before creating a project. Once the idea is clear enough, create its own project folder or repository, then review this project for interface pieces and lessons worth carrying over.

Keep each game's content and rules separate. A shared resource can wait until a third quiz or several small variations make the reuse valuable. For small changes to the same quiz, first consider a configurable variant instead of copying the whole game.

## Known issue to revisit

- During USB testing on the larger touchscreens, boids sometimes struggle to leave their starting strip. Review spawn and escape movement in both Challenge builds, tune it, then rebuild and retest the standalone version.

## Before resuming work

1. Read `BUILD_MODES.md` and preserve its shared-data and spelling-rule requirements.
2. Check the current repository files and recent commits before editing.
3. Identify which of the three versions the change affects.
4. Rebuild Standalone after changing Challenge or the canonical verb bank.
5. Record what changed and how it was tested here, including anything still unverified.
