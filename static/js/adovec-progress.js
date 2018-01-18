/**
 * Created by Adovec for Roselia-Blog on 2017/9/8.
 */
"use strict";
(function(HOST){
    function AdvBar(backColor, frontColor) {
        this.percent = 0;
        this.backColor = backColor;
        this.frontColor = frontColor;
        this.done = true;
        this.parent = null;
        this.createBar = function(elem){
            if(!this.done) return;
            this.done = false;
            elem && (this.parent = elem);
            let bar = document.createElement('div');
            //bar.classes = 'progress';
            //backColor = backColor || "#b388ff";
            //frontColor = frontColor || "#7c4dff";
            //bar.setAttribute('class', 'progress');
            //bar.style.backgroundColor = backColor;
            let progress = document.createElement('div');
            const CSS_TEMPLATE = '\
                position: fixed;\
                top: 0;\
                left: 0;\
                bottom: 0;\
                -webkit-transition: width .3s linear;\
                height: 4px;\
                transition: width .3s linear;__SEP__\
                position: relative;\
                height: 4px;\
                display: block;\
                width: 100%;\
                border-radius: 2px;\
                margin: 0.5rem 0 1rem 0;\
                overflow: hidden;\
                display: inline-block;\
                vertical-align: baseline;\
            '.split("__SEP__");
            //progress.classes = 'determinate';
            bar.style.cssText = CSS_TEMPLATE[1];
            progress.style.cssText = CSS_TEMPLATE[0];
            bar.style.margin = 0;
            elem || (bar.style.position = 'fixed');
            bar.style.transition = "opacity 500ms ease";
            bar.style.zIndex = 2;
            //progress.setAttribute('class', 'determinate');
            //progress.style.backgroundColor = frontColor;
            this.elem = progress;
            this.setProgress(0);
            this.bar = bar;
            this.setColor(this.backColor, this.frontColor);
            this.bar.appendChild(this.elem);
            elem?elem.insertBefore(this.bar, elem.firstChild):document.body.insertBefore(this.bar, document.body.firstChild);
            return this;
        };
        this.setColor = function (backColor, frontColor) {
            this.backColor = backColor || this.backColor || "#b388ff";
            this.frontColor = frontColor || this.frontColor || "#7c4dff";
            if(this.bar) this.bar.style.backgroundColor = this.backColor;
            if(this.elem) this.elem.style.backgroundColor = this.frontColor;
        };
        this.setProgress = function(percent){
            this.percent = percent;
            if(this.elem) this.elem.style.width = (percent || 0) + '%';
            return this;
        };
        this.addProgress = function(percent){
            return this.setProgress(this.percent += percent);
        };
        this.finish = function(){
            if(!this.bar || this.done) return;
            this.done = true;
            this.setProgress(100);
            //advBar.bar.style.opacity = 0;
            window.setTimeout(() => this.bar.style.opacity = 0, 500);
            window.setTimeout(() => this.parent?this.parent.removeChild(this.bar):document.body.removeChild(this.bar), 1000);

        };

        this.abort = function (back, front) {
            this.setColor(back||"#ff80ab", front||"#c51162");
            window.setTimeout(() => this.finish(), 500);

        };    

        if(window.jQuery){
            this.startAnimate = function () {
                if(!this.bar || this.done) this.createBar();
                this.done = false;
                jQuery(this).animate({percent: 80}, {
                    duration: 1500, step: function () {
                        let p = Math.floor(this.percent);
                        this.setProgress(p);
                    }, easing: "swing"
                }).animate({percent: 90}, {
                    duration: 3000, step: function () {
                        let p = Math.floor(this.percent);
                        this.setProgress(p);
                    }, easing: "swing"
                }).animate({percent: 97}, {
                    duration: 5000, step: function () {
                        let p = Math.floor(this.percent);
                        this.setProgress(p);
                    }, easing: "swing"
                });
                return this;
            };
            this.stopAnimate = function () {
                jQuery(this).stop(true, true);
                this.finish();
            };
        }
    }

    AdvBar.of = function(...args){
        return new this(...args);
    }

    HOST.AdovecProgress = AdvBar;
})(window);
