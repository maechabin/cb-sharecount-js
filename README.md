#jquery.cb-Share-Count.js

##＜概要＞

任意のURL（複数可）のSNS上でのシェア数を非同期で取得して表示するためのjQueryプラグイン。

##＜特徴＞
- 実装が簡単。プラグインを実行させたいjQueryオブジェクトに指定したセレクター要素のtitle属性に[シェア数を取得したいURL]を設定するだけ。**JavaScriptの実装はたったの1行**。
- 複数のURLの値の取得ができるので、ブログ記事の一覧などでの使用に最適。
- 非同期で値を取得するので、ページの表示にもやさしい。
- 値だけを取得するので、レイアウトもデザインも自由に行える。
- はてなブックマーク登録数、Twitterツイート数、Facebookいいね数の3サービスに対応


##＜実装方法＞

###読み込み
jQueryとjquery.cbsharecount.jsをページに読み込みます。
```html
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="jquery.cbsharecount.min.js"></script>
```

###JavaScript
JavaScriptの実装は以下の1行のみ！
```html
<script>
$(セレクター).cbShareCount();
</script>
```
  
  
###HTML/CSS
HTML/CSSの実装は以下のルールさえ押さえておけば、あとは自由にデザイン可能です。

####URLの取得部分
[ルール1]  
jQueryオブジェクトに指定したセレクター要素のtitle属性に[シェア数を取得したいURL]を設定
```html
<div class="[セレクター]" title="[シェア数を取得したいページのURL]">
    [取得した値を表示させる箇所]
</div>
```

####値の表示部分
[ルール2]  
jQueryオブジェクトに指定したセレクター要素の子要素にそれぞれ以下のクラス属性を指定
- **class="cb-hb"**　→　はてなブックマークの登録数表示用
- **class="cb-tw"**　→　ツイッターのツイート数表示用
- **class="cb-fb"**　→　Facebookのいいね数表示用

[ルール3]  
値は上記のclass属性をつけた要素の子要素のspan要素に表示される。
```html
<div class="[セレクター]" title="[シェア数を取得したいページのURL]">
	<!--子要素-->
	<p class="cb-hb"><span>[ここに取得した値が表示される]</span></p>
</div>
```

##＜実装例＞

###ulとliを使った実装例
```html
<ul class="[セレクター]" title="[シェア数を取得したいページのURL]">
    <li class="cb-hb">はてブ数<span></span></li>
    <li class="cb-tw">ツイート数<span></span></li>
    <li class="cb-fb">いいね<span></span></li>
</ul>
```

###divとpを使った実装例
```html
<div class="[セレクター]" title="[シェア数を取得したいページのURL]">
    <p class="cb-fb">Facebook<a href="#"><span></span></a></p>
    <p class="cb-tw">Twitter<a href="#"><span></span></a></p>
    <p class="cb-hb">Hatena<a href="#"><span></span></a></p>
</div>
```

###複数のURLの値を取得する際の実装例（繰り返処理しても可）
```html
<div class="[セレクター（同じもの）]" title="[シェア数を取得したいページのURL1]">
    <p class="cb-fb">Facebook<a href="#"><span></span></a></p>
    <p class="cb-tw">Twitter<a href="#"><span></span></a></p>
    <p class="cb-hb">Hatena<a href="#"><span></span></a></p>
</div>

<div class="[セレクター（同じもの）]" title="[シェア数を取得したいページのURL2]">
    <p class="cb-fb">Facebook<a href="#"><span></span></a></p>
    <p class="cb-tw">Twitter<a href="#"><span></span></a></p>
    <p class="cb-hb">Hatena<a href="#"><span></span></a></p>
</div>
```


##＜デモ＞

[http://jsdo.it/maechabin/mixw](http://jsdo.it/maechabin/mixw)

私のブログにも実装済みです。  
[http://mae.chab.in](http://mae.chab.in/)

##＜ライセンス＞

MIT license
