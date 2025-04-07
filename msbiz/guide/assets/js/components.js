var preview = preview || (function() {
    var soureces = document.querySelectorAll('[type="text/html"]');
    (function init() {
        draw();
        copy();
        addEvent();
        deviceSize();
    })();

    function deviceSize() {
        if(localStorage.deviceSize == undefined) return false;
        var $device = $('[data-class="device"]');
        (localStorage.deviceSize == "100%") ? $device.removeAttr('style') : $device.css('width', localStorage.deviceSize);
    }

    function addEvent() {
        $(document).on('click', '[data-class*="fold"]', folding);
        $(document).on('click', '[data-class*="file"]', spriteFolding);
    }

    function folding(e) {
        var target = $(e.target).parent().parent();

        if (target.attr('data-class') == 'code') {
            target.attr('data-class','code active');
        } else {
            target.attr('data-class','code');
        }
    }

    function spriteFolding(e) {
        var target = $(e.target).parent();

        if (target.attr('data-class') == 'sprite') {
            target.attr('data-class','sprite active');
        } else {
            target.attr('data-class','sprite');
        }
    }

    function draw() {
        _.forEach(soureces, function(source) {
            var esc = _.escape(_.trim(source.textContent));
            var isLayout = $(source).attr('data-layout');
            var file = $(source).attr('data-sprite');
            var type = $(source).attr('data-type');
            var spriteImgWidth = $(source).attr('data-img-width') + 'px';
            var preview = $('<div data-class="preview"></div>');
            var demo = $('<div data-class="demo"><div data-class="device">' + source.textContent + '</div></div>');
            var code = $('<pre data-class="code"><div data-class="title"><button type="button" data-class="fold">CODE</a><button type="button" data-class="copy">COPY</button></div><code data-class="html">' + esc + '</code></pre>');
            
            if (isLayout) demo.addClass('layout');
            
            if (type != 'script') {
                preview.append(demo);
            }

            if (file) {
                var fileName = file.split('/').pop();
                var sprite = $('<div data-class="sprite"><button type="button" data-class="file">' + fileName + '</button><div data-class="image"><img src="' + file + '" style="max-width: ' + spriteImgWidth + '" alt=""></div></div>');
                
                preview.append(demo);
                preview.append(sprite);
            }

            preview.append(code);
    
            hljs.highlightBlock(code[0]);
            
            $(preview).insertAfter(source);
            $(source).remove();
        });
    }

    function copy() {
        var clipboard = new ClipboardJS('[data-class="copy"]');
        var codes = document.querySelectorAll('[data-class="html"]');
        var buttons = document.querySelectorAll('[data-class="copy"]');

        _.forEach(codes, function(code, i) {
            code.setAttribute('id', 'code' + i);
        });

        _.forEach(buttons, function(button, i) {
            button.setAttribute('data-clipboard-target', '#code' + i);
        });

        clipboard.on('success', function(e) {
            e.trigger.textContent = 'Copied!';

            setTimeout(function() {
                e.trigger.textContent = 'Copy';
            },2000);
        
            e.clearSelection();
        });
    }
})();

var Contents = (function() {
    (function init() {
        setTransition();
        btnSet();
    })();

    function setTransition() {
        setTimeout(function() {
            $('[data-class="contents"]').css('transition', 'padding .6s');
        }, 1000);
    }
    function btnSet() {
        var $btmBtnSet = $(parent.document).find('.btm_btn_set');
        var $btnTop = $(parent.document).find('.btn_guide_top');
        var $btnC = $(parent.document).find('.g_project .current');
        $btnTop.on('click', function () {
            $(window).scrollTop(0);
        });
        $(window).scroll(function () {
            ($(window).scrollTop() > 100) ? $btmBtnSet.addClass('active') : $btmBtnSet.removeClass('active');
        });
        window.addEventListener('mouseup', function(e){
            $btnC.removeClass('active').next('.g_list').slideUp();
        });
    }
})();

var Shortcut = (function() {
    var headings = $('[data-class="h1"], [data-class="h2"], [data-class="h3"]');

    (function init() {
        setTarget();
        setLink();
    })();

    function setTarget() {
        _.each(headings, function(heading, i) {
            var target = $(heading);

            target.attr('id', 'target' + i);
        });
    }

    function setLink() {
        var shortcuts = $('<div data-class="shortcut"></div>');

        _.each(headings ,function(heading, i) {
            var heading = $(heading);
            var type = heading.attr('data-class');
            var text = heading.text();
            var shortcut = $('<a href="#target' + i + '" id="tLink' + i + '" data-class="' + type + '-target"><span>'+ text +'</span></a>');
            shortcuts.append(shortcut);
        });
        shortcuts.wrapInner('<div class="inner"></div>');
        $('[data-class="component-name"]').after(shortcuts);
        shortcuts.find('a').on('click', function(){
            $(this).addClass('active').siblings('a').removeClass('active');
        });
    }
})();