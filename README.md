# study_crawling-by-lambda
AWS Lambdaを使用したWebサイトクローリング(ログイン操作あり)の実装サンプル。

ログインが必要なWebサイト内のクローリングを行う実装の試行として、楽天市場( www.rakuten.co.jp ) への会員ログインを行い、さらに「会員情報」のページへ遷移するサンプルです。
適当な会員制Webサイトとして、Github、Google等は二段階認証が必要で自動処理はほぼ無理なので、この辺りが緩めな楽天市場を採用しています。

# Setup

## nodejsで直接実行(非headless環境でデバッグしたい場合はこちら)

```
$ npm install

$ echo "USER_ID='<楽天市場 ID>'" >> .env
$ echo "PASSWD='<楽天市場 パスワード>'" >> .env

$ node autologin.js
```

## Docker環境で実行

```
$ docker build  --tag autologin_test -f Dockerfile .
$ docker run -ti --volume=${PWD}:/mnt/app autologin_test npm install

$ echo "USER_ID='<楽天市場 ID>'" >> .env
$ echo "PASSWD='<楽天市場 パスワード>'" >> .env

$ docker run -ti --volume=${PWD}:/mnt/app autologin_test node autologin.js
```

# TODO

- [x] ログインはできるがログイン後のページ遷移で、どこへ行っても `waitForNavigation()` がタイムアウト or 永遠にロード待ちとなってしまう
    - waitForSelector() で目的の要素、もしくはページ末端にある要素を待ち受けたほうがよさそう。
