;(function(window, undefined){
    let roselia = {};
    let on = (f1, f2) => (a, b) => f2(f1(a), f1(b));
    let equalsOn = f => on(f, (a,b) => a===b);
    let isObjFunc = name => o => ({}).toString.call(o) === '[object ' + name + ']';
    let _ = roselia.utils = {
        isObjFunc(name) {
            return o => ({}).toString.call(o) === '[object ' + name + ']';
        },
        extend: (function() {
            var isObject = isObjFunc('Object'),
                isArray = isObjFunc('Array'),
                isBoolean = isObjFunc('Boolean')
            return function extend() {
                var index = 0,isDeep = false,obj,copy,destination,source,i
                if(isBoolean(arguments[0])) {
                    index = 1
                    isDeep = arguments[0]
                }
                for(i = arguments.length - 1;i>index;i--) {
                    destination = arguments[i - 1]
                    source = arguments[i]
                    if(isObject(source) || isArray(source)) {
                        for(var property in source) {
                            obj = source[property]
                            if(isDeep && ( isObject(obj) || isArray(obj) ) ) {
                                copy = isObject(obj) ? {} : []
                                var extended = extend(isDeep,copy,obj)
                                destination[property] = extended 
                            }else {
                                destination[property] = source[property]
                            }
                        }
                    } else {
                        destination = source
                    }
                }
                return destination
            }
        })(),
        sameDate: (a,b,m) => (a!=="never" && a!=="else") && (a==="always" || (m || ["Month", "Date"]).map(s => s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())).every(attr => equalsOn(x => x["get"+attr]&&x["get"+attr]())(new Date(a), b))),
        deepExtend(...args){
        return this.extend(true, ...args);
        },
        render(template, context, delim){// A not so naive template engine.
            const funcTemplate = expr => `with(data || {}) {return (${expr});}`;
            return template.replace(new RegExp((delim || ["{{", "}}"]).join("\\s*?(.*?)\\s*?"), "g"), (_, expr) => (new Function("data", funcTemplate(expr)))(context));
        },
        renderObject(template, context, delim){
            let _ = {};
            ['String', 'Array', 'Object'].forEach(t => _[`is${t}`] = this.isObjFunc(t));
            if(_.isString(template)) return this.render(template, context, delim);
            if(_.isArray(template)) return template.map(o => this.renderObject(o, context, delim));
            if(_.isObject(template)){
                let res = this.deepExtend({}, template);
                for(let k in res){
                    res[k] = this.renderObject(res[k], context, delim);
                }
                return res;
            }
            return template;//Can't render.
        }
        
    };
    roselia.memberList = [
        {
            jpName: "湊友希那",
            cnName: "凑友希那",
            enName: "Minato Yukina",
            birthday: "10-26",
            role: "Vo",
            jpCVName: "相羽あいな",
            cnCVName:"相羽爱奈",
            enCVName: "Aiba Aina",
            bloodType: "A",
            horoscope: "天蝎",
            encoreColor: "#c67cb5"
        },
        {
            jpName: "氷川紗夜",
            cnName: "冰川纱夜",
            enName: "Hikawa Sayo",
            birthday: "3-20",
            role: "Gt",
            jpCVName: "工藤晴香",
            cnCVName:"工藤晴香",
            enCVName: "Kudou Haruka",
            bloodType: "AB",
            horoscope: "双鱼",
            encoreColor: "#81d8d4"
        },
        {
            jpName: "今井リサ",
            cnName: "今井莉纱",
            enName: "Imai Lisa",
            birthday: "8-25",
            role: "Ba",
            jpCVName: "遠藤えゆりか",
            cnCVName:"远藤祐里香",
            enCVName: "Endō Yurika",
            bloodType: "O",
            horoscope: "处女",
            encoreColor: "#fc926c"
        },
        {
            jpName: "宇田川あこ",
            cnName: "宇田川亚子",
            enName: "Utakawa Ako",
            birthday: "7-3",
            role: "Dr",
            jpCVName: "桜川めぐ",
            cnCVName:"樱川惠",
            enCVName: "Sakuragawa Megu",
            bloodType: "B",
            horoscope: "巨蟹",
            encoreColor: "#fb81ca"
        },
        {
            jpName: "白金燐子",
            cnName: "白金燐子",
            enName: "Shirokane Rinko",
            birthday: "10-17",
            role: "Kb",
            jpCVName: "明坂聡美",
            cnCVName:"明坂聪美",
            enCVName: "Akesaka Satomi",
            bloodType: "O",
            horoscope: "天秤",
            encoreColor: "#cbc5ce"
        }
    ];
    roselia.single = [
        {
            id: 1,
            title: "BLACK SHOUT",
            track: ["BLACK SHOUT", "LOUDER", "BLACK SHOUT -instrumental- ", "LOUDER -instrumental- ", "Roseliaミニドラマ～バンド練習編～ "],
            releaseDate: "2017-4-19",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://www.bang-dream.com/cd/roselia-1st-single-%E3%80%8Cblack-shout%E3%80%8D/"
                },
                {
                    origin: "NetEase",
                    link: "http://music.163.com/album?id=35423192"
                },
                {
                    origin: "萌娘百科",
                    link: "https://zh.moegirl.org/BLACK_SHOUT"
                }
            ]
        },
        {
            id: 2,
            title: "Re:birth day",
            track: ["Re:birth day", "陽だまりロードナイト", "Re:birth day -instrumental- ", "陽だまりロードナイト -instrumental- ", "Roselia ミニドラマ～ふれあい動物編～ "],
            releaseDate: "2017-6-28",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://www.bang-dream.com/cd/roselia-2ndsg/"
                },
                {
                    origin: "NetEase",
                    link: "http://music.163.com/album?id=35663708"
                }
            ]
        },
        {
            id: 3,
            title: "熱色スターマイン",
            track: ["熱色スターマイン", "－HEROIC ADVENT－", "熱色スターマイン -instrumental- ", "－HEROIC ADVENT－ -instrumental- ", "Roseliaミニドラマ～あこの厨二語辞典編～ "],
            releaseDate: "2017-8-30",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://www.bang-dream.com/cd/roselia-3rd-single/"
                },
                {
                    origin: "NetEase",
                    link: "http://music.163.com/album?id=36030721"
                }
            ]
        },
        {
            id: 4,
            title: "ONENESS",
            track: ["ONENESS", "Determination Symphony", "ONENESS -instrumental- ", "Determination Symphony -instrumental- "],
            releaseDate: "2017-11-29",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://www.bang-dream.com/cd/roselia4th/"
                },
                {
                    origin: "NetEase",
                    link: "http://music.163.com/album?id=36856222"
                }
            ]
        },
        {
            id: 5,
            title: "Opera of the wasteland",
            track: ["Opera of the wasteland", "タイトル未定", "Opera of the wasteland -instrumental- ", "タイトル未定 -instrumental- "],
            releaseDate: "2018-3-21",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://www.bang-dream.com/cd/roselia_5th/"
                }
            ]
        },
    ];
    roselia.moreLinks = [
        {
            description: "BanG Dream!导航站",
            target: "https://www.bangdream.moe/"
        },
        {
            description: "BanG Dream! 查卡器",
            target: "https://bangdream.ga/"
        },
        {
            description: "BanG Dream! 百科",
            target: "https://www.bangdreamwiki.com/"
        },
    ];
    roselia.langOf = function(){
        if(arguments.length === 1){
            return arguments[0][roselia.lang];
        }
        if(arguments.length === 2){
            return arguments[0][roselia.lang + arguments[1]];
        }
        return arguments[this.languages.indexOf(roselia.lang)] || arguments[0];
    };
    roselia.languages = ['cn', 'jp', 'en'];
    roselia.displayLanguages = ['中文', '日本語', 'English'];
    let curLang = (navigator.language || navigator.browserLanguage).toLowerCase();
    let matchLang = roselia.languages.filter(n => curLang.indexOf(n) > -1);
    roselia.lang = matchLang.length? matchLang[0] : 'cn';
    let today = new Date;
    roselia.birthdayMember = roselia.memberList.filter(m => _.sameDate(m.birthday, today));
    roselia.releaseSingle = roselia.single.filter(m => _.sameDate(m.releaseDate, today, ["full year", "month", 'date']));//看上去 这个功能没有什么用。
    window.roselia = roselia;
}(window));
$(function(){
    roselia.mainVue = new Vue({
        el: "#main",
        data: {
            roselia
        }
    });
    $(".heimu").mouseover((e) => {
        $(e.target).css("color", "white");
    }).mouseout((e) => {
        $(e.target).css("color", "black");
    });
});