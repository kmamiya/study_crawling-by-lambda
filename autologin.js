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
  // --no-sandbox ... Docker環境のみ必要? root権限関連
  // ここで指定するtimeoutは page.waitFor() に効果無し？
  const browser = await Puppeteer.launch({args: ['--no-sandbox'], timeout: 0 });
  const page = await browser.newPage();
  // timeout ... 楽天の場合30以上かかることが多い。 0 でタイムアウト無し。
  page.setDefaultNavigationTimeout(0);

  // ログインページへアクセス
  await page.goto(loginUrl);
  // IDとパスワード入力
  await page.type('#loginForm input#loginInner_u', idValue);
  await page.type('#loginForm input#loginInner_p', passwdValue);
  // ログインボタンをクリック
  await page.click('#loginForm input[type="submit"].loginButton');
  // リロード待ち
  console.log('[' + Date.now() + '] reloading...');
  await page.waitForNavigation();
  console.log('[' + Date.now() + '] done.');

  // ログイン後ページで「会員情報」クリック
  await page.click('a[href="https://my.rakuten.co.jp/?l-id=top_normal_myrakuten_account"]');
  // リロード待ち
  console.log('[' + Date.now() + '] reloading...');
  await page.waitForNavigation({waitUntil: 'load'});
  console.log('[' + Date.now() + '] done.');

  // 取り敢えず結果をSTDOUTに出力
  // ログイン成功していればログイン後画面(JSで動的表示等の場合はJSのみ出てくるかも)
  // ログイン失敗していればログイン画面+エラーメッセージ
  console.log(await page.content());

  // 終了
  await browser.close();
})();
