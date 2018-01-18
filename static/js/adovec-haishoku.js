//Import: RGBAster
;(function(window, undefined){

    "use strict";
  
    // Helper functions.
    var getContext = function(width, height){
      var canvas = document.createElement("canvas");
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);  
      return canvas.getContext('2d');
    };
  
    var getImageData = function(img, loaded){
  
      var imgObj = new Image();
      var imgSrc = img.src || img;
  
      // Can't set cross origin to be anonymous for data url's
      // https://github.com/mrdoob/three.js/issues/1305
      if ( imgSrc.substring(0,5) !== 'data:' )
        imgObj.crossOrigin = "Anonymous";
  
      imgObj.onload = function(){
        var context = getContext(imgObj.width, imgObj.height);
        context.drawImage(imgObj, 0, 0);
  
        var imageData = context.getImageData(0, 0, imgObj.width, imgObj.height);
        loaded && loaded(imageData.data);
      };
  
      imgObj.src = imgSrc;
  
    };
  
    var makeRGB = function(name){
      return ['rgb(', name, ')'].join('');
    };
  
    var mapPalette = function(palette){
      var arr = [];
      for (var prop in palette) { arr.push( frmtPobj(prop, palette[prop]) ) };
      arr.sort(function(a, b) { return (b.count - a.count) });
      return arr;
    };  
    
    var fitPalette = function(arr, fitSize) {
      if (arr.length > fitSize ) {
      return arr.slice(0,fitSize);
    } else {
      for (var i = arr.length-1 ; i < fitSize-1; i++) { arr.push( frmtPobj('0,0,0', 0) ) };
      return arr;
    };
    };
    
    var frmtPobj = function(a,b){
      return {name: makeRGB(a), count: b};
    }
  
  
    // RGBaster Object
    // ---------------
    //
    var PALETTESIZE = 10;
  
    var RGBaster = {};
  
    RGBaster.colors = function(img, opts){
  
      opts = opts || {};
      var exclude = opts.exclude || [ ], // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
          paletteSize = opts.paletteSize || PALETTESIZE;
  
      getImageData(img, function(data){
  
                var colorCounts   = {},
                    rgbString     = '',
                    rgb           = [],
                    colors        = {
                      dominant: { name: '', count: 0 },
                      palette:  []
                    };
  
                var i = 0;
                for (; i < data.length; i += 4) {
                  rgb[0] = data[i];
                  rgb[1] = data[i+1];
                  rgb[2] = data[i+2];
                  rgbString = rgb.join(",");
  
                  // skip undefined data and transparent pixels
                  if (rgb.indexOf(undefined) !== -1  || data[i + 3] === 0) {
                    continue;
                  }
  
                  // Ignore those colors in the exclude list.
                  if ( exclude.indexOf( makeRGB(rgbString) ) === -1 ) {
                    if ( rgbString in colorCounts ) {
                      colorCounts[rgbString] = colorCounts[rgbString] + 1;
                    }
                    else{
                      colorCounts[rgbString] = 1;
                    }
                  }
  
                }
  
                if ( opts.success ) {
                  var palette = fitPalette( mapPalette(colorCounts), paletteSize+1 );
                  opts.success({
                    dominant: palette[0].name,
                    secondary: palette[1].name,
                    palette:  palette.map(function(c){ return c.name; }).slice(1)
                  });
                }
      });
    };
    window.adovecHaishoku = window.adovecHaishoku || {
        forEach(o, f){
          for(let k in o) f(o[k],k,o);
        },
        extend: (function() {
          var isObjFunc = function(name) {
              var toString = Object.prototype.toString
              return function() {
                  return toString.call(arguments[0]) === '[object ' + name + ']'
              } 
          }
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
        deepExtend(...args){
          return this.extend(true, ...args);
        },
        splitRGB(color){
            return color.match(/\d+/g);
        },
        getYIQ(color){
            let rgb = this.splitRGB(color);
            return ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
        },
        getNormalizedTextColor(color, light, dark){
            return this.getYIQ(color) >= 128 ? dark : light;
        },
        apply(option){
            let def={
                image: null,
                changeText: false,
                textColors: {
                    light: "#fff",
                    dark: "#000"
                },
                exclude: ['rgb(0,0,0)'],
                target: "body", text: null
            };
            let opts = this.deepExtend({}, def, option);
            let img = opts.image;
            let self = this;
            let $ = document.querySelectorAll.bind(document);
            RGBaster.colors(img, {
                paletteSize: 20,
                exclude: opts.exclude,
                success(colors){
                    let dominant = self.splitRGB(colors.dominant)?colors.dominant:colors.palette.find(color => self.splitRGB(color))||'rgb(255,255,255)';
                    $(opts.target).forEach(e => {
                        e.style.transition = "background-color 1800ms ease";
                        e.style.backgroundColor = dominant;
                    });
                    if(opts.changeText){
                        $(opts.text || opts.target).forEach(e => {
                            e.style.transition = "color 1800ms ease";
                            e.style.color = self.getNormalizedTextColor(dominant, opts.textColors.light, opts.textColors.dark);
                        });
                    }
                }
            });
        }
    };
  
  })(window);
