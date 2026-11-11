// qa-forms.js — validates the SC/LC Authority to Deduct fill-out forms end to end:
// opens download.html, launches both modals, fills fields, checks a civil-status
// box, submits, verifies the result payload and the generated PDF download.
const puppeteer = require('puppeteer-core');
const express = require('express');
const fs = require('fs');
const path = require('path');

const chromePath = process.argv[2];
if (!chromePath || !fs.existsSync(chromePath)) {
  console.error('Chrome not found. Pass the executable path as argument.');
  process.exit(1);
}

const root = __dirname;
const outDir = path.join(root, 'qa-results-forms');
fs.rmSync(outDir, { force: true, recursive: true });
fs.mkdirSync(outDir, { recursive: true });

const receiver = express();
receiver.use(express.static(root));
const server = receiver.listen(8125, () => console.log('[receiver] serving on 8125'));

const SAMPLE = {
  dearSir: 'ATTY. JUAN R. DELA CRUZ',
  fullName: 'JUAN REYES DELA CRUZ',
  employedAs: 'Justice Attorney I',
  officeOf: 'Office of the Court Administrator',
  signDay: '1', signMonth: 'September', signYear: '26', signTime: '10:30 AM', signPlace: 'Manila',
  signatureOverName: 'JUAN R. DELA CRUZ',
  email: 'juan.delacruz@example.com',
  mobileNumber: '09171234567',
  permanentAddr: '123 Rizal St., Ermita, Manila',
  processedBy: 'MARIA L. SANTOS'
};
const CHECK = ['cbSingle'];

async function testForm(browser, key, label) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('dialog', (d) => d.accept().catch(() => {}));
  await page.setViewport({ width: 1400, height: 950 });
  await page.goto('http://127.0.0.1:8125/FRONT/download.html', { waitUntil: 'load', timeout: 30000 });

  const btnInfo = await page.evaluate((k) => {
    const btn = document.querySelector(`[data-form="${k}"]`);
    return btn ? { found: true, text: btn.textContent.trim() } : { found: false };
  }, key);
  console.log(`[${label}] fill-out button:`, JSON.stringify(btnInfo));
  if (!btnInfo.found) throw new Error(`${label} button missing`);

  await page.click(`[data-form="${key}"]`);
  await page.waitForFunction(() => document.getElementById('loanModal').classList.contains('active'), { timeout: 8000 });
  const modalInfo = await page.evaluate(() => ({
    title: document.querySelector('.loan-modal-header h2').textContent,
    inputCount: document.querySelectorAll('#loanApplicationForm .form-input').length,
    checkboxCount: document.querySelectorAll('#loanApplicationForm .form-checkbox').length,
    images: Array.from(document.querySelectorAll('.loan-form-background')).map((i) => i.naturalWidth + 'x' + i.naturalHeight)
  }));
  console.log(`[${label}] modal:`, JSON.stringify(modalInfo));

  const filled = await page.evaluate((s, checks) => {
    let n = 0;
    for (const [id, val] of Object.entries(s)) {
      const el = document.getElementById(id);
      if (el) { el.value = val; n++; }
    }
    for (const id of checks) {
      const el = document.getElementById(id);
      if (el) { el.checked = true; n++; }
    }
    return n;
  }, SAMPLE, CHECK);
  console.log(`[${label}] fields filled:`, filled);

  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, `${label}-modal-top.png`) });
  const body = await page.$('.loan-modal-body');
  if (body) { await body.evaluate((el) => { el.scrollTop = el.scrollHeight * 0.42; }); }
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: path.join(outDir, `${label}-modal-mid.png`) });

  await page.evaluate(() => { window.__loanApplicationData = null; });
  await page.click('#loanApplicationForm button[type="submit"]');
  await page.waitForFunction(() => window.__loanApplicationData !== null, { timeout: 30000 }).catch(() => {});
  const payload = await page.evaluate(() => window.__loanApplicationData);
  console.log(`[${label}] payload form key:`, payload && payload.form, '| has fields:', !!(payload && payload.fields && payload.fields.fullName), '| civilStatus:', payload && payload.civilStatus);
  if (!payload || payload.form !== key) throw new Error(`${label}: submit payload missing/wrong`);
  if (payload.civilStatus !== 'Single') throw new Error(`${label}: civilStatus checkbox not captured`);

  // The PDF is delivered by the "Print / Download" button in the preview the
  // submit opens; click it (via JS, so a loader overlay cannot swallow it) so
  // the download really lands in qa-results-forms/.
  await page
    .waitForFunction(() => !!document.getElementById('downloadLoanPDF'), { timeout: 30000 })
    .catch(() => {});
  const clickedDownload = await page.evaluate(() => {
    const button = document.getElementById('downloadLoanPDF');
    if (!button) return false;
    button.click();
    return true;
  });
  console.log(`[${label}] download button clicked:`, clickedDownload);
  await new Promise((r) => setTimeout(r, 3000));

  await page.close();
  return { filled, modalInfo, errors };
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--window-size=1400,950', '--disable-gpu-sandbox', '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });

  const targets = await browser.pages();
  const cdp = await targets[0].createCDPSession();
  await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: outDir });

  try {
    const sc = await testForm(browser, 'authoritySc', 'SC-authority');
    const lc = await testForm(browser, 'authorityLc', 'LC-authority');
    await new Promise((r) => setTimeout(r, 3000));
    const pdfs = fs.readdirSync(outDir).filter((f) => f.toLowerCase().endsWith('.pdf'));
    console.log('PDFs generated:', JSON.stringify(pdfs));
    const pass = pdfs.length >= 2 && sc.errors.length === 0 && lc.errors.length === 0;
    console.log('QA-FORMS RESULT:', pass ? 'PASS' : 'FAIL');
    if (sc.errors.length || lc.errors.length) console.log('page errors:', sc.errors.concat(lc.errors));
  } catch (e) {
    console.log('QA-FORMS RESULT: FAIL —', e.message);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
})();