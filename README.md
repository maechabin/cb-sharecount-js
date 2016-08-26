# cb-sharecount-js

## About

任意のURL（複数可）のSNS上でのシェア数を非同期で取得して表示するためのjQueryプラグイン。キャッシュ機能付き。

## Feature
- 実装が簡単。プラグインを実行させたいjQueryオブジェクトに指定したセレクター要素のtitle属性に[シェア数を取得したいURL]を設定するだけ。**JavaScriptの実装はたったの1行**。
- 同一ページ内で複数のURLの値の取得ができるので、ブログ記事の一覧などでの使用に最適。
- 非同期かつ並列処理で値を取得するので、ページの表示にもやさしい。
- 値だけを取得するので、レイアウトもデザインも自由に行える。
- localStorageを使ったcache機能付き（デフォルト有効期限: 1日）。同一ドメイン内であれば複数のページで共有可能。
- はてなブックマーク登録数、Facebookいいね数、Twitterツイート数、Pocketシェア数の4サービスに対応。表示するSNSを選択可能。

```
Twitterのツイート数を取得するには、事前に以下のサービスに登録しておく必要があります。

count.jsoon
https://jsoon.digitiminimi.com/
```

## Demo

[http://maechabin.github.io/cb-sharecount-js/](http://maechabin.github.io/cb-sharecount-js/)

私のブログにも実装済みです。  
[http://mae.chab.in](http://mae.chab.in/)


## Usage

### ファイルの読み込み
jQueryとjquery.cbsharecount.jsをページに読み込みます。
```html
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="jquery.cbsharecount.min.js"></script>
```

### JavaScriptの実装
JavaScriptの実装は以下の1行のみ！（複数のURLの値を取得する場合でも）
```javascript
<script>
$(document).ready(function () {
  $(セレクター).cbShareCount();
});
</script>
```

オプションを使って、cacheする時間を指定する場合（msで設定）
```javascript
<script>
$(document).ready(function () {
  $(セレクター).cbShareCount({
    // 1時間（3600000ms）に設定
    cacheTime: 3600000
  });
});
</script>
```

表示するSNSサービスをFacebookいいね数とはてなブックマーク登録数に限定する場合
```javascript
<script>
$(document).ready(function () {
  $(セレクター).cbShareCount({
    assign: ['fb', 'hb']
  });
});
</script>
```

キャッシュ機能を使用しない場合
```javascript
<script>
$(document).ready(function () {
  $(セレクター).cbShareCount({
    cache: false
  });
});
</script>
```


### HTMLの実装
HTMLの実装は以下のルールさえ押さえておけば、あとは自由です。

#### URLの取得部分
[ルール1]
jQueryオブジェクトに指定したセレクター要素の`title属性`に`[シェア数を取得したいURL]`を設定

```html
<div class="[セレクター]" title="[シェア数を取得したいページのURL]">
  [取得した値を表示させる箇所]
</div>
```

#### 値の表示部分
[ルール2]  
jQueryオブジェクトに指定したセレクター要素の子要素にそれぞれ以下の`[クラス属性]`を指定
- **class="cb-hb"**　→　はてなブックマークの登録数表示用
- **class="cb-fb"**　→　Facebookのいいね数表示用
- **class="cb-tw"**　→　Twitterのツイート数表示用
- **class="cb-pk"**　→　Pocketのシェア数表示用

[ルール3]  
値は上記のclass属性をつけた要素の子要素の`[span要素]`に表示される。
```html
<div class="[セレクター]" title="[シェア数を取得したいページのURL]">
	<!--子要素-->
	<p class="cb-hb"><span>[ここに取得した値が表示される]</span></p>
</div>
```

## Example

### ulとliを使った実装例
```html
<ul class="[セレクター]" title="[シェア数を取得したいページのURL]">
    <li class="cb-hb">はてブ数<span></span></li>
    <li class="cb-fb">いいね<span></span></li>
</ul>
```

### divとpを使った実装例
```html
<div class="[セレクター]" title="[シェア数を取得したいページのURL]">
    <p class="cb-fb">Facebook<a href="#"><span></span></a></p>
    <p class="cb-hb">Hatena<a href="#"><span></span></a></p>
</div>
```

### 複数のURLの値を取得する際の実装例（繰り返処理しても可）
```html
<div class="[セレクター（同じもの）]" title="[シェア数を取得したいページのURL1]">
    <p class="cb-fb">Facebook<a href="#"><span></span></a></p>
    <p class="cb-hb">Hatena<a href="#"><span></span></a></p>
</div>

<div class="[セレクター（同じもの）]" title="[シェア数を取得したいページのURL2]">
    <p class="cb-fb">Facebook<a href="#"><span></span></a></p>
    <p class="cb-hb">Hatena<a href="#"><span></span></a></p>
</div>
```

## Options

**cache {Boolean}**
キャッシュ機能を使用するか(true)、使用しないか（false）指定します。デフォルト値は`false`。

**cacheTime {Number}**
キャッシュ機能を使用する場合のキャッシュの有効期間を指定します。ms（ミリ秒）の数値を指定します。デフォルト値は1日で`86400000`。

**assign {Array}**
シュア数を取得するSNSサービスを指定します。次のようにサービスの略語を配列に指定します。`Facebook => 'fb'`、`Twitter => 'tw'`、`はてなブックマーク => 'hb'`、`Pocket => 'pk'`。デフォルト値は、すべてのサービスのシェア数を表示するようになっており`['fb', 'hb', 'tw', 'pk']`。

## License

MIT license

## Update

2016-08-25 v2.0.3
- FacebookのAPIの仕様変更に対応

2016-07-07 v2.0.0
- Twitterツイート数（別途count.jsoonを使用）、Pocketシェア数に対応
- キャッシュ機能改善

2016-07-01 v1.1.0
- キャッシュ機能の追加（1日保存）

2015-11-21 v1.0.3
- TwitterのAPIの仕様変更により、Twitterのツイート数表示機能を停止
