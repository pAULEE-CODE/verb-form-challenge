# Game versions and build rules

Use this note whenever changing the Verb Form Challenge. We maintain three test versions:

| Version | File | Use |
|---|---|---|
| Single player | `solo/verb-form-challenge.html` | Browser practice build. |
| Challenge | `challenge/verb-challenge-boids-predatory.html` | Browser challenge build with the boids animation. |
| Standalone | `challenge/usb/verb-challenge-boids-predatory.html` | One-file challenge build for USB and offline device testing. |
| Anson's Game | `challenge/usb/ansons-game.html` | One-player educational build with timed enemy waves and three-hit boid battles. |

The standalone files are bundled builds or isolated educational variants. The regular USB build is generated from the modular Challenge. The choice test and Anson's Game are test-only variants; the browser builds remain unchanged until feedback is reviewed.

## Current standalone test variant

`challenge/usb/verb-challenge-choice-test.html` is the build for the next classroom test. It has 2–4 players, selectable 3–8 answer choices with 3 selected by default, and random hidden 8–12-question rounds. Its Challenge **New game** button returns to player-count selection. These changes are isolated to this experimental file until reviewed.

The regular build script writes `challenge/usb/verb-challenge-boids-predatory.html`; it does not overwrite the choice-test file.

## Anson's Game prototype

`challenge/usb/ansons-game.html` is a separate standalone educational solo version. It has 10 questions and 3–8 answer choices (default 3). A correct answer releases a salvo sized by `question number + (answer choices − 3)`; the enemy wave scheduled for that question uses the same count. For example, with 3 choices Q1 releases 1 boid and Q9 releases 9; choosing 4 choices adds one boid to each question's count. Each question keeps its own enemy spawn time, even after later questions appear. The enemy delay is configurable as 4–6 seconds for Verbs (default 4) and 4–9 seconds for Story Time and General Questions (default 6), measured from when the question appears. The large timer measures answer time; the enemy countdown stays hidden. The enlarged boid arena sits below the words and answer buttons. The adult can set an enemy cap from 10 to 100 (default 40). Active enemies are also balanced to Anson's flock: the effective limit is no more than 10 unless he has more than 10 boids; waves that do not fit are skipped. Each boid has three hit points and collisions knock opposing boids apart. The start screen offers Verbs, Story Time, and General Questions. Story Time contains six simple offline stories, each with 10 missing-word sentences; stories do not repeat until all six have been used. Its choices are spelling-mistake varieties of the target past participle, using the same spelling rules as Verbs. General Questions contains 51 simple offline missing-word questions with real-word choices and no spelling mistakes. The New game button returns to setup so another type and settings can be selected. Keep this experimental build separate from regular Challenge builds while it is being tried with Anson.

## Rules that must stay shared

- Single player and Challenge use the same canonical irregular verb data from `shared-assets/verb-bank.js`.
- Both modes must use the same spelling-mistake rules. If either mode's spelling logic changes, update the other mode to match.
- Keep the Apps Script copy at `apps-script/VerbBank.html` synchronized with the canonical shared bank.
- Do not edit the generated Standalone file by hand. It embeds the shared verb data and challenge source.

## Building and checking

1. Make game and data changes in the maintained source files.
2. Rebuild Standalone after changing Challenge or the shared verb bank:
   ```sh
   python3 scripts/build_standalone_challenge.py
   ```
3. Test Single player and Challenge from their browser versions.
4. Test Standalone as one HTML file from the USB copy.
5. Confirm all versions still use the same verb data and spelling-mistake rules.

Challenge rounds randomly contain 8–12 questions, and players are not told the round total. Single player remains a 10-question test.
