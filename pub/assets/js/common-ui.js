/**
 * ���̴ٹ�ũ 2023
 * JS Loader : A Temp File
 */

if (!window.UICommon) {
    var UICommon = function () {
        let $focusableEl = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]';
        let $inputEl = 'input[type=text]:not([disabled]), input[type=tel]:not([disabled]), textarea:not([disabled])';
        let initCount = 0;
        let originalPotion = false;
        const pubOnly = location.href.indexOf('/_pub') > -1; // ���̵� ������������ ����Ǿ� �ϴ� ��� ���� ó���� ���

        let init = function () {
            uiReset();
            // �ܺο��� ��� �� �׽�Ʈ ��
            _front.init(); // form ���� ���ټ� set
            Layer.init(); // �˾�
            tabMenu.init(); // �Ǹ޴�
            inputRange.init(); // ��ǲ������

            // ȭ�� set
            accordionButton.init(); //���ڵ��
            toggleButton.init(); //���
            pressButton.init(); //���
            tooltipButton.init(); //����
            swipeButton.init(); // ����������ư(��ü�ϱ�)
            uiStep.init() // üũ�ڽ� ����
            uiFullpop.init(); // Ǯ�˾� Ȯ�ο�
            uiEffect.init(); //UI���ȿ��
            loading.init();
            prodIntroAni.init(); //��ǰ�ȳ� ���ͷ���
            transListAni.init(); //�ŷ�������ȸ ���ͷ���
            apng.init();

            if($('.focus-visual').length) uiAnimation.init(['.focus-visual', '.cascade']); //��ǰ�ȳ�
            if(!$('.all-menu').length) uiSwiper.init(); // ��������
            if(pubOnly) {
                if(initCount == 0) setTimeout(()=>window.scrollTo(0,0),100);

                // ū�۾���� (��ũ��Ʈ��)
                const url = new URL(location.href);
                const uiMode = url.searchParams.get('uiMode') ? url.searchParams.get('uiMode') : false;
                if(uiMode) {
                    $('html').attr('data-ui', uiMode)
                }
            }
            initCount++;
        }
 
        let $pgWrap = function() {
            // mod-date:1122:ȭ�鰳���ʿ��� ���� ������ $('.pg-wrap')�� �� ���� �������� �ִ� �������� ����
            return $('.pg-wrap').not('[aria-hidden=true]').last();
        }

        let uiReset = function () {
            Body.unlock();
            $('html').removeClass('keypad-open');
            if ($('.pg-wrap').length) $('.pg-wrap').removeAttr('aria-hidden');
            if ($('.pg-container').length) $('.pg-container').removeAttr('aria-hidden');
            originalPotion = false;
        }

        /* �������ߺ�Ȯ�� */
        let $targetPage = function () {
            // return $('.pt-page').length > 1 ? $($('.pt-page')[1]) : $('.pt-page');
            let $returnDoc = $(document);
            if (window.SPA) {
                $returnDoc = $('.pt-page').length > 1 ? $($('.pt-page')[1]) : $('.pt-page');
            }
            return $returnDoc;
        }

        //����� ����̽� üũ
        let uiMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i) == null ? false : true;
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
            },
            iPhone: function () {
                return navigator.userAgent.match(/iPhone/i) == null ? false : true;
            },
            iPad: function () {
                return navigator.userAgent.match(/iPad/i) == null ? false : true;
            },
            iPhoneVersion: function () {
                const $sliceStart = navigator.userAgent.indexOf('iPhone OS') + 10;
                const $sliceEnd = $sliceStart + 2;
                const $version = parseFloat(navigator.userAgent.slice($sliceStart, $sliceEnd));
                return $version;
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
            },
            tablet: function () {
                if (uiMobile.any()) {
                    if (window.screen.width < window.screen.height) {
                        return window.screen.width > 760 ? true : false;
                    } else {
                        return window.screen.height > 760 ? true : false;
                    }
                }
            },
            any: function () {
                return uiMobile.Android() || uiMobile.iOS() || uiMobile.BlackBerry() || uiMobile.Opera() || uiMobile.Windows();
            },
            check: function () {
                if (uiMobile.any()) {
                    $('html').addClass('mobile');
                    if (uiMobile.tablet()) $('html').addClass('tablet');
                }
                if (uiMobile.iOS()) $('html').addClass('ios');
                if (uiMobile.Android()) $('html').addClass('android');
                //if(uiMobile.iPhoneVersion() >= 12)$('html').addClass('ios12');
            }
        };

        //����̽�üũ ����
        let uiDevice = {
            iPhone8PlusH: 736,
            screenH: window.screen.height,
            screenW: window.screen.width,
            isIPhoneX: function () {
                $('html').addClass('iPhone-X');
            },
            notIPhoneX: function () {
                $('html').removeClass('iPhone-X');
            },
            check: function () {
                uiMobile.check();
                uiPC.check();
                if (uiMobile.any()) {
                    const $pixelRatio = Math.round(window.devicePixelRatio);
                    if (!!$pixelRatio) $('html').addClass('pixel-ratio-' + $pixelRatio);
                }
                const $isIPhoneX = uiMobile.iPhone() && uiDevice.screenH > uiDevice.iPhone8PlusH ? true : false;
                if ($isIPhoneX) {
                    //ù�ε�
                    if ($(window).width() < $(window).height()) {
                        uiDevice.isIPhoneX();
                    } else {
                        uiDevice.notIPhoneX();
                    }
                }
            },
            hide: function () {
                if ($('[data-device-hide]').length) {
                    $('[data-device-hide]').each(function () {
                        const $device = $(this).data('device-hide');
                        if (uiMobile.any()) {
                            //�����
                            if ($device == 'ios' && uiMobile.iOS()) {
                                $(this).hide();
                            } else if ($device == 'android' && uiMobile.Android()) {
                                $(this).hide();
                            }
                        } else {
                            //PC
                            if ($device == 'ios' && $('html').hasClass('safari')) {
                                $(this).hide();
                            } else if ($device == 'android' && !$('html').hasClass('safari')) {
                                $(this).hide();
                            }
                        }
                    });
                }
            }
        };

        // ��ũ�ѹ� �̵��ӵ� ���� ���� SPA ::: ����
        // ȣ��� durationScrollTo(������ġ, �ð�)
        const durationScrollTo = (y, duration = 1000) => {
            const stepY = (y - window.scrollY) / duration;
            const currentY = window.scrollY;
            const startTime = new Date().getTime();
            const scrollerInterval = setInterval(() => {
                const now = new Date().getTime() - startTime;
                window.scrollTo({ top: currentY + (stepY * now) });
                if (duration <= now) {
                    clearInterval(scrollerInterval);
                }
            }, 1);
        }

        /* ���ڵ�� */
        let accordionButton = {
            init: function () {
                accordionButton.accordion();
                // accordionButton.set();
            },

            set: function () {
                $('[data-ui=accordion]').each(function () {
                    let $accoItem = $(this).find('.acco-item'),
                        $li = $accoItem.parents('li'),
                        $accoBtn = $li.find('.acco-btn');

                    $(this).find('[role=button]').attr('tabindex', 0); //[���ټ�] 0705�߰�

                    $accoItem.next('div').wrap('<div class="acco-panel-wrap"></div>')
                    if ($li.hasClass('on')) {
                        $li.children('button, [role=button]').attr('aria-expanded', true);
                        $li.parents('li').addClass('on').children('button, [role=button]').attr('aria-expanded', true);
                        $li.filter('.on').find('.acco-panel-wrap').show();
                    }
                });
            },
            accordion: function () {
                accordionButton.set();
                let $trigger = '[data-ui=accordion] li > .acco-item, [data-ui=accordion] .acco-btn';

                $(document).off('click', $trigger).on('click', $trigger, function(e) {
                    e.preventDefault();
                    e.stopPropagation(); // button event stop
                    let $this = $(this),
                        $li = $this.parents('li'),
                        $ul = $li.parents('ul'),
                        spd = 0;

                    // this
                    $this.attr('aria-expanded', !$li.hasClass('on'));
                    if($li.hasClass('on')) {
                        $li.find('.acco-panel-wrap, .acco-panel').slideUp(spd, ()=>$li.removeClass('on'));
                    }else {
                        $li.addClass('on')
                        $li.find('.acco-panel-wrap, .acco-panel').slideDown(spd);
                    }

                    // others (1005: ��ǰ�ȳ� ����)
                    if (!$ul.hasClass('each-open') && !($ul.hasClass('prod') && $ul.parents('.pg-wrap').hasClass('prod-intro'))) {
                        $li.siblings('li').find('.acco-panel-wrap, .acco-panel').slideUp(spd, ()=>$li.siblings('li').removeClass('on'));
                        $li.siblings('li').find('button').attr('aria-expanded', false);
                    }
                    setTimeout(function(){UICommon.scTop.topMove($this);}, 0); //��ũ��top
                });
            },
        }

        /* ��� */
        let toggleButton = {
            init: function () {
                toggleButton.toggle();
            },
            toggle  : function () {
                $(document).off('click', '[data-ui=toggle]').on('click', '[data-ui=toggle]', function(e) {
                    e.preventDefault();
                    let _this = $(this);

                    if (_this.hasClass('switch')) { // accordion
                        if (_this.hasClass('on')) {
                            _this.attr('aria-expanded', 'false').removeClass('on').parent('li').siblings('li').children('[data-ui=toggle]').removeClass('on').attr('aria-expanded', 'false');
                        } else {
                            _this.attr('aria-expanded', 'true').addClass('on').parent('li').siblings('li').children('[data-ui=toggle]').removeClass('on').attr('aria-expanded', 'false');
                        }
                    } else if (_this.attr('aria-controls') !== undefined) {
                        let $panel = $('#' + _this.attr('aria-controls'));
                        if (_this.hasClass('on')) {
                            _this.attr('aria-expanded', 'false');
                            _this.removeClass('on');
                            $panel.slideUp();
                        } else {
                            _this.attr('aria-expanded', 'true');
                            _this.addClass('on');
                            $panel.slideDown();
                        }
                    } else { // default   
                        let _st = $(window).scrollTop();
                        let _gap = 400;
                        _this.parents('[data-ui=toggle]').toggleClass('on');

                        if (_this.hasClass('on')) {
                            _this.attr('aria-expanded', 'false').removeClass("on").next('.toggle-panel').slideUp(300);
                            let _st = $(window).scrollTop() - _gap;
                        } else {
                            // slideDown�� durationScrollTo ȣ��
                            _this.attr('aria-expanded', 'true').addClass("on").next('.toggle-panel').slideDown(300, () => {
                                if (_this.parents('.inform-btm-wrap').length > 0) {
                                    durationScrollTo(_this.parents('.inform-btm-wrap')[0].offsetTop - 32, 300)
                                }
                            });
                        }
                    }
                    if (_this.hasClass('hidden-btn')) _this.parent('.btns').hide();
                    if (_this.closest('.ui-swiper').length) setTimeout(function () { UICommon.uiSwiper.update(_this.closest('.ui-swiper')) }, 100);
                    if (_this.closest('.tab-swipe').length) setTimeout(function () { UICommon.tabMenu.tabSlider.update() }, 100);
                });
            },
        }

        /* Press Button */
        let pressButton = {
            init: function() {
                pressButton.press();
            },
            press: function() {
                $(document)
                .off('click.pressButton')
                .on('click.pressButton', '[data-ui=press]', function(e) {
                    e.preventDefault();
                    $this = $(this);
                    $this.toggleClass('on').attr('aria-pressed', $this.hasClass('on')).siblings('.sync').removeClass('on').attr('aria-pressed','false');
                    if($this.hasClass('on') && $this.attr('data-value')) {
                        $this.css({'background-color': '#'+$this.attr('data-value')});
                    }else {
                        $this.css({'background-color': ''});
                    }
                    
                })
                .on('click.pressButton', '[data-ui=scroll-able] button', function(e) {
                    e.preventDefault();
                    $this = $(this);
                    $this.parents('[data-ui=scroll-able]').find("button").removeAttr("class").removeAttr("title");
                    $this.addClass("active").attr("title", "���õ�");
                });
            }
        }

        /* Input Range */
        let inputRange = {
            events: [],
            init: function() {
                let rangeInputs = document.querySelectorAll('input[type="range"]:not(.range-pass)');
                let outputInputs = document.querySelectorAll(".rangevalue"); // 0605 [���ټ�]
                
                for(i in inputRange.events) {
                    let event = inputRange.events[i];
                    event.node.removeEventListener('input', event.handler)
                    event.node.removeEventListener('change', event.handler)
                }
                if (rangeInputs.length) {
                    for (var i=0; i<rangeInputs.length; i++){
                        let tar = rangeInputs[i];
                        $(tar).attr('dat-test', initCount)
                        // s : 0605 [���ټ�]
                        // mod-date:1129: aria-hidden���ŷ� ��ũ��Ʈ ����
                        // let unit = outputInputs[i].closest('[aria-hidden=true]').querySelector('.num-unit') ? outputInputs[i].closest('[aria-hidden=true]').querySelector('.num-unit').innerText:'';
                        let unit = $(outputInputs[i]).siblings('.num-unit') ? $(outputInputs[i]).siblings('.num-unit').text():'';
                        document.querySelectorAll(".rangevalue")[i].innerText = addComma(tar.value);
                        tar.ariaValueText = unit.indexOf('��') > -1 ? addComma(tar.value) + unit:tar.value + unit;
                        // e : 0605 [���ټ�]
                        tar.style.backgroundSize = (tar.value - tar.min) * 100 / (tar.max - tar.min) + '% 100%';
                        if(initCount == 0) {
                        }
                        inputRange.action(rangeInputs, outputInputs)
                    }
                }
            }, 
            action: function(eleInpt, outputInputs){
                function handleInputChange(e) {
                    var target = e.target
                    if (e.target.type !== 'range') {
                        target = document.getElementById('range');
                    } 
                    let min = target.min,
                    max = target.max,
                    val = target.value;
                    let idx = [...document.querySelectorAll('input[type="range"]')].indexOf(target)
                    
                    // mod-date:1129: aria-hidden���ŷ� ��ũ��Ʈ ����
                    // let unit = outputInputs[idx].closest('[aria-hidden=true]').querySelector('.num-unit') ? outputInputs[idx].closest('[aria-hidden=true]').querySelector('.num-unit').innerText:'';
                    let unit = $(outputInputs[idx]).siblings('.num-unit') ? $(outputInputs[idx]).siblings('.num-unit').text():'';
                    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';

                    // let rateValueCheck = target.dataset.rateValue ? true: false; //mod-date:0830: ���������ݿ�
                    // let rateValue = rateValueCheck ? eval(target.dataset.rateValue+`(${val})`):''; //mod-date:0830: ���������ݿ�
                    // s : 0605 [���ټ�]
                    target.dataset.event = e;
                    target.ariaValueText = (unit.indexOf('��') > -1 ? addComma(val) + unit:val + unit);// + (rateValueCheck ? ' ' + rateValue : ''); //mod-date:0830: ���������ݿ�
                    outputInputs[idx].value = unit.indexOf('��') > -1 ? addComma(val):val;
                    // if(rateValueCheck) target.parentNode.querySelector('.rate-value').innerHTML = rateValue; //mod-date:0830: ���������ݿ�
                    // e : 0605 [���ټ�]
                }
                eleInpt.forEach(input => {
                    inputRange.events.push({node: input, handler: handleInputChange})
                    input.addEventListener('input', handleInputChange);
                    input.addEventListener('change', handleInputChange);// 0605: ios voiceover [���ټ�]
                });
                
            }            
        }

        /* swipe Button */
        let swipeButton = {
            init: function($target, x, isScrolling) {
                if(!$('[data-ui=swipeButton]').length || (event && event.target.nodeName == 'BUTTON')) return false;
                if($target) {   
                    $('html').removeClass('isSwiping')
                    if(isScrolling) {
                        $('[data-ui=swipeButton] .swipeButton-wrap').removeClass('isSwiping').css('transform', `translateX(${0}px)`)
                    }else {
                        $target.removeClass('isSwiping').css('transform', `translateX(${x*-1}px)`)
                    }
                }else {
                    // swipeButton.aria();
                    swipeButton.event();
                }
            },
            swipe: function($target, x) {
                $('html').addClass('isSwiping');
                if(uiMobile.iPhoneVersion() > 12 ) $target.addClass('isSwiping')
                $target.css('transform', `translateX(${x*-1}px)`)
            },
            event: function() {
                let ratio = $('[data-ui=swipeButton]').css('--button-width').indexOf('rem') > -1 ? 10:1;
                let sx = 0, x = 0, sy = y = 0, w = $('[data-ui=swipeButton]').css('--button-width') ? Number($('[data-ui=swipeButton]').css('--button-width').replace(/rem|px/g, '')*ratio):77;
                $(document)
                .off('.swipeButton')
                .on('touchstart.swipeButton', '[data-ui=swipeButton]', function(e) {
                    if(e.touches == undefined || swipeButton.isSwiping) return false;
                    let $target = $(e.target).closest('.swipeButton-wrap');
                    if(sx == 0) sx = e.touches[0].clientX;
                    if(sy == 0) sy = e.touches[0].clientY;
                    swipeButton.init($target, x, true)
                    $(this)
                    .off('touchmove touchend')
                    .on('touchmove', function(e) {
                        if(e.touches == undefined) return false;
                        let $target = $(e.target).closest('.swipeButton-wrap');
                        x = sx - e.touches[0].clientX;
                        y = sy - e.touches[0].clientY;
                        if(Math.abs(x) > Math.abs(y)) {
                            swipeButton.isSwiping = true;
                            if(x < 0) x = 0;
                            if(x > w) x = w;
                            swipeButton.swipe($target, x)
                            if(e.cancelable) e.preventDefault();
                        }
                    })
                    .on('touchend', function(e) {
                        if(e.touches == undefined) return false;
                        let $target = $(e.target).closest('.swipeButton-wrap');
                        x = (x > 20) ? w : 0;
                        // $target.find('.main').text('y '+ Math.floor(y)+ ' / x ' + Math.floor(x)+' / '+st)
                        if(swipeButton.isSwiping) swipeButton.init($target, x, false)
                        sx = sy = x = y = 0;
                        swipeButton.isSwiping = false;
                    })
                })
            },
            set: function(hasBtn) {
                // ���ټ�
                $('[data-ui=swipeButton]').find('.his-item[role=button]').each(function(i) {
                    let $this = $(this).is('li') ? $(this).find('> div').eq(0): $(this);
                    let name = $this.find('.name').text();
                    let type = hasBtn ? '' : $this.find('.main').hasClass('fc-point')? '��ü�ϱ�':'��������';
                    let money = $this.find('.main').text();
                    let cls = $this.find('.main').hasClass('fc-point')? 'primary':'point';
                    let temp = hasBtn ? '' : `
                    <div class="btns swipe-btns">
                    <button type="button" class="btn ${cls}" aria-label="${name} ${money} ${type}">${type}</button>
                    </div>`;
                    let wrap = `<div class="swipeButton-wrap"></div>`;
                    $this.attr({'aria-label': `${$this.text()} ��Ŀ�� �̵��Ͻø� ${type} ��ư�� �ֽ��ϴ�`, 'tabindex': -1});
                    if(!hasBtn && !$this.siblings('.swipe-btns').length) $this.after(temp);
                    if(!$this.parents('.swipeButton-wrap').length) $this.parent().wrapInner(wrap);
                })
            }
        }

        /* �ܸ޴� */
        let tabMenu = {
            init: function () {
                tabMenu.tabMove();
                tabMenu.tab();
               // tabMenu.tabSwipe();
               // tabMenu.tabRadio();
                tabMenu.tabBar();
                tabMenu.tabResize(); //0803 resize
            },
            tab: function () {
                $('.tab-wrap .tab-list a.active').attr('title', '���õ�');
                $('.tab-wrap .tab-list').find('button.active').attr('title', '���õ�'); // mod-date:1017:[���ټ�]
                $(document).on('click', '.tab-wrap [role=tab]', function (e) {
                    e.preventDefault();
                    let _this = $(this),
                        _tabWrap = _this.closest('.tab-wrap'),
                        _thisPannel = _tabWrap.children('.tab-panel');
                    if (_tabWrap.find('.ly-cnt').length) _thisPannel = _tabWrap.children('.ly-cnt').children('.tab-panel');
                    if (_tabWrap.find('.tab-scroller').length) {
                        _thisPannel = _tabWrap.children('.tab-scroller').children('.tab-panel');
                        // _tabWrap.find('.tab-scroller').stop().scrollTop(0);
                    }
                    let _thisControls = _thisPannel.filter('#' + _this.attr('aria-controls'));

                    _this.attr('aria-selected', 'true').attr('title', '���õ�').siblings('[role=tab]').attr('aria-selected', 'false').removeAttr('title'); // mod-date:1017:[���ټ�]

                    if (_thisPannel.length) {
                        _thisControls.addClass('active').siblings('.tab-panel').removeClass('active');
                        if (_thisControls.find('.ui-swiper').length) uiSwiper.update(_thisControls.find('.ui-swiper'));
                    };
                    if (_this.closest('.pop-body').length) {
                        _this.closest('.pop-body').stop().scrollTop(0);
                    }
                    const pageFlag = $('.pg-wrap').is('.bg-fixed-gr01');  // ��ǰ : ����
                    _this.addClass('active').siblings('button').removeClass('active'); // @0615
                    tabMenu.tabScroll(_this);
                    tabMenu.tabBar(pageFlag ? 300 : 0);
                });
                // $(document).on('click', '.tab-list button', function (e) { // Ŭ�� �̺�Ʈ �ߺ� ���� �̵� @0615
                //     let _this = $(this);
                //     _this.addClass('active').siblings('button').removeClass('active');
                //     tabMenu.tabScroll(_this);
                //    //_front.contentsReH();
                // });
            },
            tabResize: function() {
                $(window).off('resize.tabMenuEvent').on('resize.tabMenuEvent', function() {
                    tabMenu.tabBar();
                });
            },
            tabMove: function (el) {//popup
                if (el === undefined) {
                    $('.tab-list').each(function () {
                        $this = $(this);
                        ($this.find('[aria-selected=true]').length) ? el = $this.find('[aria-selected=true]') : el = $this.find('button.active');
                        let $tabWrap = el.closest('.tab-wrap'),
                            $lyCnt = $tabWrap.children('.ly-cnt'),
                            $tabScroller = $tabWrap.children('.tab-scroller'),
                            $thisPannel = $tabWrap.children('.tab-panel'),
                            index = el.index();
                       // if ($this.find('.tab-bar').length) index = index - 1;

                        if ($lyCnt.length) $thisPannel = $lyCnt.children('.tab-panel');
                        if ($tabScroller.length) $thisPannel = $tabScroller.children('.tab-panel');
                        $thisPannel.eq(index).addClass('active');
                        // if ($this.find(".tab-list-sub")) {
                        //     $(".tab-list-sub").find("button[aria-selected=true]").trigger("click");
                        // }
                        tabMenu.tabScroll(el);
                    });
                    return false;
                }
            },
            tabScroll: function (el) {
                if(el.closest('.tab-wrap').hasClass('fit')) return;
                let $parent = el.closest('.tab-wrap').find('.tab-list'),
                    $parentWidth = $parent.outerWidth(),
                    $parentScrollW = $parent.get(0).scrollWidth,
                    sb = Number(el.css('margin-left').replace('px', '')),
                    $thisLeft = el.position().left + sb,
                    $thisWidth = el.outerWidth() + sb,
                    $scrollLeft = $thisLeft - ($parentWidth / 2) + ($thisWidth / 2),
                    $speed = Math.max(300, Math.abs($scrollLeft * 2)),
                    $line = $parent.find('.tab-bar');
                if ($parentWidth < $parentScrollW) $parent.stop().animate({ scrollLeft: $scrollLeft }, 300); //$speed
            },
            tabBar: function (delay = 0) {
                $('.tab-wrap').each(function () {
                    let $this = $(this),
                        $bar = $this.find('.tab-bar'),
                        timer; // debounce
                    if ($bar.length) {
                        clearTimeout(timer);
                        let $btn = $this.find('[role=tab]'),
                            $tabWrap = $this.closest('.tab-wrap'),
                            $active = $tabWrap.find('[aria-selected=true]'),
                            $list = $btn.parent();

                       // ($tabWrap.hasClass('box')) ? $tabWrap.addClass('') : $tabWrap.addClass('line'); 0531 test��
                        timer = setTimeout(function () {
                            let $tabWidth = $active.outerWidth(),
                                $listLeft = parseInt($list.css('margin-left')),
                                sb = Number($active.css('margin-left').replace('px', '')),
                                $tabLeft = $listLeft + $active.position().left + $btn.position().left + sb;

                            //$bar.css({ 'width': $tabWidth, 'left': $tabWrap.is('.line:not(.fixed)') ? $tabLeft + 24 : $tabLeft});
                           // $bar.css({ 'width': $tabWidth, 'left': $tabWrap.is('.fit, .box') ? $tabLeft : $tabLeft});
                            $bar.css({ 'width': $tabWidth, 'left': $tabLeft});
                        }, delay);
                    }
                });
            },

            tabSwipeArray: [],
            tabSlider: null,
            tabSwipe: function () {
                if ($('.tab-swipe').length) {
                    $('.tab-swipe').each(function () {
                        let $this = $(this),
                            $btn = $this.closest('.tab-wrap').find('.tab-list').find('button'),
                            $active = $this.closest('.tab-wrap').find('.tab-list').find('[aria-selected=true]'),
                            $panel = $this.find('.tab-panel'),
                            _tabFix = 0,
                            _headH = ($('#header').length>0) ? $('#header').outerHeight() : 0,
                            isFixed = false;
                        $(window).on('scroll', function () {
                            if($this.closest('.tab-wrap').find('.tab-list-wrap.fixed').length) {
                                isFixed = true;
                                _tabFix = $this.closest('.tab-wrap').offset().top - _headH;
                            } else {
                                isFixed = false;
                                _tabFix = 0;
                            }
                        });
                        if (!$this.find('swiper-wrapper').length) {
                            $this.wrapInner('<div class="swiper-wrapper"></div>');
                            $panel.addClass('swiper-slide').attr('aria-hidden', true);
                        }
                        let opt = {
                            slidesPerView: 1,
                            speed: 300,
                            autoHeight: true,
                            touchRatio: 0.1,
                            resistance: true,
                            resistanceRatio: 0.5,
                            initialScroll: 0,
                            on: {
                                slideChangeTransitionEnd: function (e) {
                                    // [S] main tab �������� ���� callback �߰�
                                    this.$el.find('.swiper-slide').each(function () {
                                        let _this = $(this);
                                        if (_this.closest('.m-service-tab').length && _this.is('.swiper-slide-active')) {
                                            if (window.SPA_COMMON) {
                                                window.SPA_COMMON.callbackWithSPA('onMainSubSwiperChange', _this);
                                                window.SPA_COMMON.callbackWithSPA('onMainSub2SwiperChange', _this);
                                            }
                                        }
                                    });
                                    // [E] main tab �������� ���� callback �߰�
                                }
                            }
                        };
                        if ($this.hasClass('swiper-initialized')) {
                            if (tabMenu.tabSlider !== undefined) tabMenu.tabSlider.update();
                        } else {
                            tabMenu.tabSlider = new Swiper(this, opt);
                        }
                        let current = $active.index();
                        tabMenu.tabSlider.slideTo(current);
                        $panel.eq(current).attr('aria-hidden', false);
                        $btn.on('click', function () {
                            let $this = $(this), tabIndex = $this.index();
                            tabMenu.tabSlider.slideTo(tabIndex);
                            $panel.eq(tabIndex).attr('aria-hidden', false).siblings('.tab-panel').attr('aria-hidden', true);
                            if(isFixed) $('html, body').animate({scrollTop:_tabFix}, 300);
                        });
                        tabMenu.tabSlider.on('slideChangeTransitionStart', function () {

                            let tabIndex = $this.find('.tab-panel.swiper-slide.swiper-slide-active').index(),
                                //thisSlide = $this.find('.tab-panel.swiper-slide.swiper-slide-active'),
                                $tabActive = $btn.eq(tabIndex);
                            $tabActive.attr('aria-selected', 'true').siblings('[role="tab"]').attr('aria-selected', 'false');
                            $panel.eq(tabIndex).attr('aria-hidden', false).siblings('.tab-panel').attr('aria-hidden', true);
                            tabMenu.tabScroll($tabActive);
                            tabMenu.tabBar();
                            if(isFixed) $('html, body').animate({scrollTop:_tabFix}, 300);
                            aniAdd('.m-ani');
                            if($this.find('.chart').length) UICommon._front.chartClear('.chart .bar.in'); //��Ʈ �ִϸ��̼� ����
                            // console.log(thisSlide);
                            // if (window.SPA_COMMON) {
                            //     console.log(thisSlide);
                            //     window.SPA_COMMON.callbackWithSPA('onSwiperChange', thisSlide);
                                
                            // }
                        });
                        tabMenu.tabSlider.on('slideChangeTransitionEnd', function () {
                            if($this.find('.chart').length) UICommon._front.chart('.chart .bar.in'); //��Ʈ �ִϸ��̼� ����
                        });

                        let aniAdd = function(tar){
                            if($this.find(tar).length) $this.find(tar).removeClass('on').addClass('on');
                        };
                        aniAdd('.m-ani');

                        tabMenu.tabSwipeArray.push(tabMenu.tabSlider);
                        $this.on('touchstart', function (e) {
                            if (!$(e.target).parents("[data-bubble='false']").length) {
                                tabMenu.tabSlider.allowTouchMove = true;
                            }
                        });
                    });
                }
            },
            tabRadio: function () {
                $('.tab-radio').each(function () {
                    let $tabRadio = $(this),
                        $rdo = $tabRadio.find('input'),
                        $current = $tabRadio.find('input:checked'),
                        $tar = $tabRadio.attr('data-show'),
                        $panel = $tabRadio.closest('.tab-wrap').find('.tab-panel');
                    $panel.eq($current.parent().index()).addClass('active');
                    $rdo.on('change', function () {
                        let $this = $(this), tabIndex = $this.parent().index();
                        $panel.eq(tabIndex).addClass('active').siblings('.tab-panel').removeClass('active');
                    });
                });
            }
        }
        
        /* ���� */
        let tooltipButton = {
            init: function () {
                $(document).off('click', '[data-ui=tooltip]').on('click', '[data-ui=tooltip]', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this = $(this);
                    let _winW = $('body').width(),
                        _tooltipWrap = _this.parents('.tooltips').find('.tooltip-wrap'),
                        _tooltipWrapL = _this.offset().left - 24,
                        _tooltipWrapR = _winW - (_this.offset().left + 44);

                    $('[data-ui=tooltip]').removeClass('on');

                    if ($(e.target).closest('.tooltips').length === 0) {
                        _tooltipWrap.removeClass('show');
                        setTimeout(function () {
                            _tooltipWrap.hide().removeClass('top').attr('aria-hidden', 'true').closest('.tooltips').parent().css('z-index', '').parent().css('z-index', '');
                        }, 300);
                    }

                    if (_tooltipWrap.css('display') == 'block') {
                        _tooltipWrap.removeClass('show');
                        setTimeout(function () {
                            _tooltipWrap.hide().removeClass('top').attr('aria-hidden', 'true').closest('.tooltips').parent().css('z-index', '').parent().css('z-index', '');
                        }, 300);
                    } else {
                        $('.tooltip-wrap').hide().removeClass('top').attr('aria-hidden', 'true').closest('.tooltips').parent().css('z-index', '').parent().css('z-index', '');
                        tooltipButton.position(_this, _tooltipWrap);
                        _this.addClass('on').closest('.tooltips').parent().css('z-index', '101').parent().css('z-index', '101');
                        _tooltipWrap.show().attr('aria-hidden', 'false');
                        _tooltipWrap.parents('.acc-pannel').parents('div').hasClass('section-f') ? _tooltipWrap.css({ 'left': -_tooltipWrapL - 8, 'right': -_tooltipWrapR - 8 }) : _tooltipWrap.css({ 'left': -_tooltipWrapL, 'right': -_tooltipWrapR });
                        setTimeout(function () {
                            _tooltipWrap.addClass('show');
                        }, 100);
                    }

                    let close = function () {
                        _tooltipWrap.removeClass('show');
                        setTimeout(function () {
                            _tooltipWrap.hide().removeClass('top').attr('aria-hidden', 'true').closest('.tooltips').parent().css('z-index', '').parent().css('z-index', '');
                        }, 300);
                        setTimeout(function () { 
                            _this.focus().removeClass('on'); 
                        }, 100);
                    };

                    $('.btn-tooltip-x').off('click').on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        close();
                    });
                });
            },
            position: function (t, e) {
                $(window).scroll(function () {
                    let deviceH = t.parents('.pop-body').length?t.parents('.pop-body').height():screen.height,
                        offsetT = t.offset().top,
                        scrollT = t.parents('.pop-body').length?t.parents('.pop-body').offset().top:$(document).scrollTop(),
                        tipWrapT = offsetT - scrollT,
                        tipWrapD = deviceH - (offsetT - scrollT);
                        console.log(deviceH , offsetT, scrollT, tipWrapT, tipWrapD);
                    (tipWrapT > tipWrapD) ? e.addClass('top') : e.removeClass('top');
                });
                $(window).scroll();
            }
        }

        let _front = {
            init: function () {
                _front.form();
                _front.slider();
                _front.event();
            },
            step: function () {
                let _step = $targetPage().find("[data-ui=step]");
                let _stepH = parseInt(_step.outerHeight());
                let _hdH = $targetPage().find("#header").outerHeight() == undefined ? 0 : parseInt($targetPage().find("#header").outerHeight());
                let _aniVal = _stepH + _hdH + 20;

                $(window).on('scroll.formEvent', function () {
                    let _st = $(this).scrollTop();
                    if (_st > _aniVal) {
                        if (!$('[data-ui=step]').hasClass('on')) _step.clone().prependTo('.pg-container').addClass("on");
                    } else {
                        $('[data-ui=step].on').remove();
                    }
                });
            },
            scroll: function () {
                let _isStep = ($targetPage().find("[data-ui=step]").length > 0) ? true : false;
                if (_isStep) _front.step();
                $(window).off('scroll.formEvent').on('scroll.formEvent', function () {
                    let _st = $(this).scrollTop();
                    let _headerH = $('.pg-header').height();
                    let $curentPgWrap = $pgWrap();

                    if ($curentPgWrap.find('.sticky').length) {
                        $('.sticky').parents('.tab-panel').length ? _headerH = $('.pg-header').height() - $('.tab-list').height() : _headerH = $('.pg-header').height();
                    }

                    //$(".pg-gnb").addClass('fixed on');
                   // (_st > _headerH && !($('.pg-wrap').find('.sticky'))) ? $(".pg-gnb").addClass('fixed') : $(".pg-gnb").removeClass('fixed');  //Header Fixed  
                    
                    if (_st > _headerH) {
                        $curentPgWrap.find('.sticky').length > 0 ? $('.pg-gnb').addClass('fixed noline') : $('.pg-gnb').addClass('fixed');
                        $(".bg-check").length ? $(".lists-headnote").addClass("bg-col") : $(".lists-headnote").removeClass("bg-col"); //��ũ�� �ɶ� bg ����
                    } else {
                        $(".pg-gnb").removeClass('fixed noline');
                    }


                    if ($(".card-focus.solid").length) {
                        let cardFocus = $(".card-focus.solid");
                        let cardFocusTop = cardFocus.offset().top + cardFocus.height();
                        if (cardFocusTop <= _st) {
                            $(".card-focus.flat").css("display", "flex")
                        } else {
                            $(".card-focus.flat").css("display", "none")
                        }
                    }
                    // mod-date:0926 ��ƼŰ ����
                    if ($curentPgWrap.find('.sticky-area.nofix').length) {
                        let sticky = $(".sticky-area.nofix");
                        let stickyTop = sticky.offset().top + sticky.height() - _headerH + 5;

                       $(".sticky-area.sticky").css("display", stickyTop <= _st ? 'block' : 'none');
                       
                    }

                });
            },
            slider: function () {
                if ($('.slider-select').length) {
                    $('.slider-select').each(function () {
                        let $slider = $(this).find('.slider'),
                            $list = $(this).find('.range'),
                            $inp = $(this).find('input[type=hidden]'),
                            $unit = $list.data('unit'),
                            $title = $list.attr('title'),
                            $min = parseInt($slider.data('min')),
                            $max = parseInt($slider.data('max')),
                            $val = parseInt($slider.data('value')),
                            $step = parseInt($slider.data('step')),
                            $d = parseInt($slider.data('drainage')),
                            $sync = $slider.data('sync');

                        if (!$min) $min = 0;
                        if (!$max) $max = 5;
                        if (!$step) $step = 1;
                        if (!$val) $val = $min;

                        if ($list.length) {
                            $list.empty();
                            if (!!$title) $list.removeAttr('title').append('<strong class="hidden">' + $title + '</strong>');
                            let _total = ($max - $min) / $step;
                            let _stepLeft = 100 / _total;
                            let _w = 100 / _total - 5;
                            $list.append('<ul></ul>');
                            for (let i = $min; i <= ($max / $step); i++) {
                                let _setLeft = _stepLeft * i;
                                if ($d != NaN && i % $d === 0) {
                                    $list.find('ul').append('<li style="left:' + _setLeft + '%;width:' + _w + '%"><button class="slider-num n">' + i * $step + '<span class="hidden">' + $unit + '</span></button></li>');
                                } else {
                                    $list.find('ul').append('<li style="left:' + _setLeft + '%;width:' + _w + '%"><button class="slider-num">' + i * $step + '<span class="hidden">' + $unit + '</span></button></li>');
                                }

                            }
                        }

                        if ($inp.length) $inp.val($val);
                        let range = $slider.slider({
                            min: $min,
                            max: $max,
                            value: $val,
                            step: $step,
                            range: 'min',
                            create: function (e) {
                                $slider.find('.ui-slider-handle').attr({ 'tabindex': -1 }).html('<span class="offscreen">������ ����</span><i>' + $val + '</i><span class="offscreen">' + $unit + '�Դϴ�.</span>');
                                $list.find('li').eq($val / $step).addClass('on');
                            },
                            stop: function (event, ui) {
                                $(ui.handle).find('i').html(ui.value);
                                if ($inp.length) $inp.val(ui.value).change();
                                $slider.data('value', ui.value);
                                $list.find('li').eq(ui.value / $step).siblings().removeClass('on');
                                $list.find('li').eq(ui.value / $step).addClass('on').children('button').attr('title', '���缱��');
                            },
                            slide: function (event, ui) {
                                if ($sync !== undefined) $($sync).val(ui.value).change();
                            }
                        });

                        $list.find('button').click(function (e) {
                            e.preventDefault();
                            let $txt = parseInt($(this).text());
                            range.slider('value', $txt);
                            $slider.find('.ui-slider-handle i').text($txt);
                            if ($inp.length) $inp.val($txt).change();
                            if ($sync !== undefined) $($sync).val($txt).change();
                            $list.find('li').removeClass('on').find('button').removeAttr('title');
                            $(this).attr('title', '���缱��').parent().addClass('on');
                        });

                        if ($sync !== undefined) {
                            $($sync).on("change", function () {
                                range.slider('value', this.value);
                            });
                        }

                    });
                }
            },
            form: function () {
                //[���ټ�] ���� role=text
                // numLabel(); aria-label ������ �о����� ����

                //hr aria-hidden �߰� : ���ټ�
                $('hr').attr('aria-hidden', 'true');

                //textarea init
                $(".textarea").each(function () {
                    let _this = $(this);
                    let _textarea = _this.find("textarea");
                    let _numInfo = _this.find(".byte");
                    let _numInfoLen = _numInfo.length;

                    if (_numInfoLen > 0) { _this.addClass("textarea-byte") }
                    if (_textarea.is('[readonly]')) {
                        _this.closest('.textarea').addClass("textarea-readonly");
                    } else if (_textarea.is('[disabled]')) {
                        _this.closest('.textarea').addClass("textarea-disabled");
                    }
                });

                //input init
                $(".form-ele input").add(".form-ele .inp-btn, .form-ele .select-btn").each(function (e) {
                    let _this = $(this);

                    _this.parents('.form-group').find('.tip.error').attr({'role':'alert','aria-live':'assertive'}); //[���ټ�] error message

                    if (_this.is('[readonly], [disabled], .readonly, .disabled') || _this.parents('.form-row').is('.success, .error')) { // .select-btn ���λ������ �߰� 
                        _this.siblings('.btn-clear').remove();
                    }
                });

                $(".form-sel input[type=radio], [role=radio]").each(function (e) {
                    if($(this).prop('checked')) $(this).parents('.form-sel').addClass('on');
                    if($(this).siblings('label').attr('role') === 'text') $(this).siblings('label').removeAttr('role'); //1221 [���ټ�]
                    addAriaLabel($(this));
                });

                $(".form-sel input[type=checkbox], [role=checkbox]").each(function (e) {
                    // s : 0605 [���ټ�]
                    // if($(this).is('[readonly], [disabled], .readonly, .disabled, .disable')) {
                    //     $(this).add($(this).siblings('label')).off('click').on('click', function() {
                    //         return false;
                    //     })
                    // }
                    // e : 0605 [���ټ�]
                    if($(this).prop('checked')) {
                        $(this).parents('.form-sel').addClass('on');
                        if($(this).parents('.pg-wrap.wallet') && $(this).parents('.card-set')) $(this).closest('.card-wrap').addClass('on'); //1214: ���ڹ�������
                    }
                    addAriaLabel($(this));
                });
                
                // $('.chk-card-wrap').each(function() { //INQ_13_ 006,007,008
                //     $(this).find('.rdo').removeAttr('aria-checked');
                // });

                $('[role=text]').each(function() {
                    $(this).attr('tabindex', 0);
                });

                //select init
                $('.form-ele').each(function () {
                    let _this = $(this);
                    let _select = _this.find("select");
                    let _btn = _this.find("button");
                    let _val = _select.children("option[value='none']").index();
                    let _selected = _select.children("option:selected").index();

                    if(_btn.find('.point.sm').length) {
                        let _formLabel = _this.parents('.form-row').siblings('.form-label');
                        let _formLabelName = _formLabel.length ? _formLabel.text() : _this.parents('.section').find('[class^=ht-]').text();

                        _btn.removeAttr('title').find('.point.sm').removeAttr('aria-hidden').prepend(`<span class="hidden">${_formLabelName}</span>`);
                    } //1019 [���ټ�] input > �˻���ư (���ּ� ��)

                    if (_btn.is('.readonly')) _btn.attr('disabled', 'disabled');

                    if (_val == 0 && _selected == 0) {
                        _this.addClass("placeholder");
                    } else {
                        _this.removeClass("placeholder");
                    }

                    if (_select.length) {
                        _select.each(function () {
                            const $sel = $(this);
                            let $selId = $sel.attr('id');
                            let $title = $sel.attr('title');
                            if ($selId == undefined) $selId = 'none';
                            if ($title == undefined) $title = '����';
                            const $btnTitle = '�˾����� ' + $title;
                            const $btnHtml = `<button type="button" id="${$selId}" class="select-btn ui-select-open" title="${$btnTitle}"><span class="select-btn-val">${$sel.val()}</span></button>`;

                            if (!$sel.siblings('.select-btn').length) {
                                $sel.hide().after($btnHtml);
                                const $forLbl = $('label[for="' + $selId + '"]');
                                if ($forLbl.length) {
                                    $forLbl.addClass('ui-select-lbl').attr('title', $btnTitle);
                                }
                            }
                        });
                    }
                });
            },
            event: function() {
                
                // document �̺�Ʈ
                $(document).off('.formEvent')
                .on("click.formEvent", "a[href='#'], a[href='#none']", function (e) { e.preventDefault(); })
                .on('click.formEvent', '.toggle-wrap.chk-list .toggle-item:not(.disable)', function(){
                    let $tgchk = $(this);
                    // //üũ�ڽ�
                    // $tgchk.toggleClass('checked');
        
                    if ($tgchk.hasClass('checked')) {
                        // $tgchk.attr('aria-checked', true); //üũ����
                        $tgchk.closest('.toggle-wrap.chk-list').addClass('on'); //������
                        $tgchk.css('z-index',1);
                    } else {
                        $tgchk.removeAttr('style');
                        // $tgchk.attr('aria-checked', false);
                        $tgchk.closest('.toggle-wrap.chk-list').removeClass('on');
                    }
                })
                .on('click.formEvent', '.toggle-wrap.chk-list .toggle-btn', function(){ //���λ���
                    let $tgbtn = $(this);
                    //��۹�ư
                    if ($tgbtn.hasClass('on')) {
                        $tgbtn.closest(".toggle-wrap.chk-list").removeClass('open');
                    } else {
                        $tgbtn.closest(".toggle-wrap.chk-list").addClass('open');
                    }
                })
                .on('click.formEvent', '.info-msg-list .head-wrap', function() {
                    //��� - ������
                    var $userA = $(this);
                    var $userWrap = $userA.parent('.card-wrap');
                    $userWrap.siblings('.on').removeClass('on').find('.head-wrap').attr('aria-expanded' ,'false');
                    if($userWrap.hasClass('on')){
                        $userWrap.removeClass('on').find('.head-wrap').attr('aria-expanded' ,'false');
                    }else {
                        $userWrap.addClass('on').find('.head-wrap').attr('aria-expanded' ,'true');
                    }
                })
                .on('click.formEvent', '.btns.ico-list button', function() {
                    var _btn = $(this);
                    _btn.addClass("on").siblings().removeClass("on");
                })
                .on('change.formEvent', '.form-ele select',function () {
                    const $val = $(this).val();
                    let $selectTxt = $(this).find(':selected').text();
                    if ($selectTxt == '') $selectTxt = '����';
                    $(this).siblings('.select-btn').find('.select-btn-val').html($selectTxt);

                    if ($val == '') {
                        $(this).siblings('.select-btn').removeClass('on');
                    } else {
                        $(this).siblings('.select-btn').addClass('on');
                    }
                })
                .on('change.formEvent', 'input[type=radio]', function() {
                    let $this = $(this);
                    if ($this.parents('.form-sel').length) {
                        let $radioGroup = $(`[name=${$this.attr('name')}]`);
                        $radioGroup.parents('.form-sel, .agree-chk, .prod-chk').removeClass('on');
                        $this.parents('.form-sel, .agree-chk, .prod-chk').addClass('on');
                        $radioGroup.each(function() {
                            $('#' + $(this).attr('aria-controls')).hide();
                        })
                        addAriaLabel($this);
                    }
                })
                .on('change.formEvent', 'input[type=checkbox]', function() {
                    let $this = $(this);
                    // 0615:���߿�û MSB_TRA_09_006 orderŬ���� �ִ� ��� ����ó��
                    if ($this.parents('.form-sel').length && !$this.parents('.form-sel').closest('.order').length) {
                        $this.parents('.form-sel, .agree-chk, .prod-chk').toggleClass('on');
                    }
                    //1214 ���ڹ�������
                    if ($this.parents('.pg-wrap.wallet').length && $this.parents('.card-set').length) $this.closest('.card-wrap').toggleClass('on');
                })
                _front.scroll();
                // �̺�Ʈ ĸ�ĸ� �ʿ��� ��� formEvent �̺�Ʈ �߰�
                for(let v in _front.formEvent) {
                    let eventTrigger = _front.formEvent[v][0] == null ? document : document.querySelector(_front.formEvent[v][0]);
                    let eventType = _front.formEvent[v][1];
                    let eventFn = _front.formEvent[v][2];
                    let capturing = _front.formEvent[v][3];
                    for(let i in eventType) {
                        eventTrigger.removeEventListener(eventType[i], eventFn, capturing);
                        eventTrigger.addEventListener(eventType[i], eventFn, capturing);
                    }
                }

            },
            /**
             * @property {formEvent}  
             * {keyName : [trigger, event type, function, capturing]}
             * trigger : null ? document:querySelector('')
             * event type : []
             * capturing : boolean ĸó�� �ʿ��Ҷ��� true (��: mai0080100.act)
             */
            formEvent: {
                customInput:[
                    null,
                    [uiMobile.iPhoneVersion() == 12 ? 'touchend':'click'],
                    function(e) {
                        let $checkbox = $(e.target).closest('[role=checkbox]').not('.disable, .already, .chk-null');
                        let $radio = $(e.target).closest('[role=radio]').not('.disable, .already, .chk-null');
                        if($checkbox.length) {
                            $checkbox.toggleClass('checked').attr('aria-checked', $checkbox.hasClass('checked'));
                            
                            let $child = $checkbox.siblings('.chk-card-wrap').find('[role=text]').not('.disable, .already');
                            $child.toggleClass('active');
                            addAriaLabel($checkbox);
                        }else if($radio.length) {
                            let $radioGroup = $radio.parents('[role=radiogroup]');
                            if($radioGroup.length) {
                                $radioGroup.find('[role=radio]').removeClass('checked selected');
                                $radioGroup.find('[role=radio]').removeAttr('aria-checked');
                            }else {
                                console.log('[role=radiogroup]�� �߰����ּ���')
                                // $radio.siblings().removeClass('checked selected').removeAttr('aria-checked');
                            }
                            $radio.addClass('checked selected').attr('aria-checked', true);
                        }
                    },
                    true
                ],
                setClass: [
                    null,
                    [uiMobile.iOS() ? 'click' : 'focusin'],
                    function(e) {
                        let $this = $(e.target);
                        let targets = '.textarea, .form-ele';
                        // mod-date:1016: [���ߴ���] �ȵ���̵� Ű�е� ��ƼŰ ��ư ��ġ fixed -> relative
                        if($this.is($inputEl)) {
                            $this.closest('.pg-wrap').find('.pg-footer').addClass('keypad-up')
                        }
                        if($this.closest(targets).length && !$this.closest(targets).hasClass('focus')) {
                            // S : input btn-clear ��ư
                            let $parent = $this.closest(".form-ele");
                            if($this.is('.form-ele input') && $parent.find('.btn-clear').length == 0) {
                                // ��ư �߰�
                                if (!$this.parents('.form-group').is('.between') && !$this.parents('.form-row').is('.col') && !$parent.is('.outline') && $this.is(':not([type=tel])') && !$this.is('[readonly], [disabled]') && !$this.parents('.unit').is('.decimal') && !$this.is('.right') && !$this.is('.none-clear')) {
                                    $this.after('<button type="button" class="btn-clear"><span class="hidden">�Է³��� �ʱ�ȭ</span></button>'); // mod-date:1128: parents.append -> this.after�� ��Ŀ�� ���������� ���� ����
                                    $(document).off('click', '.form-ele .btn-clear').on('click', '.form-ele .btn-clear', function(e) {
                                        $(e.target).hide().parent(".form-ele").find('input').val('').focus();
                                    });
                                }
                                // ��ư ����
                                if ($this.siblings('button').length) {
                                    let _inpBtnW = Math.round($this.siblings('button').not('.btn-clear').outerWidth() + .6);
                                    if (!$this.is('[type=tel]')) {
                                        $this.siblings(".btn-clear").css('right', _inpBtnW + 'px');
                                    } else {
                                        $this.css('padding-right', _inpBtnW + 'px');
                                    }
                                };
                            }
                            // E : input btn-clear ��ư
                            if(($this.is($inputEl) || $this.is('.inp-btn, .select-btn, .textarea')) && !$this.is('[readonly], .readonly, .disabled')) {
                                if($this.parents('.success, .error').length == 0) {
                                    //$this.parents('.form-group').siblings().find(targets).removeClass('focus'); //0824(smp0050101)
                                    //$this.closest(targets).addClass('focus'); 
                                    $this.parents('.form-group').siblings().find(targets).removeClass('focus'); 
                                    $this.closest(targets).addClass('focus'); 
                                }
                            }
                            
                        }
                        if($this.closest('.form-date-term')) $this.closest('.form-date-term').addClass('focus');
                        if($this.val() !== '' && $this.closest('.inp-ref-wrap').length) $this.closest(".form-row").find(".inp-ref-pos").show();
                        if($this.val() !== '' && $this.siblings('.btn-clear').length) $this.siblings('.btn-clear').show();
                        else $this.siblings('.btn-clear').hide();
                    },
                    false
                ],
                removeClass: [
                    null,
                    [uiMobile.iOS() ? 'mouseout' : 'focusout'], // mod-date:1016: blur event ����
                    function(e) {
                        let $this = $(e.target);
                        let targets = '.textarea, .form-ele, .form-date-term, .form-row';
                        // mod-date:1016: [���ߴ���] �ȵ���̵� Ű�е� ��ƼŰ ��ư ��ġ relative -> fixed
                        if($this.is($inputEl)) {
                            setTimeout(function(){
                                $this.closest('.pg-wrap').find('.pg-footer').removeClass('keypad-up')
                            }, $this.closest(".form-row").find(".inp-ref-pos").is(":visible") ? 200 : 0);
                        }
                        if($this.is($inputEl) || $this.is('.inp-btn, .select-btn')) {
                            
                            if($this.is('textarea') || $this.is('input')) {
                                //$this.closest(targets).removeClass('focus');
                                $this.closest(targets).removeClass('focus');
                            }
                            // 0726:���߿�û���� ����
                            // if(pubOnly) {
                                //if(!$this.hasClass('pop--focused')) $this.closest(targets).removeClass('focus');
                                if(!$this.hasClass('pop--focused')) $this.closest(targets).removeClass('focus');
                            // }
                            setTimeout(function(){
                                if (!($this.is(":focus"))) $this.closest(".form-row").find(".inp-ref-pos").hide();
                                if (!($this.is(":focus"))) $this.siblings(".btn-clear").hide();
                            }, 200);
                        }
                    },
                    false
                ],
                input: [
                    null,
                    ['keyup'],
                    function(e) {
                        if($(e.target).is('.form-ele input')) {
                            let $this = $(e.target);
                            $this.next('.unit').addClass('on');
                            if (!$this.val().length) {
                                $this.next('.unit').removeClass('on');
                                $this.siblings(".btn-clear").hide()
                            }else {
                                $this.siblings(".btn-clear").show()
                                if(pubOnly && $this.closest('.inp-ref-wrap').length) $this.closest(".form-row").find(".inp-ref-pos").show();
                            }
                        }
                    },
                    false
                ],
            },
        };

        let scTop = {
            init: function () {
                scTop.btnSctop();
            },
            btnSctop: function () {
                $(document).on('click', '.btn-sctop', function (e) {
                    let $html = $('html, body');
                    $this = $(this);
                    $offsetTop = $this.offset().top - 70;
                    if (!$('.sctop-fix').hasClass('on')) {
                        $html.animate({ scrollTop: $offsetTop }, 300);
                    }
                    e.preventDefault();
                });
            },
            topMove: function (e) {
                let $tar = $(e),
                    $pBody = $tar.closest('.pop-body'),
                    $header = $tar.closest('.pg-wrap').find('.pg-header'),
                    $tabFixed = $tar.closest('.pg-wrap').find('.tab-list-wrap.fixed'),
                    _hH = $header.length > 0 ? $header.outerHeight() : 70,
                    _tH = $tabFixed.length > 0 ? $tabFixed.outerHeight() : 20,
                    $notMoveEl = '.main-account';
                $html = $('html, body');

                //if ($tar.is('.tit') && $tar.parents().is('[data-ui=accordion]') || $tar.parents().is($notMoveEl) || $('body').height() >= $('.pg-wrap').height()) {

                //console.log('aaa: ' + $('body').height(), $('.pg-wrap').height())
                // mod-data:1013: $('.pg-wrap').height() -> $tar.closest('.pg-wrap').height()
                if ($('body').height() >= $tar.closest('.pg-wrap').height()) {
                    return false;
                } else {
                    $pBody.length ? $pBody.animate({ 'scrollTop': $tar.position().top }, 0) : $html.animate({ 'scrollTop': $tar.offset().top - (_hH+_tH) }, 0);
                }
                $tar.attr('tabindex', 0).focus();
                //setTimeout(function () { $tar.removeAttr('tabindex') }, 100); 
            }
        }

        //���̾��˾�(Layer): ���̾� �˾��� .pg-container �ۿ� ��ġ�ؾ���
        let Layer = {
            id: 'uiLayer',
            popClass: 'popup',
            pageClass: 'page',
            wrapClass: 'pop-wrap',
            sclWrapClass: 'pop-scl-wrap',
            headClass: 'pop-head',
            bodyClass: 'pop-body',
            contClass: 'pop-section',
            tabClass: 'tab-scroller',
            footClass: 'pop-foot',
            innerClass: 'section',
            showClass: 'show',
            loadClass: 'load-show',
            etcCont: '.pg-header,.pg-gnb,.pg-container,.pg-footer',
            focusedClass: 'pop--focused',
            focusInClass: 'ui-focus-in',
            removePopClass: 'ui-pop-remove',
            closeRemoveClass: 'ui-pop-close-remove',
            alertClass: 'ui-pop-alert',
            lastPopClass: 'ui-pop-last',
            bgNoCloseClass: 'bg-no-click',
            noDimmedClass: 'no-dimmed',
            beforeCont: [],
            content: '',
            overlapChk: function () {
                //focus �̺�Ʈ �� �ߺ����� ����
                const $focus = $(':focus');
                if (!!event) {
                    if (event.type === 'focus' && $($focus).hasClass(Layer.focusedClass)) {
                        return false;
                    }
                }
                //���� ���� �ߺ����� ����
                if (Layer.beforeCont.indexOf(Layer.content) >= 0) {
                    return false;
                } else {
                    Layer.beforeCont.push(Layer.content);
                }
                return true;
            },
            alertHtml: function (type, popId, btnActionId, btnCancelId) {
                let $html = '<div id="' + popId + '" class="' + Layer.popClass + ' modal alert ' + Layer.alertClass + '" role="dialog" aria-hidden="true">';
                $html += '<article class="' + Layer.wrapClass + '">';
                $html += '<div class="' + Layer.headClass + '"><h1>�˸�</h1></div>';
                $html += '<div class="' + Layer.bodyClass + '">';
                $html += '<div class="' + Layer.innerClass + '">';
                if (type === 'prompt') {
                    $html += '<div class="form-lbl mt-0">';
                    $html += '<label for="inpPrompt" role="alert" aria-live="assertive"></label>';
                    $html += '</div>';
                    $html += '<div class="form-item">';
                    $html += '<div class="input"><input type="text" id="inpPrompt" placeholder="�Է����ּ���."></div>';
                    $html += '</div>';
                } else {
                    $html += '<div class="message">';
                    $html += '<div role="alert" aria-live="assertive"></div>';
                    $html += '</div>';
                }
                $html += '</div>';
                $html += '</div>';
                $html += '<div class="' + Layer.footClass + '">';
                $html += '<div class="btns">';
                if (type === 'confirm' || type === 'prompt') {
                    $html += '<button type="button" id="' + btnCancelId + '" class="btn secondary lg">���</button>';
                }
                $html += '<button type="button" id="' + btnActionId + '" class="btn primary lg">Ȯ��</button>';
                $html += '</div>';
                $html += '</div>';
                $html += '</article>';
                $html += '</div>';

                $('body').append($html);
            },
            alertEvt: function (type, option, callback, callback2, callback3, callback4) {
                const $length = $('.' + Layer.alertClass).length;
                const $popId = Layer.id + 'Alert' + $length;
                const $actionId = $popId + 'ActionBtn';
                const $cancelId = $popId + 'CancelBtn';

                if (typeof option === 'object') {
                    Layer.content = option.content;
                } else if (typeof option == 'string') {
                    //��� ����
                    Layer.content = option;
                }

                //�ؽ�Ʈ�� �ƴ� �迭�̳� ��ü�϶� �ؽ�Ʈ ��ȯ
                if (typeof Layer.content !== 'string') Layer.content = JSON.stringify(Layer.content);

                //�����ִ��� üũ
                if ($.trim(Layer.content) == '' || Layer.content == undefined) return false;

                //�ߺ��˾� üũ
                if (Layer.overlapChk() === false) return false;

                //�˾��׸���
                Layer.alertHtml(type, $popId, $actionId, $cancelId);
                if (!!option.title || (typeof callback === 'string' && callback !== '')) {
                    const $insertTit = typeof callback === 'string' && callback !== '' ? callback : option.title;
                    console.log($insertTit);
                    ($insertTit === 'noTitle') ? $('#' + $popId).find('.' + Layer.wrapClass + ' h1').remove() : $('#' + $popId).find('.' + Layer.wrapClass + ' h1').html($insertTit);
                }
                let $actionTxt;
                if (!!option.actionTxt) $actionTxt = option.actionTxt;
                if (typeof callback2 === 'string' && callback2 !== '') $actionTxt = callback2;
                if ($actionTxt) $('#' + $actionId).text($actionTxt);

                let $cancelTxt;
                if (!!option.cancelTxt) $cancelTxt = option.cancelTxt;
                if (typeof callback3 === 'string' && callback3 !== '') $cancelTxt = callback3;
                if ($cancelTxt) $('#' + $cancelId).text($cancelTxt);

                const $htmlContent = Layer.content;
                if (type === 'prompt') {
                    $('#' + $popId)
                        //.find('.form-lbl label')
                        .html($htmlContent);
                } else {
                    const $textAry = $htmlContent.split(' '),
                        $textLengthAry = [];
                    for (let i = 0; i < $textAry.length; i++) {
                        $textLengthAry.push($textAry[i].length);
                    }
                    const $maxTxtLength = Math.max.apply(null, $textLengthAry);
                    if ($maxTxtLength > 20)
                        $('#' + $popId)
                            .find('.message>div')
                            .addClass('breakall');
                    $('#' + $popId)
                        .find('.message>div')
                        .html($htmlContent);
                }

                Layer.open('#' + $popId);

                //click
                let $result = '';
                const $actionBtn = $('#' + $actionId);
                const $cancelBtn = $('#' + $cancelId);
                let $inpVal = '';

                $actionBtn.on('click', function () {
                    $result = true;
                    $inpVal = $('#' + $popId)
                        .find('.form-ele input')
                        .val();

                    const $actionEvt = function () {
                        if (type === 'prompt') {
                            if (!!option.action) option.action($result, $inpVal);
                            if (!!option.callback) option.callback($result, $inpVal);
                            if (typeof callback === 'function') callback($result, $inpVal);
                            if (typeof callback2 === 'function') callback2($result, $inpVal);
                            if (typeof callback3 === 'function') callback3($result, $inpVal);
                            if (typeof callback4 === 'function') callback4($result, $inpVal);
                        } else {
                            if (!!option.action) option.action($result);
                            if (!!option.callback) option.callback($result);
                            if (typeof callback === 'function') callback($result);
                            if (typeof callback2 === 'function') callback2($result);
                            if (typeof callback3 === 'function') callback3($result);
                            if (typeof callback4 === 'function') callback4($result);
                        }
                    };
                    Layer.close('#' + $popId, $actionEvt);
                });
                $cancelBtn.on('click', function () {
                    $result = false;
                    const $cancelEvt = function () {
                        if (!!option.cancel) option.cancel();
                        if (!!option.callback) option.callback($result);
                        if (typeof callback === 'function') callback($result);
                        if (typeof callback2 === 'function') callback2($result);
                        if (typeof callback3 === 'function') callback3($result);
                        if (typeof callback4 === 'function') callback4($result);
                    };
                    Layer.close('#' + $popId, $cancelEvt);
                });
            },
            alert: function (option, callback, callback2, callback3) {
                Layer.alertEvt('alert', option, callback, callback2, callback3);
            },
            confirm: function (option, callback, callback2, callback3, callback4) {
                Layer.alertEvt('confirm', option, callback, callback2, callback3, callback4);
            },
            prompt: function (option, callback, callback2, callback3, callback4) {
                Layer.alertEvt('prompt', option, callback, callback2, callback3, callback4);
            },
            BottomChkSelect: function(){ //Check List in BottomSheet
                $('.list-block').off('click').on('click', function(){ //.pop-body
                    if ($(this).parents('.multi-check').length > 0) {
                        $(this).hasClass('selected') ? $(this).removeClass('selected').attr('title','����������') : $(this).addClass('selected').attr('title','���õ�');
                    } else {
                        $(this).addClass('selected').attr('title','���õ�').siblings().removeClass('selected').removeAttr('title');
                    }
                })
                $('.pop-body .list-block-btn').off('click').on('click', function(){
                    if ($(this).parents('.multi-check').length > 0) {
                        $(this).hasClass('selected') ? $(this).removeClass('selected').attr('title','����������') : $(this).addClass('selected').attr('title','���õ�');
                    } else {
                        $(this).addClass('selected').attr('title','���õ�').parents('.list-block-wrap').siblings().find('.list-block-btn').removeClass('selected').removeAttr('title');
                    }
                })
            },
            bottomTouch: function (tar) {
                const $popup = $(tar);
                const $wrap = $popup.find('.' + Layer.wrapClass);
                const $head = $popup.find('.' + Layer.headClass);
                const $body = $popup.find('.' + Layer.bodyClass);
                const $tabScroller = $body.find('.' + Layer.tabClass);
                const $foot = $popup.find('.' + Layer.footClass);
                const $trigger = $popup.hasClass('body-swipe') ? Layer.tabClass : Layer.headClass;
                let _footH = 0;
                if ($foot.length) _footH = $foot.outerHeight();
                //swipe ���� �߰�
                if ($popup.hasClass('is-swipe') && !$head.find('span.swipe').length) $head.prepend('<span class="swipe"></span>');
                const _headH = $head.outerHeight() + 24;
                const $bodyMinHeight = $popup.find('span.swipe').outerHeight();

                let isMove = false;
                const $animateSpeed = 300;
                let $startH = 0;
                let $startX = 0;
                let $startY = 0;
                let $distanceX = 0;
                let $distanceY = 0;
                let $directionX = false;
                let $directionY = false;
                let $duration = 0;
                let $durationTimer;

                $(tar)
                    .find('.' + $trigger)
                    .on('touchstart mousedown', function (e) {
                        isMove = true;
                        const $this = $(this);
                        const $clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                        const $clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
                        $startX = $clientX;
                        $startY = $clientY;
                        $startH = $this.closest('.' + Layer.wrapClass).outerHeight();
                        $distanceX = 0;
                        $distanceY = 0;
                        $directionX = false;
                        $directionY = false;
                        if ($this.data('first-height') === undefined) $this.data('first-height', $startH);
                        if ($this.data('is-full') === undefined) $this.data('is-full', false);
                        $duration = 0;
                        $durationTimer = setInterval(function () {
                            $duration += 10;
                        }, 10);
                        $wrap.stop(false, true);
                        if ($(tar).hasClass('touch-move')) $(tar).addClass('touch-moving');
                        if($tabScroller.hasClass('scroll')) $tabScroller.css('overflow-y','hidden');
                        
                    });

                $(tar)
                    .find('.' + $trigger)
                    .on('touchmove mousemove', function (e) {
                        if (!isMove) return false;
                        const $this = $(this);
                        const $clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                        const $clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
                        $distanceX = $clientX - $startX;
                        $distanceY = $clientY - $startY;

                        const $min = $bodyMinHeight;
                        const $max = $(tar).hasClass('touch-move') ? $popup.height() : $popup.outerHeight();
                        const $height = Math.max($min, Math.min($max, $startH - $distanceY));
                        const _bodyH = $height - _headH - _footH;

                        $wrap.css('height', $height);
                        $body.css('max-height', _bodyH);
                    });

                $(tar)
                    .find('.' + $trigger)
                    .on('touchend mouseup mouseleave', function (e) {
                        if (!isMove) return false;
                        isMove = false;
                        const $this = $(this);
                        const $isFull = $this.data('is-full');
                        const $clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
                        const $clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;
                        $distanceX = $clientX - $startX;
                        $distanceY = $clientY - $startY;
                        if ($distanceX !== 0) $directionX = $distanceX > 0 ? 'right' : 'left';
                        if ($distanceY !== 0) $directionY = $distanceY > 0 ? 'down' : 'up';
                        const $firstHeight = $this.data('first-height');
                        const $min = $bodyMinHeight;
                        const $max = $(tar).hasClass('touch-move') ? $popup.height() : $popup.outerHeight();

                        clearInterval($durationTimer);
                        const $powerRatio = $duration === 0 || $distanceY === 0 ? 0 : Math.abs($distanceY) / $duration;
                        const $power = (1 + Math.round($powerRatio * 3)) * Math.round($powerRatio * 30);
                        const $powerDistance = Math.round((($distanceY * -1) / $duration) * $power);
                        if ($(tar).hasClass('touch-move')) {
                            $(tar).removeClass('touch-moving');
                            const $wrapHeight = $wrap.outerHeight();
                            const $endHeight = Math.max($min, Math.min($max, $wrapHeight + $powerDistance));
                            const $endSpeed = Math.min(2000, Math.abs($powerDistance * 10));

                            if ($directionY === 'up') {
                                $wrap.animate({ height: $endHeight }, $endSpeed, 'easeOutQuint');
                            } else if ($directionY === 'down' && $tabScroller.hasClass('scroll')) {
                                //Layer.close(tar);
                                $wrap.animate({ height: $endHeight }, $endSpeed, 'easeOutQuint');
                            }
                            $body.css('max-height', $endHeight - _headH - _footH);

                        } else if ($(tar).hasClass('body-swipe')) {
                            const _tabS = $tabScroller.scrollTop();
                            const _tabH = $body.find('.tab-list').outerHeight();
                            (_tabS <= 0) ? $tabScroller.removeClass('on').addClass('scroll') : $tabScroller.removeClass('scroll').addClass('on');
                            if (Math.abs($distanceY) > 25) {
                                if ($popup.hasClass('bottom') && !$isFull) {
                                    //if ($directionY === 'up' && $this.hasScroll()) {
                                    if ($directionY === 'up') {
                                        $wrap.animate({ height: '100%' }, $animateSpeed);
                                        $tabScroller.css('max-height', parseInt(Layer.popMaxH - _headH - _footH - _tabH));
                                        $tabScroller.removeClass('scroll').addClass('on');
                                        $tabScroller.css('overflow-y','');
                                    } else if ($directionY === 'down' && $tabScroller.hasClass('scroll')) {
                                        $wrap.animate({ height: $popup.data('isWrapH') }, $animateSpeed);
                                        //const _popH = parseInt(($(window).height() / 3) * 2);
                                        const _popH = parseInt($(window).height() * 0.8);
                                        setTimeout(function(){
                                            if ($popup.hasClass('transfer') || $popup.hasClass('half') || $popup.hasClass('default')) {
                                                $tabScroller.css('max-height', parseInt($popup.data('isBodyH') - _tabH));
                                            } else {
                                                $tabScroller.css('max-height', parseInt(_popH - _headH - _footH - _tabH));
                                            }
                                        }, 300);
                                    }
                                }
                            }
                        } else {
                            if (Math.abs($distanceY) > 25) {
                                if ($popup.hasClass('bottom') && !$isFull) {
                                    if ($directionY === 'up') {
                                        $wrap.animate({ height: '100%' }, $animateSpeed);
                                    } else if ($directionY === 'down') {
                                        Layer.close(tar);
                                    }
                                }
                            } else {
                                $wrap.animate({ height: $firstHeight }, $animateSpeed, function () {
                                    $this.removeData('first-height');
                                });
                            }
                        }

                        $this.removeData('is-full');
                    });
            },
            moveStream: function () { //�����˾�
                $(document).on('click', '.stream-wrap [data-ui=pop-next]', function (e) {
                    let $this = $(this),
                        $popWrap = $this.parents('.pop-wrap'),
                        $dataNo = $this.data('no');                        

                    $popWrap.find('.stream-wrap').eq($dataNo).css('display', '').show().siblings('.stream-wrap').hide();
                    $popWrap.parents('.popup').data('no', $dataNo); //0726:��Ŀ���̽� �־� data�� ������ ���� ����
                    let $isShowing = $popWrap.find(".tab-list[role='tablist'] .active");
                    ($isShowing.is(":visible")) ? $isShowing.trigger('click') : null;  // [0324] ���ִ� �˼��� ���� �ӽ�����
                    UICommon.Layer.setHeight('#'+$popWrap.parents('.popup').attr('id')); // 0824(smp0050101)
                });
            },
            toast: function (txt, fn, type, delayTime) {
                if (type === undefined) type = 'toast';
                const $isAlarm = type === 'alarm';
                const $isFn = !!fn;
                const $className = '.' + type + '-box';
                const $overlap = $(".alarm-box.on");

                if ($overlap.length) return;
                if (delayTime == undefined) delayTime = 2000;
                let $boxHtml = '<div class="' + $className.substring(1) + '" role="alert" aria-live="assertive" aria-atomic="true" tabindex="0">';

                if ($isFn) {
                    $boxHtml += '<button type="button" class="txt">' + txt + '</button>';
                } else {
                    $boxHtml += '<div class="txt">' + txt + '</div>';
                }
                if ($isAlarm) {
                    $boxHtml += '<button type="button" class="pop-close-x" data-ui="pop-close" title="�˶��˾� �ݱ�"></button>';
                }
                $boxHtml += '</div>';

                $('.pg-wrap').before($boxHtml);
                const $toast = $($className).last();
                const $toastClose = function () {
                    $toast.removeClass('on');
                    $toast.one('transitionend', function () {
                        $(this).remove();
                    });
                };
                const $spaceH = $('.bottom-fixed-space').outerHeight();
                if ($spaceH) {
                    $toast.css('bottom', $spaceH);
                }
                setTimeout(function () { 
                    $toast.addClass('on');
                    $($className).attr('tabindex', 0).focus();
                }, 10);
                let $closeTime;
                if (!$isAlarm) {
                    $closeTime = setTimeout($toastClose, delayTime);
                }
                if ($isFn) {
                    $toast.find('a.txt').one('click', function (e) {
                        e.preventDefault();
                        fn();
                        // �̺�Ʈ ����� �ٷ� �ݱ�
                        clearTimeout($closeTime);
                        $toastClose();
                    });
                }
            },
/*             alarm: function (txt, fn, delayTime) {idx
                Layer.toast(txt, fn, 'alarm', delayTime);
            }, */
            reOpen: false,
            openEl: '',
            openPop: [],
            opening: 0,
            popMaxH: $(window).height() * 0.8, // mod-date:0919
            setHeight: function(tar) { // 0824 �Լ��� ��Ƽ� ���
                const $popup = $(tar);
                const $wrap = $popup.find('.' + Layer.wrapClass);
                const $head = $wrap.find('.' + Layer.headClass);
                const $foot = $wrap.find('.' + Layer.footClass);
                const $body = $wrap.find('.' + Layer.bodyClass);
                const _headH = $head.outerHeight() + ($popup.hasClass('bottom') ? 24 : 20); //const _headH = $head.outerHeight();
                let _footH = 0;
                
                if ($foot.length) {
                    _footH = $foot.css('display') == 'none' ? 0 : $foot.filter(':visible').outerHeight(); // 0727: ���� ����
                    $popup.addClass('foot');
                }
                // s: mod-date:0919: ���Ǫ�� ���̰� ����
                //const _parseHeadH = $head.length ? $head.outerHeight() : 0;
                const _parseHeadH = $head.length ? 80 : 0; //1213: ���ӹ��� height ��������
                const _parseFootH = $foot.length ? $foot.css('display') == 'none' ? 0 : $foot.outerHeight() : 0;
                const _dataHeight = $popup.attr('data-height') ? $popup.attr('data-height') : Layer.popMaxH + 'px';
                const _dataBodyH = $body.css('max-height', `calc(${_dataHeight} - ${_parseHeadH/10}rem - ${_parseFootH/10}rem)`);
                // 2: mod-date:0919: ���Ǫ�� ���̰� ����
                
                // 0221 links �ϴܸ�ũ ���Խ� �ϴܰ��� �κ� 
                if ($popup.hasClass('links')) {
                    $body.css('max-height', Layer.popMaxH - _headH - _footH);
                    $wrap.find(".fixed-btm").css("top", parseInt(Layer.popMaxH) - 50);
                } else if ($popup.find('.stream-wrap').length > 0)  {
                    //$body.css('max-height', Layer.popMaxH - _headH - _footH - 50);
                    $wrap.find('.pop-wrap, .stream-wrap').css('height', ($popup.hasClass('fix') || $popup.attr('data-height')) ? _dataBodyH : 'auto');
                } else {
                    _dataBodyH
                }
            },
            open: function (tar, popTitle, popClose, callback) {
                const $popup = $(tar);
                const $popWrap = $popup.find('.' + Layer.wrapClass);
                const $popBody = $popup.find('.' + Layer.bodyClass);
                const $btnPopClose = $popup.find('.pop-wrap .pop-close');
                const $tabScroller = $popup.find('.' + Layer.tabClass);
                const no = event && $(event.target).data('no') ? $(event.target).data('no') : 0;
                if(no !== null) $popup.data('no', no); //0726: ��Ŀ�� ����
                $('html').removeClass('keypad-open');
                if($popup.closest('.pg-wrap').length && $popup.find($inputEl).length || $popup.hasClass('more')){
                    $('.pg-wrap').after($popup);
                }
                if ($('.pg-wrap').length && !$popup.hasClass('no-dimmed')) $('.pg-wrap').attr('aria-hidden', true);
                if ($('.pg-container').length && !$popup.hasClass('no-dimmed')) $('.pg-container').attr('aria-hidden', true);
                
                // // mod-date:1130:���ټ� ����
                if ($popup.hasClass('loading')) {
                    // ���߰��뿡�� �˾��� ������ Layer.close() �� ������ϰ� �ٸ� ������ �־...
                    $popup.attr('aria-hidden', false);
                }

                if ($tabScroller.length) $tabScroller.removeClass('on').addClass('scroll');
                if ($popup.length && $popWrap.length) {
                    Layer.opening++;
                    const $idx = $popup.index('.' + Layer.popClass);
                    const $show = $('.' + Layer.popClass + '.' + Layer.showClass).not('.' + Layer.alertClass).length;
                    const $alertShow = $('.' + Layer.popClass + '.' + Layer.showClass + '.' + Layer.alertClass).length;
                    let $id = $popup.attr('id');
                    // mode-date:1010:���� ���� ����:0920:�˾� ���� ���� data-height="??vh" üũ
                    if($popup.data('height')) $popup.find('.' + Layer.wrapClass).css('max-height', $popup.data('height'));
                    let $lastPop = '';

                    if (Layer.openPop.length) $lastPop = Layer.openPop[Layer.openPop.length - 1];
                    if ($popup.hasClass(Layer.alertClass && !$alertShow)) {
                        $popup.css('z-index', '+=' + $alertShow);
                    } else if ($show) {
                        $popup.css('z-index', '+=' + $show);
                    }
                    if ($id == undefined) {
                        $id = Layer.id + $idx;
                        $popup.attr('id', $id);
                    }
                    if ($btnPopClose.length) $btnPopClose.attr('id', $id + '-dev');

                    if (popTitle != undefined && popTitle != null && popTitle != '') $popup.find('.pop-head h1').text(popTitle);
                    if (popTitle === 'noTitle' && popTitle != '') $popup.find('.pop-head h1').empty();
                    if ($btnPopClose.length && popClose === 'noClose') {
                        $popup.addClass('no-close');
                        $btnPopClose.remove();
                    }
                    if (!$popup.hasClass(Layer.alertClass)) {
                        if (Layer.openPop.length) {
                            let $last;
                            $.each(Layer.openPop, function () {
                                const $this = '' + this;
                                if (!$($this).hasClass(Layer.alertClass)) $last = $this;
                            });
                            $($last).removeClass(Layer.lastPopClass);
                        }
                        $popup.addClass(Layer.lastPopClass);
                    }
                    if (Layer.openPop.indexOf('#' + $id) < 0) Layer.openPop.push('#' + $id);

                    // bg close
/*                     if (!$popup.hasClass(Layer.alertClass) && !$popup.hasClass(Layer.bgNoCloseClass)) {
                        const $bgClick = '<div class="pop-bg-close" data-ui="pop-close" role="button" aria-label="�˾�â �ݱ�"></div>';
                        if (!$popup.find('.pop-bg-close').length) $popup.prepend($bgClick);
                    } *//* 0825: [��ȹ��û] ����ݱ� ��ɻ��� */

                    const $openDelay = 100 * Layer.opening;
                    const $callbackDelay = 450;

                    //if ($popup.hasClass('bottom')) $popup.find('.pop-body').addClass('scroll');
                    if ($popup.hasClass('bottom')) { //0918 ���߹�ư ���� �׽�Ʈ
                        $('.pg-wrap').find('.pg-footer').addClass('nofix'); 
                        $popup.find('.pop-body').addClass('scroll');
                    }
                    if ($popup.hasClass('bottom') && $popup.find('.tab-wrap').length) {
                        $popup.find('.pop-body').addClass('is-tab');
                        $popup.find('.stream-wrap').each(function() { //�����˾�+tabmenu
                            if ($popup.find('.tab-wrap')) {
                                $popup.find('.pop-body').removeClass('is-tab');
                                $popup.find('.stream-wrap .tab-wrap').parent('.pop-body').addClass('is-tab');
                            }
                        })
                        if(!$popup.find('.tab-scroller').length) $popup.find('.tab-wrap').contents().not('.tab-list').wrapAll('<div class="tab-scroller scroll"></div>');
                        $popup.hasClass('transfer') ? $popup.addClass('body-swipe') : $popup.addClass('body-swipe default'); //tab �޴� üũ
                    }

                    $popup.attr('aria-hidden', false);

                    if ($popup.hasClass('modal')) {
                        $popup.css('display', 'flex');
                    } else {
                        $popup.show();
                    }

                    const $FocusEvt = function (event) {
                        //���� ��Ŀ��
                        let $focusEl = '';
                        try {
                            if (event.currentTarget != document) {
                                $focusEl = $(event.currentTarget);
                            } else {
                                $focusEl = $(document.activeElement);
                            }
                        } catch (error) {
                            $focusEl = $(document.activeElement);
                        }

                        if (Layer.openEl != '' && !$focusEl.is($focusableEl)) $focusEl = $(Layer.openEl);
                        if ($($lastPop).data('returnFocus') == $focusEl) $focusEl = $(Layer.openEl);
                        if ($($focusEl).is($focusableEl)) {
                            $popup.data('returnFocus', $focusEl);
                            $focusEl.addClass(Layer.focusedClass);
                          //  if ($focusEl.hasClass('select-btn')) $focusEl.closest('.form-ele').addClass('focus'); 2/24 ����
                        }
                        //�˾� in ��Ŀ��
                        $popWrap.attr({ tabindex: 0 }).focus();
                    };

                    setTimeout(function () {
                        $(Layer.etcCont).attr('aria-hidden', true);

                        //�����ִ� �˾�
                        if (Layer.openPop.length && $lastPop) $($lastPop).attr('aria-hidden', true);

                        //�����ټ�
                        const $tit = $popup.find('.' + Layer.headClass + ' h1');
                        if ($tit.length) {
                            if ($tit.attr('id') == undefined) {
                                $tit.attr('id', $id + 'Label');
                                $popup.attr('aria-labelledby', $id + 'Label');
                            } else {
                                $popup.attr('aria-labelledby', $tit.attr('id'));
                            }
                        }

                        //�˾��� ������
                        if ($popup.find('.tab-wrap').length) tabMenu.init();

                        //�˾��� swiper
                        if ($popup.find('.ui-swiper').length) uiSwiper.update($popup.find('.ui-swiper'));

                        //����
                        if (!$('html').hasClass('lock') && !$popup.hasClass('no-dimmed')) Body.lock();
                        $popWrap.scrollTop(0);
                        $popup.addClass(Layer.showClass);

                        //Ÿ��Ʋ ���� üũ
                        if ($popup.find('.pop-head h1').length == 0) $popup.addClass('no-title');

                        //iframe
                        if ($('iframe.load-height').length) ui.Util.iframe();
                        if (!uiMobile.any()) Layer.focusMove(tar);
                        Layer.position(tar);


                        setTimeout(function () {
                            Layer.resize();
                            if ($popup.hasClass('bottom') || $popup.hasClass('modal')) {
                                let $height = $(window).height() - 50;
                                const $wrap = $popup.find('.' + Layer.wrapClass);
                                const $head = $wrap.find('.' + Layer.headClass);
                                //const _headH = $head.outerHeight() + ($popup.hasClass('bottom') ? 24 : 20); //const _headH = $head.outerHeight();
                                const _headH = $head.outerHeight();
                                const $foot = $wrap.find('.' + Layer.footClass);
                                const $body = $wrap.find('.' + Layer.bodyClass);
                                const _contH = $wrap.find('.' + Layer.contClass).height();
                                const $tabScroller = $body.find('.tab-scroller');
                                let _footH = 0;
                                let _popH = 0;
                                let isScroll = false;
                                
                                if ($foot.length) {
                                    _footH = $foot.css('display') === 'none' ? 0 : $foot.filter(':visible').outerHeight(); // 0727: ���� ����
                                    $popup.addClass('foot');
                                }
                                
                                $wrap.css('max-height', $popup.data('height') ? $popup.data('height') : Layer.popMaxH); // mode-date:0919: pop-wrap max-height
                                
                                Layer.setHeight(tar); // 0824(smp0050101) ����

                                if ($popup.hasClass('transfer')) {
                                    let $popMark = $('.pop-mark');
                                    if ($popMark.length) {
                                        let _tH = parseInt($(window).height() - ($popMark.offset().top + $popMark.height() + 24));
                                        _popH = (230 > _tH) ? 230 : _tH;
                                    } else {
                                        //_popH = parseInt(($(window).height() / 3) * 2);
                                        _popH = parseInt($(window).height() * 0.8);
                                    }
                                } else if ($popup.hasClass('half')) {
                                    _popH = parseInt($(window).height() / 2);
                                } else if ($popup.hasClass('default')) {
                                    //_popH = parseInt(($(window).height() / 3) * 2);
                                    _popH = parseInt($(window).height() * 0.8);
                                }

                                _popH = $popup.data('height') ? parseInt($popup.data('height')) / 100 * $(window).height() : Layer.popMaxH; // mod-date:0919
                                let _bodyH = _popH - _headH - _footH;
                                if ($popup.hasClass('bottom') && !$popup.find('.pop-foot').length) $popBody.addClass('-sab'); //0908: �����ϴܹ�ư���� ��� ��ġ����
                    
                                (_bodyH < _contH || $popup.find('.tab-wrap').length) ? isScroll = true : $body.removeClass('scroll').addClass('no-scroll');
                                //if (_bodyH < _contH || $popup.find('.tab-wrap').length) isScroll = true;

                                if ($popup.hasClass('transfer') || $popup.hasClass('half') || $popup.hasClass('default')) {
                                    if (isScroll) {
                                        $wrap.css('height', _popH);
                                        $popup.data('isWrapH', _popH);
                                        $popup.data('isBodyH', _bodyH);
                                    }
                                }
                                //�� ������ ��ũ���� �ʿ��Ҷ�
                                if($tabScroller.length) {
                                    const _tabH = parseInt($body.find('.tab-list').outerHeight());
                                    // 0221 links �ϴܸ�ũ ���Խ� �ϴܰ��� �κ� 
                                    if ($popup.hasClass('links')) {
                                        $tabScroller.css('max-height', parseInt(_bodyH - _tabH) - 20);
                                        //$tabScroller.css('max-height', parseInt(_bodyH - _tabH) - 36);
                                        $popup.find(".fixed-btm").css("top", parseInt(_bodyH - _tabH) + 15);
                                    } else {
                                        $tabScroller.css('max-height', parseInt(_bodyH - _tabH - 20));
                                        //$tabScroller.css('max-height', `calc(100% - ${parseInt(_tabH)})`);
                                    }
                                }
                                //swipe ���
                                if ($popup.hasClass('is-swipe') && !$popup.hasClass('is-swipe--init') || $popup.hasClass('body-swipe')) {
                                    $popup.addClass('is-swipe--init');

                                    if ($popup.find('.stream-wrap')) $popup.removeClass('is-swipe--init') //.stream-wrap + .tab-wrap �϶� height auto
                                   // if (!$popBody.hasClass('no-scroll')) Layer.bottomTouch(tar); 230308 ���x
                                }
                            }
                        }, 100);

                        setTimeout(function () {
                            if (!$popup.hasClass('no-dimmed')) $FocusEvt();
                            if (!!callback) callback();
                            $popup.trigger('Layer.show');

                            // 20220826: �¿���� ��ũ�� ��� �ʱⰪ ó����(���߿�û)
                            // Layer.setScrollBetweenTop();
                        }, $callbackDelay);
                        Layer.opening--;
                    }, $openDelay);
                } else {
                    if($('.pg-wrap').filter('[data-ui^=pull-pop-]').length > 0) return; //full popup �϶� return
                    // mod-date:1130:����ε��˾� ��Ŀ��
                    if ($popup.hasClass('loading')) {
                        $popup.find('.loading-cont .txt').attr({ tabindex: 0 }).focus();
                    }
                    //�˾� ������
                    if (!Layer.reOpen) {
                        Layer.reOpen = true;
                        console.log(tar, '�˾�����, 0.5�� �� open ��õ�');
                        setTimeout(function () {
                            Layer.open(tar, callback);
                        }, 500);
                    } else {
                        Layer.reOpen = false;
                        console.log(tar, '��õ��ص� �˾�����');
                    }
                }
            },
            close: function (tar, callback) {
                const $popup = $(tar);
                if (!$popup.hasClass(Layer.showClass)) return console.log(tar, '�ش��˾� �ȿ�������');
                const $id = $popup.attr('id');
                let $closeDelay = 510;
                let $callbackDelay = ($popup.hasClass('morphing')) ? 0 : 510;
                let $lastPop = '';
                const $visible = $('.' + Layer.popClass + '.' + Layer.showClass).length;


                if ($('.pg-wrap').length) $('.pg-wrap').removeAttr('aria-hidden');
                if ($('.pg-container').length) $('.pg-container').removeAttr('aria-hidden');

                Layer.openPop.splice(Layer.openPop.indexOf('#' + $id), 1);
                if (Layer.openPop.length) $lastPop = Layer.openPop[Layer.openPop.length - 1];
 
                 
                if ($visible == 1) {
                    if (!$popup.hasClass('morphing')) Body.unlock();
                    $(Layer.etcCont).removeAttr('aria-hidden');
                }
                if ($lastPop != '') $($lastPop).attr('aria-hidden', false);

                //������Ŀ��
                const $focusEvt = function () {
                    const $returnFocus = $popup.data('returnFocus');
                    if ($returnFocus != undefined) {
                        if($returnFocus.hasClass('btn-tooltip on')) $returnFocus.removeClass('on'); // mod-date:1010: ���� ��Ƽ�� Ŭ���� ����
                        $returnFocus.removeClass(Layer.focusedClass).focus();
                        //if ($returnFocus.hasClass('select-btn') && !$popup.data('no')) $returnFocus.closest('.form-ele').removeClass('focus'); //0824(smp0050101)
                        if ($returnFocus.hasClass('select-btn') && !$popup.data('no')) $returnFocus.closest('.form-ele').removeClass('focus');
                    } else {
                        //���� ��Ŀ���� ������
                        if ($('#header').length) {
                            if ($('.head-back').length) {
                                $('.head-back').focus();
                            } else {
                                $('#header').attr({ tabindex: 0 }).focus();
                            }
                        } else {
                            $('.pg-container').find($focusableEl).first().focus();
                        }
                    }
                    //0726: ��Ŀ�� ����
                    if($popup.data('no')) {
                        $('[data-ui=pop-open]').filter('[data-no='+$popup.data('no')+']').focus();
                    }
                };
                setTimeout(function () {
                    $focusEvt();
                }, 0);

                //�ݱ�
                $popup.removeClass(Layer.showClass).data('focusMove', false).data('popPosition', false);
                $popup.attr('aria-hidden', 'true').removeAttr('tabindex aria-labelledby');
                if ($popup.hasClass('no-motion')) $closeDelay = 10;

                const $closeAfter = function () {
                    $popup.removeAttr('style');
                    if ($popup.hasClass('is-swipe')) {
                        $popup.find('.' + Layer.wrapClass).removeAttr('style');
                        if ($popup.hasClass('full')) $popup.removeClass('full').addClass('bottom');
                    }
                    $popup
                        .find('.' + Layer.headClass)
                        .removeAttr('style')
                        .removeClass('shadow')
                        .find('h1')
                        .removeAttr('tabindex');
                    $popup.find('.' + Layer.bodyClass).removeAttr('tabindex style');
                    $popup.find('.' + Layer.focusInClass).removeAttr('tabindex');
                    if ($popup.find('.pop-close.last-focus').length) $popup.find('.pop-close.last-focus').remove();

                    // ���� �� ���������ϴ� ���
                    if ($popup.find('.' + Layer.closeRemoveClass).length) $popup.find('.' + Layer.closeRemoveClass).remove();

                    // �ݱ� �� �˾� ��ü�� �������� ���̽�
                    if ($popup.hasClass(Layer.alertClass) || $popup.hasClass(Layer.selectClass) || $popup.hasClass(Layer.removePopClass)) {
                        if ($popup.hasClass(Layer.selectClass)) Layer.isSelectOpen = false;
                        if ($popup.hasClass(Layer.alertClass)) {
                            const $content = $popup.find('.message>div').html();
                            Layer.beforeCont.splice(Layer.beforeCont.indexOf($content), 1);
                        }
                        $popup.remove();
                    }
                };
                setTimeout(function () {
                    $closeAfter();
                }, $closeDelay);

                setTimeout(function () {
                    //callback
                    if (!!callback) callback();

                    $popup.trigger('Layer.hide');
                }, $callbackDelay);
            },
            resize: function () {
                const $popup = $('.' + Layer.popClass + '.' + Layer.showClass);
                if (!$popup.length) return;
                const headHeight = function (headCont, contentCont) {
                    const $headH = headCont.children().outerHeight();
                    const $position = headCont.css('position');
                    const $padTop = parseInt(contentCont.css('padding-top'));
                    if ($headH > $padTop) {
                        contentCont.css('padding-top', $headH);
                    }
                };
                const footHeight = function (footCont, contentCont) {
                    const $footH = footCont.children().outerHeight();
                    const $padBottom = parseInt(contentCont.css('padding-bottom'));
                    if ($footH > $padBottom) {
                        contentCont.css('padding-bottom', $footH);
                    }
                };
                $popup.each(function () {
                    const $this = $(this);
                    const $wrap = $this.find('.' + Layer.wrapClass);
                    const $head = $wrap.find('.' + Layer.headClass);
                    const _headH = $head.length ? $head.outerHeight() : 0;
                    const $tit = $head.find('h1');
                    const $foot = $wrap.find('.' + Layer.footClass);
                    const $body = $wrap.find('.' + Layer.bodyClass);
                    const _bodyH = $body.find('.section').outerHeight();
                    let _footH = 0;

                    $head.removeAttr('style').removeClass('shadow');
                    if(!$this.data('height'))  $body.removeAttr('tabindex style'); //0823 ����

                    //���ҽ�Ʈ ���ÿ�ҷ� ��ũ��
                    if ($this.hasClass(Layer.selectClass) && $this.find('.selected').length && !$wrap.hasClass('scrolling')) {
                        const $headH = $head.outerHeight();
                        const $wrapH = $wrap.outerHeight();
                        const $wrapH2 = $wrap.get(0).scrollHeight;
                        const $selected = $wrap.find('.selected');
                        const $selectedH = $selected.outerHeight();
                        const $selectedTop = $selected.position().top;

                        if ($wrapH < $wrapH2) {
                            $wrap.addClass('scrolling');
                            const $sclTop = $selectedTop - $wrapH + $wrapH / 2 - $selectedH / 2 + $headH / 2;
                            $wrap.animate({ scrollTop: $sclTop }, 300, function () {
                                $wrap.removeClass('scrolling');
                            });
                        }
                    }
                });
            },
            fixed: function (el) {
                //  pop fixed
                const $wrap = $(el).hasClass(Layer.wrapClass) ? $(el) : $(el).closest('.' + Layer.wrapClass);
                const $head = $wrap.find('.' + Layer.headClass);
                const $foot = $wrap.find('.' + Layer.footClass);
                const $scrollTop = $wrap.hasClass(Layer.pageClass) ? $(window).scrollTop() : $wrap.scrollTop();
                const $scrollHeight = $wrap.hasClass(Layer.pageClass) ? $('body').get(0).scrollHeight : $wrap[0].scrollHeight;
                const $wrapHeight = $wrap.hasClass(Layer.pageClass) ? $(window).height() : $wrap.outerHeight();
                const $topClassName = 'pop-top-fixed';
                const $bottomClassName = 'pop-bottom-fixed';
                if ($head.length) {
                    if ($scrollTop > 0) {
                        $head.addClass($topClassName);
                    } else {
                        $head.removeClass($topClassName);
                    }
                }

                if ($foot.length) {
                   // console.log($scrollTop, $wrapHeight, $scrollHeight);
                    
                    if ($scrollTop + $wrapHeight >= $scrollHeight - 10) {
                        $foot.removeClass($bottomClassName);
                    } else {
                        $foot.addClass($bottomClassName);
                    }
                }
                const $fixed = $wrap.find('.pop-fixed');
                const $wrapTop = $wrap.position().top;
                if ($fixed.length) {
                    $fixed.each(function () {
                        const $this = $(this);
                        const $offsetTop = $this.data('top') !== undefined ? $this.data('top') : Math.max(0, getOffset(this).top);
                        const $topMargin = ui.Common.getTopFixedHeight($this, $topClassName);
                        let $topEl = $this;
                        const $top = $offsetTop - $wrapTop;
                        if ($scrollTop + $topMargin > $top) {
                            $this.data('top', $offsetTop);
                            $this.addClass($topClassName);
                            if ($topEl.css('position') !== 'fixed' && $topEl.css('position') !== 'sticky') $topEl = $topEl.children();
                            if ($topMargin !== parseInt($topEl.css('top')) && $topEl.css('position') === 'fixed') $topEl.css('top', $topMargin);
                            if ($head.hasClass($topClassName)) $head.addClass('no-shadow');
                        } else {
                            $this.removeData('top');
                            if ($topEl.css('position') !== 'fixed' && $topEl.css('position') !== 'sticky') $topEl = $topEl.children();
                            $topEl.removeAttr('style');
                            $this.removeClass($topClassName);
                            if (($head.hasClass($topClassName) && $wrap.find('.' + $topClassName).length === 1) || !$wrap.find('.' + $topClassName).length) $head.removeClass('no-shadow');
                        }
                    });
                }
            },
            position: function (tar) {
                const $popup = $(tar);
                if (!$popup.hasClass(Layer.showClass)) return false;
                if ($popup.data('popPosition') == true) return false;
                $popup.data('popPosition', true);
                let $wrap = $popup.find('.' + Layer.wrapClass);
                let $wrapH = $wrap.outerHeight();
                let $wrapSclH = $wrap[0].scrollHeight;
                const $head = $popup.find('.' + Layer.headClass);
                const $body = $popup.find('.' + Layer.bodyClass);
                const $foot = $popup.find('.' + Layer.footClass);
                const $footBtn = $foot.find('.button');
                Layer.fixed($wrap);
            },
            focusMove: function (tar) {
                if (!$(tar).hasClass(Layer.showClass)) return false;
                if ($(tar).data('focusMove') == true) return false;
                $(tar).data('focusMove', true);
                const $tar = $(tar);
                const $focusaEls = $tar.find($focusableEl);
                let $isFirstBackTab = false;

                $focusaEls.on('keydown', function (e) {
                    const $keyCode = e.keyCode ? e.keyCode : e.which;
                    const $focusable = $tar.find($focusableEl).not('.last-focus');
                    const $focusLength = $focusable.length;
                    const $firstFocus = $focusable.first();
                    const $lastFocus = $focusable.last();
                    const $index = $focusable.index(this);

                    $isFirstBackTab = false;
                    if ($index == $focusLength - 1) {
                        //last
                        if ($keyCode == 9) {
                            if (!e.shiftKey) {
                                $firstFocus.focus();
                                e.preventDefault();
                            }
                        }
                    } else if ($index == 0) {
                        //first
                        if ($keyCode == 9) {
                            if (e.shiftKey) {
                                $isFirstBackTab = true;
                                $lastFocus.focus();
                                e.preventDefault();
                            }
                        }
                    }
                });

                $tar.on('keydown', function (e) {
                    const $keyCode = e.keyCode ? e.keyCode : e.which;
                    const $focusable = $tar.find($focusableEl).not('.last-focus');
                    const $lastFocus = $focusable.last();

                    if (e.target == this && $keyCode == 9) {
                        if (e.shiftKey) {
                            $lastFocus.focus();
                            e.preventDefault();
                        }
                    }
                });

                $(document).on('focusin', $tar.selector + ' .last-focus', function (e) {
                    const $focusable = $tar.find($focusableEl).not('.last-focus');
                    const $firstFocus = $focusable.first();
                    const $lastFocus = $focusable.last();
                    if ($isFirstBackTab) {
                        $lastFocus.focus();
                    } else {
                        $firstFocus.focus();
                    }
                });
            },
            init: function () {
                if ($('.' + Layer.popClass + '.' + Layer.showClass + '[aria-hidden="true"]').length) {
                    Layer.open('.' + Layer.popClass + '.' + Layer.showClass + '[aria-hidden="true"]');
                }
                const $winpop = $('.' + Layer.wrapClass + '.' + Layer.pageClass);
                if ($winpop.length) {
                    Layer.page($winpop);
                }

                $(document).on('click', $focusableEl, function (e) {
                    Layer.openEl = e.currentTarget;
                });
                setTimeout(function () {
                    Layer.openEl = '';
                }, 100);


                //����
                $(document).on('click', '[data-ui=pop-open]', function (e) {
                    e.preventDefault();
                    $currentTarget = $(e.currentTarget);
                    let $btnTooltip = $('[data-ui=tooltip]'); // mod-date:1010: 
                    let $tooltipWrap = $('.tooltip-wrap');

                    //�����˾�
                    if($currentTarget.filter('[data-no]').length > 0) {
                        let $dataNo = $currentTarget.data('no');
                        let $popFoot = $('.stream-wrap').eq($dataNo).find('.pop-foot');

                        if ($currentTarget.data('no') === 0) {
                            $('.stream-wrap').find('.pop-foot').children('.btns').show();
                        } else {
                            $popFoot.find('[data-ui=pop-close]').remove();
                            $popFoot.children('.btns').hide();
                            $popFoot.append('<div class="btns"><button type="button" class="btn primary lg" data-ui="pop-close">Ȯ��</button></div>');
                        }
                        $(`${Layer.openPop}`).find('.stream-wrap').hide().eq($dataNo).css('display', 'flex').show(); 
                    } 

                    if ($currentTarget.is('.btn-tooltip')) $currentTarget.addClass('on');
                    if ($tooltipWrap) {
                        $tooltipWrap.hide();
                        $btnTooltip.removeClass('on'); // mod-date:1010
                        //$currentTarget.addClass('on');
                    }
                    setTimeout(function () {
                        $('.alarm-box.on').find('.txt').attr('tabIndex', 0).focus();
                    }, 0);
                });

                //�˾� �ݱ� - mod-date:0918 : .off('click', '[data-ui=pop-close], .pop-close') �߰�
                $(document).off('click', '[data-ui=pop-close], .pop-close').on('click', '[data-ui=pop-close], .pop-close', function (e) {
                    e.preventDefault();
                    let $pop = $(this).attr('href');
                    
                    $('.pg-wrap').find('.pg-footer').removeClass('nofix'); //0918 ���߹�ư ���� �׽�Ʈ

                    if ($pop == '#' || $pop == '#none' || $pop == undefined) $pop = $(this).closest('.' + Layer.popClass);
                    if ($pop.length) Layer.close($pop);

                    if($(this).closest('.alarm-box').is('.on')) {
                        const $box = $(this).closest('.alarm-box');
                        $box.removeClass('on');
                        $box.on('transitionend', function () {
                            $(this).remove();
                        });
                    };
                    
                    if($('.stream-wrap').length > -1) $pop.find('.stream-wrap').hide().eq(0).show().css('display', 'flex'); //�����˾�

/*                     try {
                        if(!$currentTarget.is('.ui-select-open.on')) $currentTarget.removeClass('on');
                    } catch {}; *//* 0824: �����׽�Ʈ�� */
                    //$currentTarget.removeClass('on');
                    //$currentTarget.focus(); (2/24 �׽�Ʈ�� : 2741���� ������Ŀ���� �ߺ���)
                });

                // Layer.keyEvt();
                // Layer.selectUI();
                Layer.BottomChkSelect();

                $(document).on('click', '[data-popup]', function (e) {
                    e.preventDefault();
                    const $popup = $(this).data('popup');
                    Layer.load($popup, 'full');
                });
                $(document).on('click', '[data-popup-full]', function (e) {
                    e.preventDefault();
                    const $popup = $(this).data('popup-full');
                    Layer.load($popup, 'full');
                });
                $(document).on('click', '[data-popup-modal]', function (e) {
                    e.preventDefault();
                    const $popup = $(this).data('popup-modal');
                    Layer.load($popup, 'modal');
                });
                $(document).on('click', '[data-popup-bottom]', function (e) {
                    e.preventDefault();
                    const $popup = $(this).data('popup-bottom');
                    Layer.load($popup, 'bottom');
                });
                $(document).on('click', '[data-popup-left]', function (e) {
                    e.preventDefault();
                    const $popup = $(this).data('popup-left');
                    Layer.load($popup, 'side-left');
                });
                $(document).on('click', '[data-popup-right]', function (e) {
                    e.preventDefault();
                    const $popup = $(this).data('popup-right');
                    Layer.load($popup, 'side-right');
                });
            },
            /*  setScrollBetweenTop
            *   20220826: �¿� ���� ��Ͽ� ���ð��� �ִ� ��� �ش� ��ұ��� �ڵ� ��ũ�� ó��
            */
            /* setScrollBetweenTop: function () {
                if ($('.scroll-between-wrap').length > 0) {
                    $(".scroll-between-wrap ul.list").each(function () {
                        let selectedElem = $(this).find('.sel');
                        // 20220831: ��ũ�� ��ġ ����
                        let scrollTo = $(this).scrollTop() + selectedElem.position().top;
                        if (selectedElem.length === 1) {
                            // 1�� ��Ҹ� ���õǾ� �ִٸ�
                            $(this).animate({ scrollTop: scrollTo }, 300);
                        }
                    });
                }
            } */
            // setScrollBetweenTop -->
        };

        //���̾��˾�(full)
        let uiFullpop = {
            obj: {},
            arr:[],
            delay: 100,
            length: 0,
            init: function(type) {
                const $this = uiFullpop;
                $('[data-ui=full-open]').each(function() {
                    let obj = this.dataset;
                    if(!(obj.target in $this.obj)) {
                        obj['direction'] = $(this).data('targetMove') ? $(this).data('targetMove') : 'left';
                        $this.obj[obj.target] = obj;
                        if(obj.href) $this.load(obj)
                    }
                })
                $this.length = $('[data-ui=full-open]').length;
                $this.events();
            },
            load: function(obj) {
                const $this = uiFullpop;
                let url = obj.href;
                if(url) {
                    $.ajax({
                        url: url,
                    })
                    .done(function(result) {
                        let html = result;
                        let $wrap = $('#'+obj.target).length ? $('#'+obj.target):$('body');
                        $wrap.append(html)
                        $('#'+obj.target).attr('data-move', obj.direction);
                    })
                    .fail(function(result){
                        console.log('err >>', result.statusText)
                    });
                }
            },
            open: function(e) {
                const $this = uiFullpop;
                let delay = $this.delay ? $this.delay : 100;
                let $target = $(`#${e.target.dataset.target}`);
                let $prev = $(e.target).parents('[data-move]');
                if($this.length != $('[data-ui=full-open]').length) $this.init('reload');
                
                
                // Ȱ��ȭ �Ǿ� �ִ� Ǯ�˾� ����
                $this.arr = $this.arr.filter((_id)=>_id !== e.target.dataset.target);
                $this.arr.push(e.target.dataset.target);
                let zIndex = 100;
                $target.css('z-index', zIndex+this.arr.length)

                setTimeout(function() {
                    $target.addClass('show');
                    $target.removeClass('quick');
                    $target.find('.pg-gnb .ht-1').focus();
                    $prev.css('z-index', zIndex);
                    Body.lock();
                }, delay);

                // css ���Ͽ� ���� �Ǿ� �ִ� transition-duration �ð� * 2 �ڿ� �����ؾ� �ڿ�������
                setTimeout(function() {$target.siblings().removeClass('show')}, delay * 5); 
            },
            close: function(e, callback) {
                const $this = uiFullpop;
                const _t = e.target ? e.target : e;
                const _id = $(_t).parents('.pg-wrap.full').attr('id');
                const $target = $(_t).parents('.pg-wrap.full');
                if($this.arr && $this.arr[$this.arr.length-2]) {
                    $('#'+$this.arr[$this.arr.length-2]).addClass('show quick');
                    $this.arr.pop();
                }else {
                    $this.arr = [];
                }
                $target.removeClass('show quick');
                $target.css('z-index', parseInt($target.css('z-index')-1));
                $(`[data-target="${_id}"]`).first().focus();
                if(!$target.siblings().hasClass('show')) Body.unlock();
                if(callback) callback();
            },
            clear: function(e, callback) {
                const $this = uiFullpop;
                $this.arr.forEach((_id)=>{
                    $(`#${_id}`).removeClass('show quick');
                });
                $(`[data-target="${$this.arr[0]}"]`).first().focus();
                $this.arr = [];
                Body.unlock();
                if(callback) callback();
            },
            events: function() {
                const $this = uiFullpop;
                $(document).off('.popupEvent')
                .on('click.popupEvent', '[data-ui=full-open], [data-ui=full-close]', e => {
                    e.preventDefault();
                    if(e.target.dataset.ui == 'full-open') {
                        $this.open(e)
                    }else {
                        $this.close(e)
                    }
                });
            }
        };

        let uiSwiper = {
            base: function (tar, changeEvt) {
                $(tar).each(function () {
                    const $this = $(this);
                    const $swiper = $this.find('.swiper');
                    const $pagination = $this.find('.swiper-pagination');
                    let $events = {};
                    if ($this.data('events')) {
                        let funcName = $this.data('events');
                        try {
                            $events = eval(`${funcName}();`);
                        } catch (e) {
                            // console.log("", funcName, " �Լ��� ã�� �� �����ϴ�.");
                            $events = {};
                        }
                    }
                    // console.log("custom events -->", $events);

                    let $paginationType = 'bullets';
                    if ($this.hasClass('-fraction')) $paginationType = 'fraction';

                    let $navigation = false;
                    if ($this.hasClass('-nav')) {
                        let $btnHtml = '';
                        $btnHtml += '<button type="button" aria-label="���� �����̵�" class="swiper-button-prev swiper-button"><span class="hidden">���� �����̵�</span></button>';
                        $btnHtml += '<button type="button" aria-label="���� �����̵�" class="swiper-button-next swiper-button"><span class="hidden">���� �����̵�</span></button>';
                        if(!$swiper.find('.swiper-button').length) $swiper.append($btnHtml);
                        $navigation = {
                            prevEl: $this.find('.swiper-button-prev')[0],
                            nextEl: $this.find('.swiper-button-next')[0]
                        };
                    }

                    let $slidesPerView = 'auto', isFreeMode = false;
                    if ($this.data('view') !== undefined) {
                        $slidesPerView = $this.data('view');
                        isFreeMode = $this.data('view') == 'auto';
                        $this.removeAttr('data-view');
                    }

                    let $spaceBetween = 0;
                    if ($this.data('space') !== undefined) {
                        $spaceBetween = $this.data('space');
                        $this.removeAttr('data-space');
                    }

                    let $loop = $this.hasClass('-loop') ? true : false;
                    let $autoHeight = $this.hasClass('-autoHeight') ? true : false;
                    let $centeredSlides = $this.hasClass('-center') ? true : false;

                    let $auto = false;

                    if ($this.data('auto') !== undefined) {
                        $auto = {
                            delay: $this.data('auto'),
                            disableOnInteraction: false
                        };
                        $this.removeAttr('data-auto');
                        if (!$this.find('.swiper-auto-ctl').length) {
                            if (!$this.find('.swiper-pagination-wrap').length) $pagination.wrap('<div class="swiper-pagination-wrap"></div>');
                            $pagination.after('<button type="button" class="swiper-auto-ctl" aria-label="�����̵� �ڵ��Ѹ� ����"></button>');
                        }
                    }
                    let $parallax = false;
                    if (
                        $this.find('[data-swiper-parallax]').length ||
                        $this.find('[data-swiper-parallax-x]').length ||
                        $this.find('[data-swiper-parallax-y]').length ||
                        $this.find('[data-swiper-parallax-scale]').length ||
                        $this.find('[data-swiper-parallax-opacity]').length
                    ) {
                        $parallax = true;
                    }

                    // 2022-08-19: �����̵� ������ �߰�
                    let $slidesOffset = $this.data('offset') ? $this.data('offset') : 0;
                    $this.removeAttr('data-offset');

                    let baseSwiper;
                    let newGuideTime;
                    if($this.find('.swiper-slide').length == 1 && $this.hasClass('img-banner')) {
                        $this.addClass('no-swiper');
                    } else if($swiper.hasClass('swiper-initialized')) {
                        baseSwiper = $this.data('swiper');
                        if (baseSwiper !== undefined) baseSwiper.update();
                    } else if($swiper.find('.swiper-slide').length > 1){
                        let _title = $this.data('title');
                        // 0609 [���ټ�]
                        let setSlideAriaLabel = (e) => {
                            if($(e.pagination.$el).length && $paginationType == 'fraction') {
                                let current = $(e.pagination.$el).find('.swiper-pagination-current').text();
                                let total = $(e.pagination.$el).find('.swiper-pagination-total').text();
                                $(e.pagination.$el).attr({
                                    'aria-label': `${total}���� �����̵� �� ${current}��° �Դϴ�`,
                                    'role' : 'text',
                                    'tabindex' : '0'
                                })
                            }
                            // e.$wrapperEl.attr('tabindex', 0)
                            $(e.slides).removeAttr('aria-label').attr({'aria-hidden':true}).each(function(i) {
                                // if(i == e.realIndex) $(this).attr('title','���õ�');
                                // else $(this).removeAttr('title');
                                if(isFreeMode) {
                                    // if($(this).offset().left >= 0 && $(this).offset().left < $(window).width()) {
                                    //     $(this).attr({'aria-hidden':false});
                                    // }
                                    // mod-date:1130:��ü�޴����� ȭ�� �� �����̵嵵 ���� ���� �����ϵ��� ����
                                    $(this).attr({'aria-hidden':false});
                                }else {
                                    if(i == e.activeIndex) $(this).attr({'aria-hidden':false});
                                }
                            })
                        }
                        baseSwiper = new Swiper($swiper[0], {
                            pagination: {
                                el: '.swiper-pagination',
                                type: $paginationType,
                                clickable: true,
                                renderBullet: function (index, className) {
                                    return '<button type="button" class="' + className + '"><span class="hidden">' + ((_title !== undefined) ? _title + ' ' : '') + (index + 1) + '��° �����̵�</span></button>';
                                }
                            },
                            navigation: $navigation,
                            slidesPerView: $slidesPerView,
                            spaceBetween: $spaceBetween,
                            // 2022-08-19: �����̵� ������ �߰�
                            slidesOffsetBefore: $slidesOffset,
                            slidesOffsetAfter: $slidesOffset,
                            loop: $loop,
                            autoHeight: $autoHeight,
                            centeredSlides: $centeredSlides,
                            autoplay: $auto,
                            parallax: $parallax,
                            noSwipingClass: 'no-swiping',
                            on: {
                                slideChangeTransitionEnd: function (e) {
                                    // [S] main ���� �������� ���� callback �߰�
                                    this.$el.find('.swiper-slide').each(function () {
                                        let _this = $(this);
                                        if (_this.parents().hasClass('main-account-section') && _this.is('.swiper-slide-active')) {
                                            if (window.SPA_COMMON) {
                                                window.SPA_COMMON.callbackWithSPA('onMainSwiperChange', _this);                                                
                                            }
                                        }
                                        if (_this.closest('.m-kb-youtube').length) {
                                            if (window.SPA_COMMON) {
                                                window.SPA_COMMON.callbackWithSPA('onMainSub2SwiperChange', _this);
                                            }
                                        }
                                    });
                                    // [E] main ���� �������� ���� callback �߰�

                                    // ���ټ� ����
                                    // $(e.slides).attr({'tabindex':'-1', 'aria-hidden':'true'}).filter('.swiper-slide-active').removeAttr('tabindex aria-hidden');
                                    setSlideAriaLabel(e);
                                    this.$el.find('.swiper-pagination-bullet').removeAttr('title');
                                    this.$el.find('.swiper-pagination-bullet').eq(e.realIndex).attr('title','���õ�');

                                    if (!!changeEvt) changeEvt(e);
                                },
                                afterInit : function(e){
                                    // ���ټ� ����
                                    // $(e.slides).removeAttr('aria-label').not('.swiper-slide-active').attr({'tabindex':'-1', 'aria-hidden':'true'});
                                    setSlideAriaLabel(e);
                                    this.$el.find('.swiper-pagination-bullet').eq(e.realIndex).attr('title','���õ�');
                                },
                               // ...$events
                            }
                        });
                        $this.data('swiper', baseSwiper);
                        // $(baseSwiper.$wrapperEl).attr('tabindex', 0) // mod-date:1017:[���ټ�] ���ʿ��� �ε��� ����

                        //2202-08-24 �߰�
                        if ($(baseSwiper.wrapperEl).filter("[data-bubble='false']").length) {
                            $this.on('touchstart', function (e) {
                                UICommon.tabMenu.tabSwipeArray[0].allowTouchMove = false;
                                baseSwiper.allowTouchMove = true;
                            });
                        }
                    }
                    if($swiper.find('.swiper-slide').length > 1) $this.find('.swiper-pagination-wrap, .swiper-button').show();
                    else $this.find('.swiper-pagination-wrap, .swiper-button').hide();
                });
            },
            ready: function (tar) {
                const $target = $(tar);
                $target.each(function () {
                    const $this = $(this);
                    if ($this.find('.swiper-slide').length) {
                        let $children = $this.children();
                        while ($children.hasClass('swiper') || $children.hasClass('swiper-wrapper')) {
                            $children = $children.children();
                        }
                        $children.addClass('swiper-slide');
                    }

                    if (!$this.find('.swiper-wrapper').length) {
                        if (!$this.find('.swiper').length) {
                            $this.wrapInner('<div class="swiper-wrapper"></div>');
                            $this.wrapInner('<div class="swiper"></div>');
                        } else {
                            $this.find('.swiper').wrapInner('<div class="swiper-wrapper"></div>');
                        }
                    } else if (!$this.find('.swiper').length) {
                        $this.find('.swiper-wrapper').parent().wrapInner('<div class="swiper"></div>');
                    }
                    if (!$this.find('.swiper-pagination').length) {
                        $this.append('<div class="swiper-pagination"></div>');
                    }
                });
            },
            UI: function () {
                $(document).off('click', '.ui-swiper .swiper-auto-ctl').on('click', '.ui-swiper .swiper-auto-ctl', function (e) {
                    e.preventDefault();
                    const $this = $(this);
                    const $closest = $this.closest('.ui-swiper');
                    const $swiper = $closest.data('swiper');
                    if ($(this).hasClass('play')) {
                        $swiper.autoplay.start();
                        $(this).removeClass('play').changeAriaLabel('����', '����');
                    } else {
                        $swiper.autoplay.stop();
                        $(this).addClass('play').changeAriaLabel('����', '����');
                    }
                });
            },
            update: function (target) {
                $(target).each(function () {
                    const $this = $(this);
                    const $swiper = $this.data('swiper');
                    if ($swiper !== undefined) $swiper.update();
                });
            },
            destroy: function (target) {
                $(target).each(function () {
                    const $this = $(this);
                    const $swiper = $this.data('swiper');
                    if ($swiper !== undefined) $swiper.destroy();
                });
            },
            init: function (target, changeEvt) {
                target = target !== undefined ? target : '.ui-swiper';
                if($(target).length) {
                    uiSwiper.ready(target);
                    uiSwiper.base(target, changeEvt);
                    uiSwiper.UI();
                }
            }
        };

        let uiEffect = { //Button Ripple Motion
            button: function () {
                //let btnList = 'a.btn:not(.link, [class*=ico-]), button.btn:not(.link, [class*=ico-])';
                let btnList = '.btn[class*=primary], .btn.secondary, .btn.point, .btn[class*=outline]';
                $(document).on('click', btnList, function (e) {
                    let $btnEl = $(this),
                        $delay = 650;

                    if (!$btnEl.is('.disabled')) {
                        if (!$btnEl.find('.btn-click-in').length) $btnEl.append('<em class="btn-click-in"></em>');
                        let $btnIn = $btnEl.find('.btn-click-in'),
                            $btnMax = Math.max($btnEl.outerWidth(), $btnEl.outerHeight()),
                            $btnX = e.pageX - $btnEl.offset().left - $btnMax / 2,
                            $btnY = e.pageY - $btnEl.offset().top - $btnMax / 2;
                        $btnIn.css({
                            'left': $btnX,
                            'top': $btnY,
                            'width': $btnMax,
                            'height': $btnMax
                        }).addClass('animate').delay($delay).queue(function (next) {
                            $btnIn.remove();
                            next();
                        });
                    }
                });
            },
            init: function (target) {
                uiEffect.button();
            }
        };

        let uiDate = {
            set: function(opt) {
                let options = Object.assign({
                    el : null,
                    format: 'YYYY.MM.DD',
                    beginYear: 2000,
                    endYear: 2100,
                    baseEl: '.pg-wrap',
                    cancel: function() {
                        Body.unlock();
                    },
                    confirm: function(value) {
                        Body.unlock();
                    }
                }, opt);
                let baseDate = new Date($(options.el).text().replace(/\D/g, "\/"));
                if(baseDate != 'Invalid Date') options.value = $(options.el).text();
                if(options.format == undefined) options.format = 'YYYY.MM.DD';
                Body.lock();
                return new Rolldate(options);
            }
        }

        /* [data-ui=uiStep] ���� ���� üũ�ڽ� ���������� �̵� */
        let uiStep = {
            options: {
                wrap: '.pg-wrap',
                cont: '.prod-chk',
                input: '.prod-chk-wrap input:visible',
                btn: '.pg-footer .btn',
                status: '.step-status',
            },
            init: function(opt) {
                if(!$('[data-ui=uiStep]').length) return false;
                const _this = uiStep;
                _this.options = Object.assign(_this.options, opt);

                if (!$('.check-msg').length) { //0920 'Ȯ�����ּ���' �߰�
                    $('[data-ui=uiStep] .prod-chk-wrap').find('.prod-chk').eq(0).find('.form-sel').eq(0).prepend('<span class="check-msg">Ȯ�����ּ���</span>'); 
                }
                $('[data-ui=uiStep]').each(function() {
                    _this.set($(this)); // ���ټ� �� ȭ�� ����
                    _this.status($(this)); // �ϴܹ�ư üũ�ڽ� ���� ���� üũ
                    _this.goto($(this)); // ���� üũ�ڽ� ��ġ��
                    _this.event($(this));
                })
            },
            set: function($uiStep) {
                const _this = uiStep;
                const options = _this.options;
                const $stepWrap = $uiStep.parents(options.wrap);
                const $inputs = $uiStep.find(options.input);
                let input = $inputs.map(function(i) {
                    $(this).attr({'data-step': i})
                    // s:mod-date:1027:[���ټ�] üũ�ڽ� => ��ư�ڽ�, 1212: [���ټ�] �����
/*                     $(this).attr({'aria-hidden':'true'})
                    $(this).parents(options.cont).attr({'tabindex': 0, 'role': 'button', 'title': $(this).attr('aria-label'), 'for': $(this).siblings('label').attr('for')}) */
                    /* 1221 [���ټ�] s */
                    //$(this).attr({'aria-hidden':'true'})
                    $(this).attr({'role':'text'}).siblings('.label').attr({'role':'text'}).removeAttr('aria-hidden');
                    $(this).parents(options.cont).attr({'role': 'button', 'aria-label': $(this).parents(options.cont).is('.on') ? '���õ�. ' + $(this).parents(options.cont).text() : ''});
                    /* 1221 [���ټ�] e */
                    $(this).removeAttr('aria-label');
                    // e:mod-date:1027:[���ټ�] üũ�ڽ� => ��ư�ڽ�
                });
                if(!$stepWrap.find(options.status).length) {
                    $stepWrap.find(options.btn).append(` <span class="${options.status.replace('.','')}">(${input.length}/${$inputs.length})</span>`)
                }
            },
            status: function($uiStep) {
                const _this = uiStep, options = _this.options;
                const $stepWrap = $uiStep.parents(options.wrap);
                const $inputs = $uiStep.find(options.input), $wrap = $(options.wrap);
                let input = $inputs.map(function(i) {
                    // $(this).parents(options.cont).attr({'aria-checked': this.checked})
                    // if($(this).offset().top + $(this).parents(options.cont).height() < $wrap.height() && this.checked) return this;
                    if(this.checked) return this;
                });
                $stepWrap.find(options.status).html(`(${input.length}/${$inputs.length})`)
                return input;
            },
            prev: function($uiStep) {
                const _this = uiStep, options = _this.options;
                const $inputs = $uiStep.find(options.input);
                let input = $inputs.filter((idx,el)=>!el.checked);
                return $(input[0]);
            },
            next: function($uiStep) {
                const _this = uiStep, options = _this.options;
                const $inputs = $uiStep.find(options.input);
                let input = $inputs.filter((idx,el)=>el.checked);
                let nextIdx = Number($(input).eq(input.length-1).attr('data-step')) < $inputs.length ? Number($(input).eq(input.length-1).attr('data-step')) + 1 : $inputs.length;
                return $inputs.eq(nextIdx);
            },
            goto: function($uiStep, $target) {
                const _this = uiStep;
                const options = _this.options;
                const $stepWrap = $uiStep.parents(options.wrap);
                let st = 0, sat =  parseInt($stepWrap.css('--sat')) ? parseInt($stepWrap.css('--sat')) : 0;
                if($target && $target.parents(options.cont).index()> -1) {
                    st = $target.parents(options.cont).index() ? $target.offset().top - $('.pg-header').height() - 30 : $target.offset().top - $('.pg-header').height() - 100
                    $('html, body').animate({
                        scrollTop: st - sat // 0831 : ��ġ�� ����
                    })
                    $target.parents(options.cont).focus();
                    _this.status($uiStep)
                }else {
                    if($uiStep.find(options.input).length == _this.status($uiStep).length) {
                        $stepWrap.find(options.btn).addClass('complete').html('��� Ȯ���߾��').focus();
                    }else {
                        if($target && _this.prev($uiStep).length) {
                            $target = _this.prev($uiStep);
                            st = $target.parents(options.cont).index() ? $target.offset().top - $('.pg-header').height() - 30 : $target.offset().top - $('.pg-header').height() - 100
                        }
                        $('html, body').animate({
                            scrollTop: st - sat // 0831 : ��ġ�� ����
                        })
                        if($target) $target.parents(options.cont).focus();
                    }
                }
            },
            event: function($uiStep) {
                const _this = uiStep;
                const options = _this.options;
                $uiStep.off('click change', options.cont).on('click change', options.cont, function(e) { //1221 [���ټ�]
                    // üũ�ڽ�
                    // e.preventDefault(); // mod-date:1027:[���ټ�] üũ�ڽ� => ��ư�ڽ�
                    let $input = $(this).find('input');
                    $('.check-msg').remove(); //0920 'Ȯ���ϼ���' �߰�
                    $(this).addClass('on').attr('aria-label', '���õ�. ' + $(this).text()) // mod-date:1128: [���ټ�] '���õ�' �߰�, 1212: [���ټ�] �����
                    if($input.hasClass('already')) return false;
                    $input.prop('checked', true);
                    $input.addClass('already').attr('disabled',true); // mod-date:1018: [���ټ�]
                    _this.goto($uiStep, _this.next($uiStep))
                })
                $uiStep.parents(options.wrap).off('click', options.btn).on('click', options.btn, function(e) {
                    // �ϴܹ�ư
                    if($(this).hasClass('complete')) return false;
                    let $target = _this.next($uiStep).length ? _this.next($uiStep) : _this.prev($uiStep);
                    if($target.length) {
                        let top = $target[0].getBoundingClientRect().top;
                        if(top < 0 || top > $(window).height()) {
                            _this.goto($uiStep, $target);
                        }else {
                            $target.parents(options.cont).trigger('click')
                        }
                    }else {
                        _this.goto($uiStep);
                    }
                })
            }
        }

        //�ε�
        let loading = {
            interval: null,
            init: function () {
                loading.loadingChangeTxt();
            },
            clear: function() {
                clearInterval(loading.interval);
            },
            loadingChangeTxt: function() { //�ؽ�Ʈ ���� ����
                //0726: �ε�����¡ �����Ǵ� ���̽� ����
                if($('.loading').find('.change-ani')) {
                    let idx = 1, $wrap = null;
                    $('.loading').each(function() {
                        if($(this).is(':visible')) {
                            $wrap = $(this);
                            loading.clear();
                            loading.interval = setInterval(changeTxt, 4000);
                        }
                    })
                    function changeTxt() {
                        let $txt = $wrap.find('.change-ani').find('.txt');
                        $txt.hide().animate({'opacity': 0}, 200);
                        $txt.eq(idx).show().animate({'opacity': 1}, 500);
                        idx++;
                        if (idx >= $txt.length) idx=1;
                    }
                }
            }
        }

        // apng 
        let apng = {
            init: function () {
                apng.repack();
            }, 
            repack: function() {
                let eleBe = $(".result.success");
                if (eleBe.length) {
                    eleBe
                        .prepend('<img src="/pub/assets/img/common/ani-success.png" alt="" class="load-img">');
                    let $img = $('.load-img');
                    $img.attr('src', $img.attr('src') + "?" + Date.now());
                }
            }
        }

        /** uiAnimation */
        let uiAnimation = {
            /**
             * @param {array} targetArray (�ʼ�) �ִϸ��̼� Ÿ�� Ŭ����
             * @param {number} threshold Ŭ���� �߰� ����(0~1)
             * @param {string} className default(animated)
             */
            init: function(targetArray, threshold, className) {
                threshold = threshold?threshold:0.2;
                className = className?className:'animated';
                this.set();
                $(window).on('scroll.startAni', () => {
                    if($(window).scrollTop() < $(window).height()/2) {
                        targetArray.forEach((_className)=>{
                            if(typeof _className == 'string') {
                                document.querySelectorAll(_className).forEach((e, i) => {
                                    this.check(threshold, className).observe(e)
                                })
                            }
                        })
                        $(window).off('scroll.startAni');
                    }
                    
                }).scroll();
            },
            check: function(threshold, className) {
                return new IntersectionObserver((entries, observe) => {
                    entries.forEach(entry=>{
                        if(!entry.isIntersecting) return;
                        $(entry.target).addClass(className)
                    })
                },{
                    rootMargin: `0px 0px -${threshold*100}% 0px`,
                });
            },
            set: function() {
                // point ����
                document.querySelectorAll('.tag-pt').forEach((el, i)=>{
                    el.innerHTML = "Point "+(i+1);
                })
            }
        }

        // �������� : MSB_INQ_17_004, MSB_INQ_17_005
        let uiSortable = {
            cache: [], // mod-date:0925: �迭�� ����
            options: {
                el: '[data-ui="uiSortable"]',
                axis: 'y',
                handle: 'button.drag-btn',
                cancel: '',
                start: function(e, ui) {
                    $('.is-dragged').removeClass('is-dragged')
                    $(ui.item).addClass('is-dragging')
                    let clone = $(ui.item).html();
                    placeholderHeight = ui.item.height();
                    ui.placeholder[0].innerHTML = clone;
                    ui.placeholder[0].style.visibility = 'visible';
                },
                update: function(e, ui) {
                    $(ui.item).removeClass('is-dragging').addClass('is-dragged').removeAttr('style');
                }
            },
            // mod-date:0925: ����� ��Ͽ��� ����� �ݹ��Լ�
            outCallBack: function(callback) {
                this.options.
                    stop = function(e, ui){
                        const top = $(this).offset().top;
                        const height = $(this).height();
                        const itemHeight = ui.item.height() / 3; // ���� ���� ����
                        if (ui.offset.top < top - itemHeight || ui.offset.top > top + height - itemHeight) {
                            setTimeout(function () {
                                //callback
                                if (typeof callback === 'function') callback();
                            }, 0);
                        }
                    }
                this.init()
            },
            init: function(opt) {
                this.options = Object.assign(this.options, opt);
                if(!$(this.options.el).length) return;
                let sortTypeClass = $('[data-sort=drag]').hasClass('on') ? 'sort-type-drag':'sort-type-arrow';
                uiSortable.cache = Array($(this.options.el).length);
                $(this.options.el).each(function(index, item) {
                    uiSortable.cache[index] = $(item).html();
                })
                $(this.options.el).addClass(sortTypeClass).sortable(this.options).disableSelection();
                this.set().event();
            },
            set: function() {
                let isArrow = $('.sel-swap-wrap').find('.on').data('sort') == 'arrow';
                $(this.options.el).find('li .up-down button').prop('disabled', false)
                if(isArrow) {
                    $(this.options.el).find('> li:first-child').find('[data-sort="up"]').prop('disabled', true)
                    $(this.options.el).find('> li:last-child').find('[data-sort="down"]').prop('disabled', true)
                }
                return this;
            },
            refresh: function() {
                // $(this.options.el).html(this.cache).sortable('refresh');
                $(this.options.el).each(function(index, item) {
                    $(item).html(uiSortable.cache[index])
                })
                return this;
            },
            transform: function($item, value) {
                $item.css({
                    transform : `translateY(${value}px)`,
                    transition: `transform .4s`
                })
                return this;
            },
            event: function() {
                const sortUpDown = function($item, isUp) {
                    const $this = $(event.target);
                    const $targetItem = isUp ? $item.prev(): $item.next();
                    const index = $item.index();
                    const animationSpeed = 300;

                    $item.addClass('is-dragging is-dragged').siblings().removeClass('is-dragged')
                    $targetItem.addClass('is-dragging')
                    if(isUp && index !== 0) {
                        uiSortable.transform($item, $targetItem.outerHeight()*-1);
                        uiSortable.transform($targetItem, $item.outerHeight());
                        
                    }else if(!isUp && index !== $(uiSortable.options.el).children().length - 1){
                        uiSortable.transform($item, $targetItem.outerHeight());
                        uiSortable.transform($targetItem, $item.outerHeight()*-1);
                    }
                    setTimeout(()=>{
                        $item.removeAttr('style').removeClass('is-dragging')
                        $targetItem.removeAttr('style').removeClass('is-dragging')
                        if(isUp) $item.insertBefore($targetItem)
                        else $item.insertAfter($targetItem)

                        // ���ټ�
                        uiSortable.set();
                        if($this.is('[disabled]')) $this.siblings('button').focus();
                        else $this.focus();
                    }, animationSpeed)
                }
                const sortType = function($this, type) {
                    let otherType = 'sort-type-arrow sort-type-drag'.replace(`sort-type-${type}`,'');
                    $(uiSortable.options.el).removeClass(otherType).addClass(`sort-type-${type}`);
                    $this.addClass('on').siblings().removeClass('on');
                }
                $(document).off('click', '[data-sort]').on('click', '[data-sort]', function() {
                    switch($(this).data('sort')) {
                        case 'up' : sortUpDown($(this).closest('li'), true);break;
                        case 'down' : sortUpDown($(this).closest('li'), false);break;
                        case 'drag' : sortType($(this), 'drag');break;
                        case 'arrow' : sortType($(this), 'arrow');uiSortable.set();break;
                        case 'reset' : uiSortable.refresh().set();break;
                    }
                })
            }
        }

        //body scroll lock
        let Body = {
            scrollTop: '',
            lock: function () {
                if (!$('html').hasClass('lock') && $('.pg-wrap').length) {
                    Body.scrollTop = window.pageYOffset;
                    const $wrap = $('.pg-wrap');
                    const $wrapTop = $wrap.length ? $wrap.offset().top : 0;
                    const $setTop = Body.scrollTop * -1 + (($wrap.hasClass('full')) ? 0 : $wrapTop);
                    $wrap.not('.full').css('top', $setTop);
                    if ($wrap.length) $('html').addClass('lock');

                    if($wrap.find('.pg-footer').length) $wrap.find('.pg-footer').addClass('nofix');
                }
            },
            unlock: function () {
                if ($('html').hasClass('lock') && $('.pg-wrap').length) {
                    $('html').removeClass('lock');
                    
                    $('.pg-wrap').find('.pg-footer').removeClass('nofix');

                    $('.pg-wrap').not('.full').removeAttr('style');
                    window.scrollTo(0, Body.scrollTop);
                    window.setTimeout(function () {
                        Body.scrollTop = '';
                    }, 0);
                }
            }
        };

        //��ǰ�ȳ� ��ũ�� bg ����
        let prodIntroAni = {
            options: {
                el: '.prod-intro'
            },
            init: function() {
                if(!$(this.options.el).length) return;
                this.event();
                _front.scroll();
            },
            event: function() {
                $(window).off('scroll').on('scroll', function () {
                    // let $cascadeWrapTop = $('.prod-intro .cascade-wrap').offset().top;
                    let $visualH = $('.prod-intro .focus-visual').innerHeight();
                    let $wTop = $(window).scrollTop();

                    $wTop > $visualH ? $('.pg-gnb').removeClass('on') : $('.pg-gnb').addClass('on');
                });
            }
        };

        //�ŷ�������ȸ ��ũ�� ����
        let transListAni = {
            options: {
                el: '.visual-wrap .visual-area',
                height: 0,
            },
            init: function() {
                if(!$(this.options.el).length) return;
                
                const calcSize = setInterval(() => {
                    if ($(this.options.el).outerHeight() != 0) {
                        clearInterval(calcSize);
                        this.event();
                    }
                }, 100);
            },
            event: function() {
                let _el = $(this.options.el);
                let defaultHeight = _el.outerHeight() - 60; // 60px == 6rem == ��ƼŰ �϶� ����
                let docH = _el.closest('.pg-wrap').outerHeight();
                let winH = $(window).height();
                let listH = $('.account-list').outerHeight(); // ��ũ�� �߰� �ε������� ����
                $(window).off('scroll').on('scroll', function (e) {
                    let $scrollT = $(window).scrollTop();
                    if(listH != $('.account-list').outerHeight()) {
                        listH = $('.account-list').outerHeight();
                        docH = _el.closest('.pg-wrap').outerHeight();
                    }
                        
                    if($scrollT > 0 && docH > winH) {
                        _el.addClass('on')
                        if(docH - winH < defaultHeight) _el.parents('.visual-wrap').css({'margin-bottom': defaultHeight+32});
                        _el.addClass('sticky');
                        $('.visual-wrap .inq-state').addClass('sticky');
                        $('.visual-wrap .acc-profile-wrap').addClass('sticky');
                    }else{
                        // mod-date:1026:���ҽ�Ʈ �ö������ ����
                        if(!$('html').is('.lock')) {
                            _el.removeClass('on')
                            _el.parents('.visual-wrap').css({'margin-bottom': 0 });
                            _el.removeClass('sticky');
                            $('.visual-wrap .inq-state').removeClass('sticky');
                            $('.visual-wrap .acc-profile-wrap').removeClass('sticky');
                        }
                    }
                });
            }
        };

        $.fn.changeTxt = function (beforeTxt, afterTxt) {
            return this.each(function () {
                const element = $(this);
                const $html = element.html();
                if ($html != undefined && $html != '') {
                    element.html($html.split(beforeTxt).join(afterTxt));
                }
            });
        };

        $.fn.changeAriaLabel = function (beforeTxt, afterTxt) {
            return this.each(function () {
                const element = $(this);
                const $ariaLabel = element.attr('aria-label');
                if ($ariaLabel != undefined) {
                    const $ariaLabel2 = $ariaLabel.split(beforeTxt).join(afterTxt);
                    element.attr('aria-label', $ariaLabel2);
                }
            });
        };

        $.fn.hasScroll = function() {
            return (this.prop('scrollHeight') == 0 && this.prop('clientHeight') == 0) || (this.prop('scrollHeight') > this.prop('clientHeight'));
        }

        //���ڸ�
        let onlyNumber = function(num){
            return num.toString().replace(/[^0-9]/g,'');
        };

        //�޸��ֱ�
        let addComma = function(num){
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
        };

        //�޸�����
        let removeComma = function(num){
            return num.toString().replace(/,/gi,'');
        };

        //�±׽�ũ��
        let tagScroll = function(divNum) { //divNum : �� �ٿ� ����Ǵ� �ּ� ����
            let $hashBtn = $('.hash-list button');
            let $halfLength = Math.floor($hashBtn.length / 2);

            if ($hashBtn.length > 0) {
                $hashBtn.length < divNum * 2 ? $hashBtn.eq(divNum - 1).after('<br>') : $hashBtn.eq($halfLength - 1).after('<br>');
            }
        }

        //[���ټ�] �ڽ��� ���� üũ�ڽ� (230405 �߰�)
        let addAriaLabel = function($el) {
            let _label = $el.siblings('label');
            if(_label.length) $el.attr('aria-label', _label.text()).siblings('label').attr('aria-hidden', 'true'); //1018 [���ټ�]

            if ($el.attr('aria-controls') && $el.is(':visible')) { //0727 pic0010300 �׽�Ʈ��
                let $panel = $('#' + $el.attr('aria-controls'));
                $('#' + $el.attr('aria-controls')).show();
                $el.attr('aria-expanded', true);
                if ($el.prop('checked')) {
                    $panel.show();
                    $el.attr('aria-expanded', true);

                } else {
                    $panel.hide();
                    $el.attr('aria-expanded', false);
                }
            }
            
            if($el.hasClass('disabled')) {
                $el.attr('aria-disabled', true)
            }
            if($el.is('[role=radio], [role=checkbox]')) {
                if($el.hasClass('selected') || $el.hasClass('checked')) {
                    $el.attr('aria-checked', true)
                }else {
                    $el.attr('aria-checked', false)
                }
            }

            //[���ټ�] üũ�ڽ��� �����ִ� ���뿡 ���õ� ǥ��
            let $child = $el.siblings('.chk-card-wrap').find('[role=text]');
            $child.attr('tabindex', 0);
            $child.not('.disable, .already').each(function(){
                if($el.hasClass('checked')) $(this).attr('aria-label', $.trim($(this).text()) + ' ���õ�')
                else $(this).removeAttr('aria-label');
            })

            //[���ټ�] ���, ���� �ٷΰ���, mod-date:1128:prod-chk Ŭ���� �߰�
            if($el.is('[type=checkbox]') && ($el.parents('.agree-item').length || $el.parents('.prod-chk').length)) {
                if($el.parents('.btn-link').length || $el.next('label:contains("�ʼ�����")').length || $el.next('label:contains("���õ���")').length) {
                    let badge = $el.next('label').find('.badge').length ? $el.next('label').find('.badge').text() : ''; // mod-date:1128:badge ���� �߰�
                    let labelTitle = $el.next('label').attr('title') ? $el.next('label').attr('title') +' '+ badge : `${$el.next('label').text()} �ٷΰ���`;
                    $el.attr('aria-label', `üũ�ڽ� ���ý� ������ �̵� (${labelTitle})`).next('label').attr('aria-hidden','true').removeAttr('title');
                }
            }

        };

        //��ü�޴�
        let allMenu = {
            init: function() {
                // ��������
                this.$wrap = $('.all-menu');
                // this.$document = $('.all-menu .contents-wrap');
                this.$document = $(document);
                this.$sticky =  this.$document.find('.sticky');
                this.$navigator = this.$document.find('.nav-area');
                this.$swiper =  this.$document.find('.nav-area .ui-swiper');
                this.$lnb = this.$document.find('.lnb-wrap .lnb:visible');
                this.expended = 'open';
                this.activeClass = 'active';
                this.fixedClass = 'fixed';

                this.navigator.init();
                setTimeout(()=>{
                    this.event();
                }, 200)
            },
            event: function() {
                let isScrolling = false, isClicked= false, durationTime = 300, fixedHeight = 0, documentWidth = 0, resizeFn = null;

                // �׺������ �޴� �̵��� ��ġ
                let setOffset = function() {
                    documentWidth = $(window).width();
                    offsetTop = allMenu.$sticky.map((i, el)=>{
                        $(el).next('div').css('--fixed-margin-top', parseInt($(el).outerHeight()))
                        return el.offsetTop - (parseInt($(el).css('top')) ? parseInt($(el).css('top')) : 0);
                    });
                }
                setOffset();

                // ������ ���� �ܸ����� ������¡ �ʿ�
                $(window).off('resize.allmenuEvent').on('resize.allmenuEvent', function() {
                    clearTimeout(resizeFn)
                    resizeFn = setTimeout(()=>{
                        if(documentWidth != $(window).width()) setOffset();
                    }, 300)
                });

                // ��ũ���̺�Ʈ
                this.$document.off('scroll.allmenuEvent').on('scroll.allmenuEvent', function() {
                    if(isScrolling) return false;
                    let scrollTop = Math.round($(this).scrollTop()), stickyTop = 0;
                    // sticky ������ fixed Ŭ���� ����/����
                    allMenu.$sticky.each(function(i) {
                        stickyTop = (i == 0) ? allMenu.$sticky.eq(i).offset().top : allMenu.$sticky.eq(i-1).offset().top + allMenu.$sticky.eq(i-1).outerHeight();
                        if(scrollTop > 0 && scrollTop >= offsetTop[i]) {
                            if(!$(this).hasClass(allMenu.fixedClass)) {
                                $(this).addClass(allMenu.fixedClass)
                                setTimeout(()=>{
                                    fixedHeight += $(this).outerHeight();
                                }, durationTime)
                            }
                        }else if($(this).hasClass(allMenu.fixedClass)) {
                            fixedHeight -= $(this).outerHeight();
                            $(this).removeClass(allMenu.fixedClass);
                        }
                    });
                    
                    // lnb ������ ���� �׺����Ʈ ����Ʈ�� active Ŭ���� ����/����
                    allMenu.$lnb.each(function(i) {
                        let lnbOffsetTop = Math.round(this.offsetTop);
                        if(!isClicked && scrollTop >= lnbOffsetTop - fixedHeight && scrollTop <= lnbOffsetTop - fixedHeight + $(this).height()) {
                            let activeIndex = (fixedHeight<=0) ? 0 : i;
                            allMenu.navigator.slideTo(activeIndex, durationTime)
                        }
                    })
                });
    
                // �׺������ �޴� �̵�
                this.$document.off('click', '.nav-area .swiper-slide button').on('click', '.nav-area .swiper-slide button', function() {
                    isScrolling = true; // ��ũ�� ������ üũ
                    isClicked = true; // Ŭ���� ��쿡�� �׺������ �޴�(��������) active Ŭ���� ����
                    allMenu.$sticky.addClass(allMenu.fixedClass);
                    allMenu.navigator.slideTo($(this).parents('.swiper-slide').index(), durationTime)
                    fixedHeight = parseInt(allMenu.$navigator.css('top')) + allMenu.$navigator.outerHeight();
                    $(this).attr('title','���õ�').parents('.swiper-slide').siblings().find('button').removeAttr('title'); // mod-date:0926:���ټ� ���� ���õ� Ÿ��Ʋ �߰�
                    $(this).closest('.swiper-wrapper').attr('tabindex', 0).focus(); // mod-date:1130:[���ټ�] ��Ŀ�� ������������ ���� �������� �ʱ�ȭ
                    // �׺������ �ش� �޴��� �̵� 
                    // �� ��ũ�� �����Ͱ� $(document)�� �ƴ� ��� $('html, body') => allMenu.$document �� ���� �ʿ�
                    $('html, body').animate({
                        scrollTop: allMenu.$lnb.eq($(this).parents('.swiper-slide').index())[0].offsetTop - fixedHeight
                    }, durationTime+100,()=>{
                        $(this).closest('.swiper-wrapper').removeAttr('tabindex'); // mod-date:1130:[���ټ�] ��Ŀ�� ������������ ���� �������� �ʱ�ȭ
                        $('#'+$(this).attr('aria-controls')).attr('tabindex', 0).focus();
                        isScrolling = false;
                        setTimeout(()=>isClicked = false, 100)
                    });
                })
            },
            navigator: {
                init: function(initialIndex) {
                    if(!allMenu.$navigator.length) return false;
                    let li = ``, targetId = 'lnb';
                    initialIndex = initialIndex ? initialIndex : 0;
                    allMenu.$lnb.each(function(i) {
                        $(this).attr('id', targetId+i)
                        if(allMenu.$swiper.find('li').length) {
                            allMenu.$swiper.find('li').eq(i).attr({'aria-controls':targetId+i})
                        }else {
                            li += `<li class="swiper-slide ${i==initialIndex? 'active':''}"><button type="button" ${i==initialIndex? 'title="���õ�"': ''} aria-controls="${targetId+i}">${$(this).find('.menu-tit').text()}</button></li>`;
                        }
                    })
                    allMenu.$navigator.find('ul').append(li);
                    if(!allMenu.$swiper.data('swiper')) {
                        uiSwiper.init();
                    }else {
                        allMenu.$swiper.data('swiper').on('afterInit');
                    }
                },
                slideTo: function(scrollActiveIndex, durationTime) {
                    if(allMenu.$swiper.data('swiper') && !allMenu.$swiper.data('swiper').destroyed && scrollActiveIndex != allMenu.$swiper.data('swiper').activeIndex) allMenu.$swiper.data('swiper').slideTo(scrollActiveIndex);
                    allMenu.$swiper.find('.swiper-slide').eq(scrollActiveIndex).addClass(allMenu.activeClass).siblings().removeClass(allMenu.activeClass);
                    allMenu.$swiper.find('.swiper-slide.active').children('button').attr('title','���õ�').parent('.swiper-slide').siblings().children('button').removeAttr('title'); //1222 [���ټ�]
                }
            },
        }

        // 0831 : �ǽ�ũ�� ��ġ �̵�(MSB_INQ_18_001, MSB_MIN_05_001)
        let uiScrollTab = {
            init: function() {
                this.$tabList = $('.tab-list');
                this.$scrollPanel = $('.scroll-panel');
                this.pageFlag = $pgWrap().is('.bg-fixed-gr01') // ��ǰ : ����
                pageHeaderH = $('.pg-gnb').outerHeight();
                tabListH = this.$tabList.outerHeight();
                this.stickyTop = !this.pageFlag ? pageHeaderH+tabListH : $(".pg-wrap").width() > 320 ? 110 : 100; // mod-date:1026:��������������� ������ ����
                this.$items = this.$scrollPanel.find(this.pageFlag ? '.prod-card-wrap' : '.acc-item-wrap');
                if(this.$items.length == 0) {
                    this.$items = this.$scrollPanel.find('.acc-item-wrap');
                }
                // s: mod-date:0830 
                let sceneTop = this.getSceneTop();
                let extraHeight = $(window).height() - ($(document).height() - sceneTop[sceneTop.length-1]);
                $('.extra-block').css('height', extraHeight+'px')
                // e: mod-date:0830 

                this.debugIosVer = [16].includes(uiMobile.iPhoneVersion()); // mod-date:0913:ios16 �б�

                if(this.pageFlag) {
                    // ��ǰ��Ͽ��� ���ΰ�ħ �� ��ũ�� ��ġ �ʱ�ȭ(top)
                    setTimeout(()=>uiScrollTab.goto(0,false,true), 100)
                }
                
                // mod-date:1005:���ټ� �߰�
                this.$tabList.find('button').each(function(){
                    if($(this).hasClass('active')) $(this).attr('title','���õ�')
                })
                this.event();
            },
            // mod-date:0913:ios16���� $().animate() �����Ӷ����� ��ü
            scrollTo: function(target, callback){
                const fixedOffset = target.toFixed();
                const onScroll = function() {
                    const currentScrollOffset = window.pageYOffset || document.documentElement.scrollTop
                    if(currentScrollOffset.toFixed() == fixedOffset) {
                        $(document).off('scroll.tabScroll', onScroll);
                        callback();
                    }
                }
                $(document).on('scroll.tabScroll', onScroll);
                onScroll();
                window.scrollTo({
                    top: target,
                    behavior: 'smooth'
                });
            },
            event: function() {
                const _this = uiScrollTab;
                let isScrolling = false, isClicked= false;
                
                this.$tabList.find('button').off("click").on("click", function(e){
                    e.preventDefault();
                    isScrolling = true;
                    let isTop = $(this).index() == 0; 
                    let activeIndex = isTop ? 0 : (_this.pageFlag ? $(this).index() : $(this).index()-1);
                    let sceneTop = _this.getSceneTop(); // mod-date:0830 
                    isClicked = true;
                    _this.goto(activeIndex, isClicked, isTop);
                    // mod-date:1127:��ũ�Ѿִϸ��̼� �� �ݹ� �Լ� ����
                    const scrollCallBack = function() {
                        isScrolling = false;
                        setTimeout(()=>isClicked = false, 100)
                        UICommon.tabMenu.tabScroll($('.tab-list').find('button').eq(activeIndex));
                        if(_this.pageFlag) {
                            _this.$items.eq(activeIndex).find('h2').attr('tabindex', 0).focus() // mod-date:1004: ������ ��Ŀ��
                        } else if(!isTop) {
                            _this.$items.eq(activeIndex).find('.sticky').attr('tabindex', 0).focus() // mod-date:1004: ������ ��Ŀ��
                        }
                    }
                    // acc-item-wrap ��ġ ã�ư���
                    // mod-date:0913:ios16���� jQuery.animate() {scrollTop} �����Ӷ����� �б�
                    if(_this.debugIosVer) {
                        _this.scrollTo(isTop ? 0 : sceneTop[activeIndex],  scrollCallBack)
                    } else {
                        $('html, body').stop().animate({
                            scrollTop: isTop ? 0 : sceneTop[activeIndex]
                        }, 400, scrollCallBack);
                    }
                });
                // ��ũ���̺�Ʈ
                $(document).off('scroll.min05001Event').on('scroll.min05001Event', function() {
                    if(isScrolling) return false;
                    const scrollTop = Math.round($(this).scrollTop());
                    const sceneTop = _this.getSceneTop(); // mod-date:0830 
                    _this.$items.each(function(i) {
                        if(!isClicked && $(this).is(':visible')) {   // 0713:����
                            const endIndex = sceneTop[i+1] ? i+1:i;
                            if(scrollTop >= sceneTop[i] && (scrollTop < sceneTop[endIndex] || i == sceneTop.length-1)) {
                                if(!$(this).hasClass('active')) {
                                    _this.goto(i, isClicked, false);
                                }
                            }else if($(this).hasClass('active')){
                                _this.goto(i, isClicked, scrollTop < sceneTop[i]);
                            }
                        }
                    })
                });
            },
            goto: function(activeIndex, isClicked, isTop) {
                const _this = uiScrollTab;
                let extraNumber = (isTop) ? 0 : uiScrollTab.pageFlag ? 0 : 1;
                if(isTop) {
                    _this.$items.removeClass('active').attr('aria-selected','false');
                    _this.$tabList.removeClass('on')
                }else {
                    if(!_this.$tabList.hasClass('on')) _this.$tabList.addClass('on')
                    _this.$items.eq(activeIndex).addClass('active').attr('aria-selected','true').siblings().removeClass('active').attr('aria-selected','false');
                }
                if(!isClicked) {
                    _this.$tabList.find('button').eq(activeIndex+extraNumber).addClass('active').attr('aria-selected','true').siblings().removeClass('active').attr('aria-selected','false');
                    UICommon.tabMenu.tabScroll(_this.$tabList.find('button.active'));
                    if(_this.pageFlag) UICommon.tabMenu.tabBar(100);
                }
            },
            getSceneTop: function() {
                const _this = uiScrollTab;
                let tempSceneTop = 0;
                return _this.$items.map((i, el)=>{
                    //let sat = parseInt($(el).css('--sat')) ? parseInt($(el).css('--sat')) : 0; // mod-date:1125:iOS bug fixed
                    // iOS safe area ���̰��� �̹� ������ ����� ���Ե�
                    let fixedTopHeight = _this.stickyTop; // mod-date:1125:iOS bug fixed '+sat' //fixedTopHeight = fixed����(pg-gnb + tab-list ���̰�)
                    // ������ ���� �ִ� ���̽����� ����� ���̰� ����
                    if(Math.round($(el).offset().top)-fixedTopHeight > 0) {
                        tempSceneTop = Math.round($(el).offset().top+$(el).height())-fixedTopHeight; // 0713:����
                    }
                    return Math.round($(el).offset().top)-fixedTopHeight < 0 ? tempSceneTop :Math.round($(el).offset().top)-fixedTopHeight; // 0713:����
                });
            }
        }
        let util = {
            debounce: function (func, timeout = 100) {
                let timer;
                return function (...args) {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        func.apply(this, args);
                    }, timeout)
                }
            },
            throttle: function (func, timeout = 100) {
                let waiting = false
                return function () {
                    if (!waiting) {
                        func.apply(this, arguments)
                        waiting = true
                        setTimeout(() => {
                            waiting = false
                        }, timeout);
                    }
                }
            }
        } 


        return {
            //�ܺ�����
            init,
            tagScroll,
            Layer,
            scTop,
            tabMenu,
            inputRange,
            _front,
            loading,
            
            accordionButton,
            pressButton,
            tooltipButton,
            toggleButton,
            swipeButton,
            uiSwiper,
            uiStep,
            uiEffect,
            uiAnimation,
            uiSortable,
            prodIntroAni,
            transListAni,
            apng,
            //�ۺ��� ��� ��
            uiFullpop,
            uiDate,
            Body,

            //��ü�޴�
            allMenu,
            uiScrollTab,

            // ���� ��ƿ �߰�
            util
        }
    }

    window.UICommon = new UICommon();

    if (window.UICommon && location.href.indexOf('/_pub') > -1) {
        $(window).on('load', function() {
            try {
                window.UICommon.init();
            }catch(err) {
                console.log(err)
            }
        })
    }

}
