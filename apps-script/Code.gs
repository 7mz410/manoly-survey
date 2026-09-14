// Google Apps Script backend for the Manoly survey.
// Paste into Extensions > Apps Script of a Google Sheet, then Deploy > New deployment >
// Web app, Execute as: Me, Who has access: Anyone. Put the /exec URL in site/main.tsx.
const PASSWORD = '123';

function sheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sh = book.getSheetByName('responses') || book.insertSheet('responses');
  if (sh.getLastRow() === 0) sh.appendRow(['id', 'name', 'answers', 'done', 'updated']);
  return sh;
}

function out(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// Sheets treats text starting with = + - @ as a formula.
const plain = (s) => (/^[=+\-@]/.test(s) ? "'" + s : s);

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = JSON.parse(e.postData.contents);
    const id = String(p.id || '');
    const name = String(p.name || '').trim().slice(0, 60);
    const answers = JSON.stringify(p.answers || {});
    if (!/^[a-f0-9-]{36}$/.test(id) || !name) return out({error: 'بيانات غير صالحة.'});
    if (answers.length > 49000) return out({error: 'الإجابة طويلة جدًا.'});
    const sh = sheet();
    const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map((r) => r[0]);
    const row = [id, plain(name), answers, p.done ? 1 : 0, new Date().toISOString()];
    const i = ids.indexOf(id);
    if (i < 1) sh.appendRow(row);
    else if (sh.getRange(i + 1, 4).getValue() == 1) return out({error: 'الإجابات النهائية مقفلة.'});
    else sh.getRange(i + 1, 1, 1, 5).setValues([row]);
    return out({ok: true});
  } catch (err) {
    return out({error: 'تعذّر الحفظ. حاول مجددًا.'});
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e.parameter.password !== PASSWORD) return out({error: 'كلمة السر غير صحيحة.'});
  const rows = sheet().getDataRange().getValues().slice(1);
  return out({
    records: rows.map((r) => ({
      name: String(r[1]).replace(/^'/, ''),
      answers: JSON.parse(r[2] || '{}'),
      done: r[3] == 1,
      updated: r[4],
    })),
  });
}
