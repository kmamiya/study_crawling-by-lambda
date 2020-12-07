require('dotenv').config();
const Puppeteer = require('puppeteer');

// ログインページ (楽天市場ログイン)
const loginUrl = 'https://grp01.id.rakuten.co.jp/rms/nid/vc?__event=login&service_id=top';
// ログイン情報
const idValue = process.env.USER_ID;
const passwdValue = process.env.PASSWD;


// 自動ログインテスト
// TODO: Language を設定しないとログイン操作後が英語になっているかも
(async () => {
  const browser = await Puppeteer.launch({
    // --no-sandbox ... Docker環境のみ必要? root権限関連
    args: ['--no-sandbox'],
    // デバッグ時コメント外す。実際にchromeを表示し、挙動確認する
    // headless: false
  });
  const page = await browser.newPage();

  // ログインページへアクセスし、ログイン操作実行
  await page.goto(loginUrl);
  // IDとパスワード入力
  await page.type('#loginForm input#loginInner_u', idValue);
  await page.type('#loginForm input#loginInner_p', passwdValue);
  // ログインボタンをクリック
  await page.click('#loginForm input[type="submit"].loginButton');

  // リロード待ち
  console.log('[' + Date.now() + '] reloading...');
  // waitForNavigation() では永久に待ってしまうときがある(ページ上でJavaScriptが実行されているため？)
  // クリックしたいものが届くまで待つ
  const nextTarget = 'a[href="https://my.rakuten.co.jp/?l-id=top_normal_myrakuten_account"]';
  await page.waitForSelector(nextTarget);
  console.log('[' + Date.now() + '] done');

  // ログイン後ページで「会員情報」クリック
  await page.click(nextTarget);

  // リロード待ち
  console.log('[' + Date.now() + '] reloading...');
  // waitForNavigation() では永久に待ってしまうときがある(ページ上でJavaScriptが実行されているため？)
  // ページのフッタ部分要素が届けば概ね良しとする
  await page.waitForSelector('#grpRakutenLinkArea');
  console.log('[' + Date.now() + '] done');

  // 結果をSTDOUTに出力
  // TODO: このあたりもう少しうまくやりたい
  await page.$('#mystatus_name')
    .then(async element => {
      console.log('名前 : ');
      await element.getProperty('textContent').then(result => { console.log(result.toString()); });
    });
  await page.$('#mystatus_rankName')
    .then(async element => {
      console.log('ランク : ');
      await element.getProperty('textContent').then(result => { console.log(result.toString()); });
    });

  // 終了
  await browser.close();
})();
