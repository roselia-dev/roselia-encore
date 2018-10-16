;(function(window, undefined){
    let roselia = {};
    let on = (f1, f2) => (a, b) => f2(f1(a), f1(b));
    let equalsOn = f => on(f, (a,b) => a===b);
    let isObjFunc = name => o => ({}).toString.call(o) === '[object ' + name + ']';
    let _ = roselia.utils = {
        isObjFunc(name) {
            return o => ({}).toString.call(o) === '[object ' + name + ']';
        },
        extend: $.extend,
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
        },
        debounce(func, delay){
            let tmr;
            return (...args) => {
                clearTimeout(tmr);
                tmr = setTimeout(() => func(...args), delay);
            }
        },
        throttle(func, threshold){
            let last=0, tmr;
            return (...args) => {
                let now = new Date;
                clearTimeout(tmr);
                if(now - last < threshold){
                    tmr = setTimeout(() => func(...args), threshold);
                } else {
                    last = now;
                    func(...args);
                }
            }
        },
        setPath(...path){
            window.history.pushState({}, "", "#" + path.join("/"));
        },
        getPath(){
            if(!window.location.hash.length) return [];
            return window.location.hash.substring(1);
        },
        onPathChange(then){
            window.addEventListener("popstate", then);
        },
        positionNum(n){
            return n>10&&n<20?"th":(["th", "st", "nd", "rd"][n%10] || "th");
        },
        openPath(path){
            if(path.length<3) $(".modal.in").attr('manual', true).modal('hide');
            else $(".modal").filter((_,e)=> (e.getAttribute("roselia-path")||"").toLowerCase() === path.toLowerCase()).attr('manual', true).modal('show');
        }
    };
    let utils = _;
    roselia.LazyLoad = function($){
        let _ = {
            extend: $.extend,
            deepExtend(...args){
                return this.extend(true, ...args);
            },
            render: utils.render,
            partition(arr, cond){
                let res=[[],[]];
                arr.forEach(v => res[cond(v)^1].push(v));
                return res;
            },
            debounce: utils.debounce,
            throttle: utils.throttle
        };
        let AdovecLazyLoad = function(opts){
            let defaults = {
                load: true,
                placeHolder: "static/img/logo.png",
                renderPlaceHolder: false,
                selector: "img",
                changePlaceHolder: true,
                prefix: "roselia",
                onscrolledimg: null,
                delim: ["{{", "}}"],
                backupSrc: true,
                throttleRate: 500
            };
            this.alive = false;
            let options = this.options = _.deepExtend({}, defaults, opts);
            this.setOption = function(o){
                this.options = _.deepExtend({}, defaults, opts);
                return this;
            };
            this.load = function(){
                this.alive && this.destroy();
                this.alive = true;
                this.pics = document.querySelectorAll(options.selector);
                this.pics.forEach = this.pics.forEach || [].forEach;
                if(this.options.changePlaceHolder){
                    this.pics.forEach(e => {
                        let attr = options.prefix+"-src";
                        options.backupSrc && e.setAttribute(attr, e.src);
                        e.src = options.changePlaceHolder?_.render(options.placeHolder, e, options.delim):options.placeHolder;
                    });
                }
                this.handler();
                addEventListener("scroll", this.handler);
            };
            this.handler = _.throttle(function(e){
                let curY = document.documentElement.scrollTop, height = window.innerHeight;
                return (new Promise(resolve => {
                    resolve(_.partition(this.pics, e => (e.y && e.y <= curY + height))); //Prev: e.y >= curY && e.y <= curY + height
                })).then(([scrolled, remain]) => {
                    scrolled.forEach(e => e.src = e.getAttribute(this.options.prefix+"-src") || e.src);
                    return this.pics = remain;
                }).then(e => (e.length||this.destroy(), e)).then(imgs => this.options.onscrolledimg && this.options.onscrolledimg(imgs));
            }.bind(this), options.throttleRate);
            this.destroy = function(){
                this.alive = false;
                this.pics.forEach(e => e.src = e.getAttribute(this.options.prefix+"-src") || e.src);
                removeEventListener("scroll", this.handler);
            };
            this.options.load && this.load();

        };
        AdovecLazyLoad.of = function(o){
            return new AdovecLazyLoad(o);
        };
        AdovecLazyLoad.utils = _;
        return AdovecLazyLoad;
    }(jQuery);
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
            encoreColor: "#890f87", //"#c67cb5",
            memberPicUpper: 2
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
            encoreColor: "#00aabc", //"#81d8d4",
            memberPicUpper: 2
        },
        {
            jpName: "今井リサ",
            cnName: "今井莉纱",
            enName: "Imai Lisa",
            birthday: "8-25",
            role: "Ba",
            jpCVName: "遠藤ゆりか → 中島由貴",
            cnCVName:"远藤祐里香 → 中岛由贵",
            enCVName: "Endō Yurika → Nakashima Yuki",
            bloodType: "O",
            horoscope: "处女",
            encoreColor: "#dd2200", //"#fc926c",
            memberPicUpper: 2,
            cvPicUpper: 1
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
            encoreColor: "#dd0087", //"#fb81ca",
            memberPicUpper: 2
        },
        {
            jpName: "白金燐子",
            cnName: "白金燐子",
            enName: "Shirokane Rinko",
            birthday: "10-17",
            role: "Key",
            jpCVName: "明坂聡美",
            cnCVName:"明坂聪美",
            enCVName: "Akesaka Satomi",
            bloodType: "O",
            horoscope: "天秤",
            encoreColor: "#bbbbbb", //"#cbc5ce",
            memberPicUpper: 2
        }
    ];
    roselia.memberList.forEach(m => {
        m.memberPicUpper = m.memberPicUpper || 2;
        m.cvPicUpper = m.cvPicUpper || 1;
    });
    roselia.member = {
        opened: roselia.memberList.map(e => 0),
        openCount: 0,
        upper: roselia.memberList.length,
        open(idx){
            this.openCount += this.opened[idx]^1;
            this.opened[idx] = 1;
        },
        picMod: 0,
        picSuffix: "jpg",
        picDiscrip: "流畅体验",
        changePicMod(){
            this.picMod ^= 1;
            this.picSuffix = ["jpg", "png"][this.picMod];
            this.picDiscrip = ["流畅体验", "丝滑画质"][this.picMod];
            roselia.mainVue.$nextTick(() => roselia.lazyload.load());
        }
    };
    roselia.single = [
        {
            id: 1,
            title: "BLACK SHOUT",
            track: ["BLACK SHOUT", "LOUDER", "BLACK SHOUT -instrumental- ", "LOUDER -instrumental- ", "Roseliaミニドラマ～バンド練習編～ "],
            releaseDate: "2017-4-19",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://bang-dream.com/cd/roselia-1st-single-%E3%80%8Cblack-shout%E3%80%8D/"
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
                    link: "https://bang-dream.com/cd/roselia-2ndsg/"
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
                    link: "https://bang-dream.com/cd/roselia-3rd-single/"
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
                    link: "https://bang-dream.com/cd/roselia4th/"
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
            track: ["Opera of the wasteland", "軌跡", "Opera of the wasteland -instrumental- ", "軌跡 -instrumental- "],
            releaseDate: "2018-3-21",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://bang-dream.com/cd/roselia_5th/"
                },
                {
                    origin: "NetEase",
                    link: "http://music.163.com/album?id=37987030"
                }
            ],
            extension: [{
                title: "P.S.",
                content: ["和PP'P的⑨单一起买有特典？买买买（钱包卒）"]
            }]
        },
        {
            id: 6,
            title: "R",
            track: ["R", "BLACK SHOUT(リマスターver.)", "Neo-Aspect(リマスターver.)", "R -instrumental-", "BLACK SHOUT(リマスターver.) -instrumental-"],
            releaseDate: "2018/07/25",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://bang-dream.com/discographies/367"
                },
                {
                    origin: "NetEase",
                    link: "https://music.163.com/album?id=71852033"
                }
            ],
            extension: [{
                title: "P.S.",
                content: ["BanG-Dream的网站改版了！（终于不用WordPress了）| Yuki真棒.jpg"]
            }]
        }
    ];
    roselia.album = [
        {
            id: 1,
            title: "Anfang",
            track: ["Neo-Aspect", "BLACK SHOUT", "Opera of the wasteland", "陽だまりロードナイト", "ONENESS", "Re:birth day", "Legendary", "－HEROIC ADVENT－", "Determination Symphony", "熱色スターマイン", "軌跡", "LOUDER"],
            releaseDate: "2018-5-2",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://bang-dream.com/discographies/113"
                },
                {
                    origin: "NetEase",
                    link: "http://music.163.com/m/album?id=38509280"
                }
            ],
            extension: [{
                title: "P.S.",
                content: ["嘛，这个好像是买Blu-ray付生産限定盤更有意义呢，通常版的东西就少得可怜了，不过就当单曲买了也不亏（3200+JPY）"]
            }]
        },
    ];
    roselia.cover = [
        {
            id: 1,
            title: "バンドリ！ ガールズバンドパーティ！ カバーコレクション Vol.1",
            track: ["光るなら / Poppin’Party", "千本桜 / Poppin’Party", "アスノヨゾラ哨戒班 / Afterglow", "READY STEADY GO / Afterglow", "secret base ～君がくれたもの～ / Pastel＊Palettes", "ふわふわ時間 / Pastel＊Palettes", "魂のルフラン / Roselia", "ETERNAL BLAZE / Roselia", "いーあるふぁんくらぶ / ハロー、ハッピーワールド！", "ロメオ / ハロー、ハッピーワールド！"],
            releaseDate: "2018-06-27",
            links: [
                {
                    origin: "BanG Dream",
                    link: "https://bang-dream.com/cd/%E3%83%90%E3%83%B3%E3%83%89%E3%83%AA%EF%BC%81-%E3%82%AC%E3%83%BC%E3%83%AB%E3%82%BA%E3%83%90%E3%83%B3%E3%83%89%E3%83%91%E3%83%BC%E3%83%86%E3%82%A3%EF%BC%81-%E3%82%AB%E3%83%90%E3%83%BC%E3%82%B3%E3%83%AC/"
                },
                {
                    origin: "NetEase",
                    link: "http://music.163.com/m/album?id=38272155"
                }
            ]
        }
    ];
    let today = new Date;
    ["single", "album", "cover"].map(x => roselia[x]).forEach(x => x.forEach(album => {
        if(roselia.utils.sameDate(album.releaseDate, today, ['month', 'date', 'full year'])){
            album.extension = album.extension || [];
            album.extension.push({title: "Released Today!", content: {cn: '今日发售！', jp: '今発売！', en: 'Released Today!'}});
        }
    }));
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
            if(this.utils.isObjFunc('Array')(arguments[0])) return this.langOf(...arguments[0]);
            return this.utils.isObjFunc('String')(arguments[0]) ? arguments[0] : arguments[0][roselia.lang];
        }
        if(arguments.length === 2){
            return arguments[0][roselia.lang + arguments[1]];
        }
        return arguments[this.languages.indexOf(roselia.lang)] || arguments[0];
    };
    roselia.randomPick = function(from, to, then){//Pick random in [from, to)
        then = then || (n => n?n:"");
        return then(Math.floor(Math.random()*(to - from) + from));
    };
    roselia.imgBase = ["static/img/", "https://app.roselia.moe/encore/"][0 && roselia.randomPick(0, 2, x=>x)];// Diable app.roselia.moe
    roselia.languages = ['cn', 'jp', 'en'];
    roselia.displayLanguages = ['中文', '日本語', 'English'];
    let curLang = (navigator.language || navigator.browserLanguage).toLowerCase();
    let matchLang = roselia.languages.filter(n => curLang.indexOf(n) > -1);
    roselia.lang = matchLang.length? matchLang[0] : 'cn';
    roselia.birthdayMember = roselia.memberList.filter(m => _.sameDate(m.birthday, today));
    roselia.releaseSingle = roselia.single.filter(m => _.sameDate(m.releaseDate, today, ["full year", "month", 'date']));//看上去 这个功能没有什么用。
    roselia.randomLyric = {
        'album': '', 
        'at': '', 
        'id': 1, 
        'lyric': '', 
        'name': '', 
        'type': ''
    }
    roselia.getLyric = function () {
        return fetch('https://roselia.moe/blog/api/roselia/lyric/random').then(j => j.json()).then(data => {
            data.link = `#${data.type}/${data.id}${utils.positionNum(data.id)}`;
            const ls = data.lyric.split('\n')
            data.jpLyric = ls[0]
            data.cnLyric = ls[1]
            roselia.randomLyric = data;
        })
    }
    window.roselia = roselia;
}(window));
$(function(){
    let TITLE = document.title;
    roselia.mainVue = new Vue({
        el: "#main",
        data: {
            roselia
        }
    });
    roselia.lazyload = roselia.LazyLoad.of({load: false});
    roselia.mainVue.$nextTick(() => {
        roselia.lazyload.load();
        roselia.utils.openPath(roselia.utils.getPath());
    });
    let $modal = $('.modal');
    $modal.on('shown.bs.modal', function (e) {
        let targ = $(e.target);
        if(!targ.attr("manual")){
            let path = e.target.getAttribute("roselia-path");
            path && roselia.utils.setPath(path);
        }
        targ.attr("manual", "");
        document.title = targ.find('.modal-title').text() || document.title;
        roselia.lazyload.handler();
    });
    $modal.on("hidden.bs.modal", function (e) {
        let targ = $(e.target);
        targ.attr("manual") || roselia.utils.setPath([]);
        targ.attr("manual", "");
        document.title = TITLE;
    });
    $(".heimu").mouseover((e) => {
        $(e.target).css("color", "white");
    }).mouseout((e) => {
        $(e.target).css("color", "black");
    });
    addEventListener("popstate", e => roselia.utils.openPath(roselia.utils.getPath()));
    roselia.getLyric()
});