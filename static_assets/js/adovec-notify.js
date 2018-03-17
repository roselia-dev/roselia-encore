"use strict";
(function(HOST){
    let ADVB = function (o){
        const defaults = {
            global: {
                element: null,
                hoverHeight: 25,
                defaultHeight: 5,
                marginLeft: "37%",
                data: {}
            },
            events:[]
        };
        let dat = new Date;
        let _ = ADVB.utils;
        this.createElement = function(payload, before){
            //Create <div> tag
            let divTag = document.createElement('div');

            // Create <a> tag
            let aTag = document.createElement('a');
            aTag.setAttribute('target', '_blank');

            // Create <span> tag
            let span = document.createElement('span');
            span.setAttribute('style', 'opacity: 0;');
            span.innerHTML = payload.text;//_.render(payload.text, payload.data);
            span.style.marginLeft = payload.marginLeft || o.global.marginLeft || "37%";
            span.style.color = payload.textColor || o.global.textColor || "";
            aTag.addEventListener("mouseenter", e => {
                span.style.opacity = 100;
                e.target.style.height = (o.global.hoverHeight || payload.hoverHeight)+"px";
            });
            aTag.addEventListener("mouseout", e => {
                span.style.opacity = 0;
                e.target.style.height = (o.global.defaultHeight || payload.defaultHeight)+"px";
            });
            this.aElement = aTag;
            this.divElement = divTag;
            this.spanElement = span;
            this.aElement.style.cssText = `
            background: ${payload.color};
            background-size: cover;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            width: 100vw;
            height: ${payload.defaultHeight || o.global.defaultHeight}px;
            z-index: 99999;
            `;
            
            ["div", "a", "span"].forEach(tag => _.deepExtend(this[tag+"Element"], payload[tag+"Extend"] || {}));
            aTag.appendChild(span);
            divTag.appendChild(aTag);
            this.parent = before;
            document.body.insertBefore(divTag, this.parent || document.body.firstChild);
        }
        o.global = o.global || {};
        _.deepExtend(o.global, defaults.global);
        let opts = o.events;
        //Rendering Elements of needsRender
        opts.forEach(e => {
            e.data && Object.assign(e.data, o.global.data);
            (e.needsRender || []).forEach(structure => 
                (new Function("e", "_", "o", `e.${structure} = _.render(e.${structure}, e.data, o.global.delim);`))(e, _, o))
        });
        //console.log(opts);
        let targets = opts.filter(d => (typeof(d.date) === 'function') ? d.date(dat) : _.sameDate(d.date, dat, d.match || o.global.match));
        this.targets = targets.length ? targets : opts.filter(d => d.date === "else");
        this.targets.forEach(e => this.createElement(e, e.element || o.global.element));
        this.destroy = function(){
            this.divElement && ((this.parent || document.body).removeChild(this.divElement));
        }
    }
    //Inspired by haskell
    let on = (f1, f2) => (a, b) => f2(f1(a), f1(b));
    let equalsOn = f => on(f, (a,b) => a===b);

    ADVB.of = function(opts){
        return new this(opts);
    }
    ADVB.utils = {
        forEach(o, f){
            for(let k in o) f(o[k],k,o);
        },
        reduce(o, f, b){
            this.forEach(o, (...args) => b = f(b, ...args));
            return b;
        },
        procedure: (...args) => args.reduce((a,b) => b(a)),
        applyTo: (a, ...args) => args.forEach(f => f(a)),
        sameDate: (a,b,m) => (a!=="never" && a!=="else") && (a==="always" || (m || ["Month", "Date"]).map(s => s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())).every(attr => equalsOn(x => x["get"+attr]&&x["get"+attr]())(new Date(a), b))),
        _render(str, obj, delim){// A naive template engine.
            //console.log("RENDER:",str, obj)
            delim = delim || ["{{", "}}"];
            return this.reduce(obj, (s, v, k) => s.replace(new RegExp(delim.join(`\\s*?${k}\\s*?`), "g"), v), str);
        },
        render(template, context, delim){// A not so naive template engine.
            const funcTemplate = expr => `with(data || {}) {return (${expr});}`;
            return template.replace(new RegExp((delim || ["{{", "}}"]).join("\\s*?(.*?)\\s*?"), "gm"), (_, expr) => (new Function("data", funcTemplate(expr)))(context));
        },
        extend(dst, src){
            this.forEach(src, (v, k) => dst[k] = dst[k] || v);
        },
        deepExtend(dst, src){
            src = src || {};
            this.forEach(src, (v, k) => {
                if(typeof(v) == "object"){
                    dst[k] = this.deepExtend(dst[k], v);
                }else{
                    dst[k] = dst[k] || v;
                }
            });
            return dst;
        }
    };
    ADVB.helper = (template, datas) => datas.map(d => Object.assign(JSON.parse(JSON.stringify(template)), {data: Object.assign({}, template.data || {}, d)}));
    HOST.AdovecNotify = ADVB;
})(window);