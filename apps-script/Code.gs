const SCORE_SHEET_NAME = 'Online High Scores';
const SCORE_LIMIT = 10;
const QUESTION_COUNT = 10;

function doGet(e) {
  if (e && e.parameter && e.parameter.api === 'leaderboard') {
    return jsonOutput_(getLeaderboard());
  }
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Verb Form Quiz · Solo')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Browser clients call this through google.script.run.
function getLeaderboard() {
  const sheet = scoreSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const rows = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  return rows.map(function (row) {
    return {
      submittedAt: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
      nickname: String(row[1] || ''),
      score: Number(row[2]) || 0,
      questionCount: Number(row[3]) || QUESTION_COUNT,
      totalCorrectTimeMs: Number(row[4]) || 0,
      averageCorrectTimeMs: Number(row[5]) || 0
    };
  }).filter(function (entry) {
    return /^[A-Z]{1,6}$/.test(entry.nickname) && entry.questionCount === QUESTION_COUNT;
  }).sort(function (a, b) {
    return b.score - a.score || a.averageCorrectTimeMs - b.averageCorrectTimeMs || a.submittedAt.localeCompare(b.submittedAt);
  }).slice(0, SCORE_LIMIT);
}

// Stores one completed solo session and its per-question timing/answer data.
function submitScore(payload) {
  const clean = validateScore_(payload);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = scoreSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      const ids = sheet.getRange(2, 9, lastRow - 1, 1).getDisplayValues().flat();
      if (ids.includes(clean.sessionId)) throw new Error('This score was already received.');
    }
    const correct = clean.answers.filter(function (answer) { return answer.correct; });
    const totalCorrectTimeMs = correct.reduce(function (sum, answer) { return sum + answer.responseTimeMs; }, 0);
    const averageCorrectTimeMs = correct.length ? Math.round(totalCorrectTimeMs / correct.length) : 0;
    const submittedAt = new Date();
    sheet.appendRow([
      submittedAt,
      clean.nickname,
      correct.length,
      QUESTION_COUNT,
      totalCorrectTimeMs,
      averageCorrectTimeMs,
      JSON.stringify(clean.answers),
      clean.client,
      clean.sessionId
    ]);
    return { ok: true, nickname: clean.nickname, score: correct.length, averageCorrectTimeMs: averageCorrectTimeMs };
  } finally {
    lock.releaseLock();
  }
}

// Stable JSON API for future Android and Unity clients: POST a JSON object to /exec.
// Use {action:"submitScore", nickname, answers:[...], sessionId, client}.
function doPost(e) {
  try {
    const payload = JSON.parse(e && e.postData && e.postData.contents || '{}');
    if (payload.action !== 'submitScore') throw new Error('Unsupported action.');
    return jsonOutput_(submitScore(payload));
  } catch (error) {
    return jsonOutput_({ ok: false, error: String(error && error.message || error) });
  }
}

function validateScore_(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Score data is missing.');
  const nickname = String(payload.nickname || '').trim().toUpperCase();
  if (!/^[A-Z]{1,6}$/.test(nickname)) throw new Error('Use a nickname of 1 to 6 letters.');
  const sessionId = String(payload.sessionId || '');
  if (!/^[A-Za-z0-9-]{8,80}$/.test(sessionId)) throw new Error('Session ID is invalid.');
  const client = ['web', 'android', 'unity'].includes(String(payload.client || 'web').toLowerCase())
    ? String(payload.client || 'web').toLowerCase()
    : 'web';
  if (!Array.isArray(payload.answers) || payload.answers.length !== QUESTION_COUNT) {
    throw new Error('A solo session must contain ten answers.');
  }
  const answers = payload.answers.map(function (answer, index) {
    const responseTimeMs = Number(answer.responseTimeMs);
    if (!Number.isInteger(responseTimeMs) || responseTimeMs < 0 || responseTimeMs > 600000) {
      throw new Error('An answer time is outside the allowed range.');
    }
    if (typeof answer.correct !== 'boolean') throw new Error('An answer result is invalid.');
    const forms = Array.isArray(answer.forms) ? answer.forms.map(function (form) {
      const value = String(form || '').toLowerCase();
      if (!/^[a-z]{1,24}$/.test(value)) throw new Error('A verb form is invalid.');
      return value;
    }) : [];
    if (forms.length !== 3) throw new Error('A verb must include all three forms.');
    const missingFormIndex = Math.max(0, Math.min(2, Number(answer.missingFormIndex) || 0));
    const selectedAnswer = String(answer.selectedAnswer || '').toLowerCase().slice(0, 24);
    const correctAnswer = String(answer.correctAnswer || '').toLowerCase().slice(0, 24);
    if (forms[0] !== String(answer.verb || '').toLowerCase()) throw new Error('The verb record is inconsistent.');
    if (correctAnswer !== forms[missingFormIndex]) throw new Error('The expected answer does not match the verb forms.');
    if (answer.correct !== (selectedAnswer === correctAnswer)) throw new Error('The answer result is inconsistent.');
    return {
      question: index + 1,
      verb: forms[0],
      forms: forms,
      missingFormIndex: missingFormIndex,
      selectedAnswer: selectedAnswer,
      correctAnswer: correctAnswer,
      correct: answer.correct,
      responseTimeMs: responseTimeMs
    };
  });
  return { nickname: nickname, sessionId: sessionId, client: client, answers: answers };
}

function scoreSheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SCORE_SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('Set SCORE_SPREADSHEET_ID in Apps Script project properties.');
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SCORE_SHEET_NAME);
  if (!sheet) throw new Error('The score sheet tab is unavailable.');
  return sheet;
}

function jsonOutput_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

// Include a standalone HTML/JavaScript source file in the hosted page.
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
