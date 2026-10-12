# Game versions and build rules

Use this note whenever changing the Verb Form Challenge. We maintain three test versions:

| Version | File | Use |
|---|---|---|
| Single player | `solo/verb-form-challenge.html` | Browser practice build. |
| Challenge | `challenge/verb-challenge-boids-predatory.html` | Browser challenge build with the boids animation. |
| Standalone | `challenge/usb/verb-challenge-boids-predatory.html` | One-file challenge build for USB and offline device testing. |

The standalone file is a bundled build of Challenge, not a separate ruleset.

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
