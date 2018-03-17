# roselia-encore
其实这个不仅是个应援站，这同时是个模板，通过更改`roselia-e.js`就能够对内容进行修改（某Java: 一处编译，处处Dubug）。

## 关于自带的模板
`roselia.utils.renderObject(template, context, delim)`: 将根据`context`递归地渲染template中的String, Array， 否则原样返回。这个函数不会修改template中的内容，将会返回渲染好的一个副本。但是好像Vue的模板足够强大，目前没有用到，但是我还是写了进去。

## 关于语言
`roselia.languages` 可用的语言

`roselia.lang` 是当前的语言，必须是`roselia.languages`中的一个值

`roselia.langOf`：
    
    roselia.langOf(lang) => lang[roselia.lang]

    roselia.langOf(context, attribute) => context[roselia.lang + attriburte]
        
        例子： roselia.langOf(member, "Name")|roselia.lang="cn" => member.cnName

    roselia.langOf(...args) | args.length > 2
        => 根据roselia.languages的顺序返回当前语言所对应的参数。

---2.6更新---

功能：增加了图片懒加载功能（来自本人的另外的项目：Adovec-Utils，欢迎给Star/批判一番），可以在专辑和成员的Modal里面添加扩展信息。（extension: [{title:, content:}]）
以及画质切换（主要是jpg压缩了之后在edge里面渲染得太恶心了，还好我用Chrome）
内容：增加了小姐姐的图片，和5单假封面。

---3.18---

内容：增加了1专的详细信息

功能：将`static`移动至`static_assets`，辅以`scripts`中的部分脚本。

`bootstrap.py` 将`static_assets`中的图片和JS压缩，增加访问速度。

`TrackParser.py|clj` 将专辑信息转化为`roselia-e.js`中的信息文件。

`RoseliaEncore.scala` 利用[NaiveJSON](https://github.com/Somainer/NaiveJSON)，将官方网页转换为专辑信息（其实就是爬虫，但是我偏不用Python写）

以5单为例，url="https://bang-dream.com/cd/roselia_5th/"时，结果：

```JSON
{
  "id": 5,
  "title": "Opera of the wasteland",
  "track": [
    "Opera of the wasteland",
    "軌跡",
    "Opera of the wasteland -instrumental-",
    "軌跡 -instrumental-"
  ],
  "releaseDate": "2018-3-21"
}
```

这个是可以直接粘贴到`roselia-e.js`里面的，将`TrackParser`的`group`替换为其他小队，就可以爬取其他小队的信息了。

~~不许摸你的格式能不能整齐点？~~

## 主要信息
主要信息存放在`roselia.memberList`, `roselia.single`, `roselia.moreLinks` 中。
Roselia 要出专辑了，开心，模板到时候公布信息后再改吧。PP'P出九单又如何？(HHW: 我终于要出2单了hhh)

## 其他group怎么办？
`let afterglow = roselia;`

或者就不动了，反正看源代码的人都会会心一笑（笑）。

## Credits
整体魔改了Aqours许愿瓶，和部分Twitter上的theme.

Vue.js 作为模板生成网页。因为今后可能会尝试对不同的小组进行渲染，故发布时也没有将模板渲染。如果建在服务器上，建议渲染后再发送。