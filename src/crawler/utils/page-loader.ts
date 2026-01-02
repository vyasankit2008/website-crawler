import puppeteer from 'puppeteer';

export async function loadPageHtml(url: string): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
  );

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });

  const html = await page.content();
  await browser.close();
  return html;
}
