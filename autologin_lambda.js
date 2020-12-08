const chromium = require('chrome-aws-lambda');

// ログインページ (楽天市場ログイン)
const loginUrl = 'https://grp01.id.rakuten.co.jp/rms/nid/vc?__event=login&service_id=top';
// ログイン情報
const idValue = process.env.USER_ID;
const passwdValue = process.env.PASSWD;

// 自動ログインテスト
exports.handler = async (event, context, callback) => {
  const result = { log: [] };
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(0);

    // ログインページへアクセスし、ログイン操作実行
    await page.goto(loginUrl);

    // IDとパスワード入力
    await page.type('#loginForm input#loginInner_u', idValue);
    await page.type('#loginForm input#loginInner_p', passwdValue);
    // ログインボタンをクリック
    await page.click('#loginForm input[type="submit"].loginButton');

    // リロード待ち
    result.log.push('[' + Date.now() + '] reloading...');
    // クリックしたいものが届くまで待つ
    const nextTarget = 'a[href="https://my.rakuten.co.jp/?l-id=top_normal_myrakuten_account"]';
    await page.waitForSelector(nextTarget);
    result.log.push('[' + Date.now() + '] done');

    // ログイン後ページで「会員情報」クリック
    await page.click(nextTarget);

    // リロード待ち
    result.log.push('[' + Date.now() + '] reloading...');
    // ページのフッタ部分要素が届けば概ね良しとする
    await page.waitForSelector('#grpRakutenLinkArea');
    result.log.push('[' + Date.now() + '] done');
    
    // DEBUG
//   result.body = await page.content();
    // "JSHandle:何某" のようになってしまうので要調整。chrome-aws-lambda 側で拡張されたらしい page#string() は出力が得られなかった。
    await page.$('#mystatus_name')
      .then(async element => {
        await element.getProperty('textContent').then(content => { result.name = content.toString(); });
    });
  await page.$('#mystatus_rankName')
    .then(async element => {
        await element.getProperty('textContent').then(content => { result.rank = content.toString(); });
    });  } catch (error) {
    result.error = error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, result);
};
