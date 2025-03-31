# 根据空格拆分字符串

 ``` tsx
  const str = `remote_addr：192.168.3.69:48512
status_code：200
content_type：
method：GET
proto：HTTP/1.1
host：192.168.3.11:9226
header：User-Agent：Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15Accept-Encoding：gzipbody：
url：/
user_agent：Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15`
 str.split('')
 ```

 **这样可得到一个数组，如果我想把他拆分成一个对象该如何实现 例如 {remote_addr:102.1.1.1}**

 ```jsx
  const reg  = \(\w+):(\S+)\ 
  str.replace
 ```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/woskvxzd-the-animator/embed/QWYmdBq?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/woskvxzd-the-animator/pen/QWYmdBq">
  Untitled</a> by 耿延 (<a href="https://codepen.io/woskvxzd-the-animator">@woskvxzd-the-animator</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
