$(function () {
    if (localStorage.lightMode == "dark") {
        $('html').attr("light-mode", "dark").addClass('dark');
        setTimeout(function(){
            $('iframe').contents().find('html').attr("light-mode", "dark").addClass('dark');
        }, 100);
    }
    guide.init();
});
var tabSwiper = '';
var guide = {
    deviceSize: function () {
        var $rdo = $('.demo_size input');
        $rdo.on('change', function () {
            var $this = $(this),
                $device = $('iframe').contents().find('[data-class="device"]'),
                size = Number($this.next('label').text())+10;
            localStorage.deviceSize = size;
            (Number.isNaN(size)) ? $device.removeAttr('style') : $device.css('width', size);
        });
        if(localStorage.deviceSize == undefined) return false;
        $('.demo_size input').each(function(){
            var $this = $(this), size = Number($this.next('label').text())+10;
            if(localStorage.deviceSize == size) $this.prop('checked', true);
        });
    },
    switchSet: function (e) {
        var $util = $('body').attr('data-util');
        $('.switch li').each(function () {
            var $this = $(this);
            if($util.charAt(0).toUpperCase()+$util.slice(1) === $this.text()) $this.addClass('active');
        });
        $(window).resize(function(){
            var $active = (e !== undefined) ? e : $('.switch').find('li.active'),
                $li = $active.closest('ul').find('li'),
                $bar = $active.closest('.switch').find('.bar'),
                _w = $active.closest('ul').width(),
                _x = $active.closest('li').position().left;
            $bar.css({'width':_w/$li.length-2,'left':_x,'opacity':1,'transform':'scale(1)'});
            });
        $(window).resize();
    },
    switch: function () {
        if($('.switch').length){
            $('.switch>ul>li>a').on('mouseover focusin', function (e) {
                var $this = $(this);
                guide.switchSet($this);
            }).on('mouseout focusout', function (e){
				guide.switchSet();
			});
        }
    },
    projectDropdown: function() {
        var $project = $('body').attr('data-project'),
            $btnC = $('.g_project .current');
        $('.g_project .g_list li').each(function () {
            var $this = $(this);
            if($project.charAt(0).toUpperCase()+$project.slice(1) === $this.text()) {
                $this.addClass('active');
                $btnC.text($this.text());
            }
        });
        $btnC.on('click', function() {
            $(this).toggleClass('active').next('.g_list').slideToggle();
        });
        window.addEventListener('mouseup', function(e){
            var _a = e.target;
            if ($(_a).closest('.g_project').length === 0) {
                $btnC.removeClass('active').next('.g_list').slideUp();
            }
        });
    },
    slide: function () {
        var $tab = $('.g_list_tab');
        if ($tab.length) {
            tabSwiper = new Swiper('.g_list_tab', {
                slidesPerView: 'auto',
                freeMode: true
            });
            $('.g_list_tab .swiper-slide').on('click', function (e) {
                var $this = $(this);
                var gnbWidth = $tab.width();
                var offset = $this.width() + $this.offset().left + $this.width();
                var myIndex = $this.index();
                tabSwiper.slideTo(myIndex - 1);
                $this.closest('li').addClass('active').siblings('li').removeClass('active');
                if (localStorage.lightMode == "dark") {
                    $('html').attr("light-mode", "dark").addClass('dark');
                    setTimeout(function(){
                        $('iframe').contents().find('html').attr("light-mode", "dark").addClass('dark');
                    }, 100);
                }
            });
            $(window).on('load', function () {
                tabSwiper.update();
            });
        }
    },
    setBtn: function () {
        var $viewer = $('.viewer'), 
            $head = $('.head'), 
            $guideList = $('.guide_list'),
            $listTab = $('.g_list_tab');
        $head.append('<button type="button" class="btn_util"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="65px" height="50px" viewBox="0 0 65 65" xml:space="preserve"><path class="bar b1" d="M20,23.912h23.997c0,0,16.004-0.501,16.004,13.416 S46.75,47.912,41.834,42.995S22.668,23.412,22.668,23.412"/><path class="bar b2" d="M24.751,41.995H44c0,0,16.001,1.167,16.001-12.25 c0-13.417-9.508-15.157-18.004-6.745S22.001,42.995,22.001,42.995"/><line class="bar b3" x1="30.125" y1="32.999" x2="43.997" y2="32.999"/></svg><span class="offscreen">메뉴열기</span></span></button>');
        $guideList.append('<button type="button" class="nav_toggle"><span class="offscreen">메뉴토글</span><i></i></button>');
        $('.btn_util').on('click', function() {
            $('html').toggleClass('util_show');
        });
        $('.nav_toggle').on('click', function() {
            if($guideList.hasClass('change')){
                $guideList.removeClass('change');
                tabSwiper.enable();
                $guideList.removeAttr('style');
                $viewer.removeAttr('style');
            } else {
                tabSwiper.disable();
                $guideList.addClass('change');
                if($guideList.outerHeight() < $listTab.outerHeight()) {
                    $guideList.css('height',$listTab.outerHeight() + 8);
                    $viewer.css('padding-top', $head.outerHeight() + $listTab.outerHeight());
                }
            }
        });
        $('.g_list_tab>ul>li>a').on('click', function() {
            if($guideList.hasClass('change') && $(window).width() < 768) {
                $('.nav_toggle').click();
                tabSwiper.slideTo($(this).parent().index()-1);
            }
        });
        if (!$('.btm_btn_set').length) $('body').append('<div class="btm_btn_set"><button type="button" class="btn_guide_top"><span class="offscreen">TOP</span></button><button type="button" class="btn_light_mode"><i></i><i></i><i></i><i></i><span class="offscreen">다크모드</span></button></div>');
        var $btnLightMode = $('.btn_light_mode');
        $btnLightMode.off('click').on('click', toggle_light_mode);
        function toggle_light_mode(){
            var app = $('html');
            var iframeApp = $('iframe').contents().find('html');
            if (localStorage.lightMode == "dark") {
                localStorage.lightMode = "light";
                app.attr("light-mode", "light").removeClass('dark');
                iframeApp.attr("light-mode", "light").removeClass('dark');
            } else {
                localStorage.lightMode = "dark";
                app.attr("light-mode", "dark").addClass('dark');
                iframeApp.attr("light-mode", "dark").addClass('dark');
            }
        }
    },
    init: function () {
        guide.deviceSize();
        guide.switchSet();
        guide.switch();
        guide.projectDropdown();
        guide.slide();
        guide.setBtn();
    }
  };