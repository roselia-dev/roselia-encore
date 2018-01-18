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

## 主要信息
主要信息存放在`roselia.memberList`, `roselia.single`, `roselia.moreLinks` 中。
Roselia 要出专辑了，开心，模板到时候公布信息后再改吧。PP'P出九单又如何？(HHW: 我终于要出2单了hhh)

## 其他group怎么办？
`let afterglow = roselia;`

或者就不动了，反正看源代码的人都会会心一笑（笑）。

## Credits
整体魔改了Aqours许愿瓶，和部分Twitter上的theme.

Vue.js 作为模板生成网页。因为今后可能会尝试对不同的小组进行渲染，故发布时也没有将模板渲染。如果建在服务器上，建议渲染后再发送。