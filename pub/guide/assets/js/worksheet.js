const parseListData = (() => {
  /**
   * set worksheet data package
   * column : table 헤더 {id: {}}
   * shortcutColumn : 키워드 네비게이터 (column id 연결)
   */
  getCateList('/pub/guide/json/_map.json')
    .then(dataOrigin => {
      const url = new URL(location.href);
      const activeIdx = url.searchParams.get('pageIdx') ? parseInt(url.searchParams.get('pageIdx')) : 0;
      const data = Object.assign(dataOrigin, {
        activeIdx: activeIdx ? activeIdx : 0,
        activeKey: activeIdx ? dataOrigin.cateKeys[activeIdx] : dataOrigin.cateKeys[0],
        shortcutColumn: 'depth2',
        el: {
          wrapper: '#gContainer',
          header: '#gHeader',
          status: '.g_project_status',
          cateCont: '.g_board_tab',
          tableCont: '.g_board',
          shortcutCont: '.g_target',
          searchClassName: 'g_search_board'
        },
        column: {
          'no': {'text':'No','width':'2%'},
          'id': {'text':'화면 ID','width':'150px'},
          'type': {'text':'Type', 'width': '50px'},
          'depth1': {'text':'1Depth<button type="button" rel="d1"><span class="offscreen">숨기기</span></button>', 'width': 'auto', 'class': 'depth1'},
          'depth2': {'text':'2Depth<button type="button" rel="d2"><span class="offscreen">숨기기</span></button>', 'width': 'auto', 'class': 'depth2'},
          'depth3': {'text':'3Depth<button type="button" rel="d3"><span class="offscreen">숨기기</span></button>', 'width': 'auto', 'class': 'depth3'},
          'depth4': {'text':'4Depth<button type="button" rel="d4"><span class="offscreen">숨기기</span></button>', 'width': 'auto', 'class': 'depth4'},
          'name': {'text':'화면명', 'width': '15%'},
          'worker': {'text':'<select><option value="">작업자</option></select>', 'width': '100px', 'filter': 'select'},
          'workdate': {'text':'<select><option value="">작업일</option></select>', 'width': '100px', 'filter': 'select'},
          'change': {'text':'<select><option value="">수정일</option></select>', 'width': '100px', 'filter': 'select'},
          'complete': {'text':'<select><option value="">상태</option></select>', 'width': '80px', 'filter': 'select'},
          'etc': {'text':'비고', 'width': '20%'}
        }
      })

      // init template
      const template = new Template(data);
      template.set();

      // event
      const ui = UI(template, data);
      ui.init(); // 기본 ui 동작
      ui.searcher('#Gsearch'); // 상단 검색 기능
      ui.preview('.frame_device'); // 디바이스 프리뷰 기능
      ui.filter(); // th 필터 기능
    })
    if (localStorage.lightMode == "dark") $('html').attr("light-mode", "dark");
})();

/**
 * 
 * @param {string} url category map json 파일 url
 * @returns 정제된 카테고리 object
 */
 async function getCateList(url) {
  let response = await fetch(url);
  let data = await response.json();
  let cateResponse = [], cateName = [], cnt = 0;
  for (let obj of data) {
    cateResponse[cnt] = await fetch(obj.url);
    cateResponse[cnt] = await cateResponse[cnt].json();
    cateName[cnt] = obj.cateName;
    cnt++;
  }
  let cateList = {}, cateKeys = [], htmlCollector = {};
  cateResponse.forEach((arr) => {
    let cateArr = [], cateKey = '', innerHtml=[];
    let urlLink = '';
    for (let i in arr) {
      if (i == 0) cateKey = arr[i].directory.replace('/pub/html/', ''), urlLink = arr[i].directory;
      else if (cateKey !== undefined && cateKey !== '') {
        cateArr.push(arr[i]);
        innerHtml.push(setHtmlTbody(urlLink, arr[i], i));
      }
    }
    cateList[cateKey] = cateArr;
    htmlCollector[cateKey] = innerHtml; // htmlCollector : table td innerHTML
    cateKeys.push(cateKey);
  });
  return { cateList, cateName, cateKeys, htmlCollector };
}

/**
 * 
 * @param {string} urlLink directory path
 * @param {object} _origin cateList
 * @param {number} _index 테이블 No 컬럼에 들어갈 index
 * @returns 테이블 td에 들어갈 htmlCollector
 */
const setHtmlTbody = (urlLink, _origin, _index) => {
  let _html = Object.assign({}, _origin);
  _html.no = _index;

  let isBigMode = _html.name && _html.name.indexOf('큰') > -1; // 큰글씨모드
  /** set id for '화면ID' */
  if(_html.id) {
    if(_html.link) {
      _html.id = '';
    }else {
      urlLink = (_html.id.indexOf('CMM') > -1 ? '/pub/html/CMM/' : urlLink+'/') + _html.id + '.html';
      _html.id = `<a href="${urlLink}" target="_blank">${_html.id}</a>`;
    }
  }

  /** set type for '화면타입' */
  _html.type = _html.type ? `<span>${_html.type}</span>`:`<span>본창</span>`;
  
  
  /** set type for '화면명' */
  _html.name = _html.name.replace('<span class=big>큰</span>', `<a href="${urlLink}?uiMode=big-mode" class="big" target="_blank">큰</a>`)

  /** set complete for '상태' */
  if(_html.complete && (_html.state == undefined || _html.state == '')) {
    _html.complete = `<span class="done">${_html.complete}</span>`;
  }else {
    let complete = '대기중';
    let completeClass = (_html.state == null||_html.state == '') ? '' : _html.state;
    switch(_html.state) {
      case 'del': complete='삭제'; break;
      case 'hold': complete='보류'; break;
      default: if(_html.workdate) completeClass='ing'; break;
    }
    _origin.complete = complete;
    _html.complete = `<span class="${completeClass}">${complete}</span>`;
  }

  /** set etc for '비고' */
  if(_html.etc) {
    let remark = '';
    $.each(_html.etc, function () {
      if (this.indexOf('디자인확인') != -1) {
        remark += '<li class="design" title="'+this+'">' + this + '</li>';
      } else if (this.indexOf('기획확인') != -1) {
        remark += '<li class="plan" title="'+this+'">' + this + '</li>';
      } else {
        remark += '<li title="'+this+'">' + this + '</li>';
      }
    });
    _html.etc = `<ul class="remark">${remark}</ul>`;
  }else {
    _html.etc = '';
  }
  if(isBigMode) {
    _html.etc += `<a href="${urlLink}?uiMode=big-mode" class="btn_hover bigMode" target="_blank">${_origin.id}</a><a href="${urlLink}" class="btn_hover" target="_blank">${_origin.id}</a>`;
  }else {
    _html.etc += `<a href="${urlLink}" class="btn_hover" target="_blank">${_origin.id}</a>`;
  }

  /** set <tr> classes */
  let _state = _html.state ? _html.state : '';
  // let _wdate = String(_html.workdate).indexOf('-') > -1 ? 'c_'+String(_html.workdate) : '';
  // let _mdate = String(_html.change).indexOf('-') > -1 ? 'm_'+String(_html.change) : '';
  // let _worker = _origin.worker;
  // let _complete = _origin.complete ? _origin.complete : '';
  // _html.tr = Array(_state, _wdate, _mdate, _worker, _complete).filter(arr=>arr!=='');
  _html.tr = Array(_state).filter(arr=>arr!=='');
  _html.select = '';
  return _html;
}

/**
 * 
 * @param {*} temp Template 클래스와 active 값 동기화
 * @param {*} data origin data file
 * @returns UI 가이드 기능 및 이벤트
 */
const UI = function(temp, data) {
  let guide = {
    /**
     * state : 현황판 progress
     * switchSet/switch : 헤더 worksheet/guide/document 스위치
     * searchFor : htmlCollector 내에서 키워드 검색 후 temp.search에 저장(re-draw)
     * searcher: 검색 이벤트
     */
    init: function() {
      this.projectDropdown();
      this.switchSet();
      this.switch();
      this.slideTab = this.slideTab();
      this.subTab = this.shortCutTab();
      this.progress = this.state();
      this.etcListChk();
      this.event();
    },
    state: function() {
      const $el = {
        totalCont : $('.g_project_status'),
        totalNum : $('.g_count.total .num'),
        totalWorking : $('.g_count.working .num'),
        totalComplete : $('.g_count.cp_num .num'),
        totalGraph: $('.g_project_ing'),
        cateCont : $('.g_status'),
        cateNum : $('.g_status .total.num .num'),
        cateWorking : $('.g_status .working.num .num'),
        cateComplete : $('.g_status .cp_num.num .num'),
        cateGraph: $('.g_status_box'),
      }
      const _init = function() {
        _total();
        _cate();
      }
      const _total = function() {
        let totalNum = 0, workingNum = 0, completeNum = 0, deleteNum = 0;
        for(let key in temp.cateList) {
          totalNum += temp.cateList[key].length;
          delCount = 0;
          for(let value of temp.cateList[key]) {
            if(value.state == 'del') deleteNum++;
            else if(value.complete == '완료') completeNum++;
            else if(new Date(value.workdate) <= new Date()) workingNum++;
          }
        }
        console.log('total >> 총본수', totalNum)
        console.log('total >> 삭제', deleteNum)
        console.log('total >> 완료', completeNum)
        totalNum = totalNum-deleteNum;
        workingNum = totalNum-completeNum;
        $el.totalNum.text(totalNum);
        $el.totalWorking.text(workingNum);
        $el.totalComplete.text(completeNum);

        let per = Math.floor(completeNum/totalNum * 100);
        $el.totalGraph.find('.ing .num').text(per);
        $el.totalGraph.find('.bar').css('width', `${per}%`);
      }
      const _cate = function() {
        let totalNum = 0, workingNum = 0, completeNum = 0, deleteNum = 0;
        totalNum += temp.cateList[temp.activeKey].length;
        for(let value of temp.cateList[temp.activeKey]) {
          if(value.state == 'del') deleteNum++;
          else if(value.complete == '완료') completeNum++;
          else if(new Date(value.workdate) <= new Date()) workingNum++;
        }
        totalNum = totalNum-deleteNum;
        workingNum = totalNum-completeNum;
        
        console.log('cate >> 총본수', totalNum)
        console.log('cate >> 삭제', deleteNum)
        console.log('cate >> 완료', completeNum)
        $el.cateNum.text(totalNum);
        $el.cateWorking.text(workingNum);
        $el.cateComplete.text(completeNum);

        let per = Math.floor(completeNum/totalNum * 100);
        $el.cateGraph.find('.ing .num').text(per);
        $el.cateGraph.find('.bar').css('width', `${per}%`);

      }
      _init();
      return {
        init: _init,
        total: _total,
        cate: _cate,
      }
    },
    switchSet: function(e) {
      var $util = $('body').attr('data-util');
      $('.switch li').each(function () {
        var $this = $(this);
        if ($util.charAt(0).toUpperCase() + $util.slice(1) === $this.text()) $this.addClass('active');
      });
      $(window).resize(function () {
        var $active = (e !== undefined) ? e : $('.switch').find('li.active'),
          $li = $active.closest('ul').find('li'),
          $bar = $active.closest('.switch').find('.bar'),
          _w = $active.closest('ul').width(),
          _x = $active.closest('li').position().left;
        $bar.css({ 'width': _w / $li.length - 2, 'left': _x, 'opacity': 1, 'transform': 'scale(1)' });
      });
      $(window).resize();
    },
    switch: function() {
      if ($('.switch').length) {
        $('.switch>ul>li>a').on('mouseover focusin', function (e) {
          var $this = $(this);
          guide.switchSet($this);
        }).on('mouseout focusout', function (e) {
          guide.switchSet();
        });
      }
    },
    searchFor: function(keyword, deepSearch) {
      let search = {}, searchArr = [];
      keyword = $.trim(keyword);
      for(let directory in data.cateList){
        search[directory] = [];
        searchArr = [];
        for(let _index in data.cateList[directory]){
          let cnt = 0;
          for(let _key in data.htmlCollector[directory][_index]) {
            let __obj = data.htmlCollector[directory][_index][_key];
            if(deepSearch) {
              if(_key == deepSearch) {
                if(typeof __obj == 'string' && __obj.toUpperCase().indexOf(keyword.toUpperCase()) !== -1) {
                  if(cnt == 0) searchArr.push(data.htmlCollector[directory][_index])
                  cnt++;
                }
              }
            }else {
              if(typeof __obj == 'string' && __obj.toUpperCase().indexOf(keyword.toUpperCase()) !== -1) {
                if(cnt == 0) searchArr.push(data.htmlCollector[directory][_index])
                cnt++;
              }
            }
          }
        }
        search[directory] = searchArr;
      }
      temp.search = search;
    },
    searcher: function(target) {
      let $gContent = $('.g_content');
      const isSearchedOn = (flag)=>{
        let $pageCont = $gContent.find('.g_board').first();
        let $searchCont = $gContent.find('.g_search_board');
        
        $('body').removeHighlight();
        if(flag) {
          $pageCont.hide();
          $searchCont.show();
          if (!$gContent.hasClass('searcher')) $gContent.addClass('searcher');
          if ($('.search_title').length == 0) $gContent.prepend('<div class="search_title"><h3>검색결과</h3><button type="button" class="btn_search_cancel">검색취소</button></div>')
        }else {
          $pageCont.show();
          $searchCont.hide();
          $gContent.removeClass('searcher');
          $('.search_title').remove();
        }
        guide.mToggle('.frame_device', true);
      }

      $(document).on('keyup focus', target, function () {
        var $this = $(this), $val = $this.val();
        if ($val != '' && $val.length > 1) {
          if (!$this.next('.btn_search_del').length) $this.after('<a href="#" class="btn_search_del" role="button"><span class="offscreen">입력내용삭제</span></a>');
          $this.next('.btn_search_del').addClass('on');
          guide.searchFor($val);
          temp.update('search');
          isSearchedOn(true);
          $('body').highlight($val);
          $(document).on('click', '.btn_search_cancel', function () {
            $('body').removeHighlight();
            $gContent.removeClass('searcher');
            $(target).val('').change().focus();
          });
        }else {
          isSearchedOn(false);
          $this.next('.btn_search_del').remove()
        }
      });
      $(document).on('click', '.btn_search_del', function () {
        isSearchedOn(false);
        var $input = $(this).prev('input');
        $input.val('').change().focus();
      });
    },
    scroll: function() {
      $(window).scroll(function () {
        guide.btnSet();
      });
      $(window).scroll();
    },
    btnSet: function () {
      var $btmBtnSet = $('.btm_btn_set'), $btnTop = $('.btn_guide_top'), $btnLightMode = $('.btn_light_mode');
      ($(window).scrollTop() > 100) ? $btmBtnSet.addClass('active') : $btmBtnSet.removeClass('active');
      $btnTop.on('click', function () {
        $(window).scrollTop(0);
      });
      $btnLightMode.off('click').on('click', function () {
        guide.toggle_light_mode();
      });
    },
    toggle_light_mode: function () {
      var app = $('html');
      if (localStorage.lightMode == "dark") {
        localStorage.lightMode = "light";
        app.attr("light-mode", "light");
      } else {
        localStorage.lightMode = "dark";
        app.attr("light-mode", "dark");
      }
    },
    slideTab: function() {
      let swiper = new Swiper(temp.el.cateCont,{
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        freeMode: {
          enabled : true,
          minimumVelocity: 0.1
        },
        initialSlide: temp.activeIdx,
        ResizeObserver: true,
        on: {
          init: temp.update('body'),
        }
      });
      $(temp.el.cateCont).find('button').off('click').on('click', function(e) {
        // console.clear();
        if(swiper.clickedIndex != $(this).parent().index()) swiper.clickedIndex = $(this).parent().index();
        if(swiper.clickedIndex == temp.activeIdx) return false;
        let activeIdx = swiper.clickedIndex;
        if(activeIdx != undefined) {
          guide.subTab = null;
          $(swiper.slides).removeClass('active').eq(activeIdx).addClass('active');
          swiper.slideTo(activeIdx);
          history.replaceState(null, null, location.origin+location.pathname+'?pageIdx='+activeIdx);

          // page init
          temp.activeIdx = activeIdx;
          temp.activeKey = data.cateKeys[activeIdx];
          temp.update('body');
          guide.filterReset($('th.selected'));
          guide.etcListChk();
          guide.subTab = guide.shortCutTab();
          guide.progress.cate();
          $(temp.el.tableCont).find('table').removeAttr('class');
        }
      })
      return swiper;
    },
    shortCutTab: function() {
      return new Swiper(temp.el.shortcutCont,{
        slidesPerView: 'auto',
        freeMode: true,
        on: {
          click: function(swiper, event) {
            if(event.target.nodeName.toLowerCase() !== 'a') return false;
            let activeIdx = swiper.clickedIndex;
            if(activeIdx != undefined) {
              let $clickedSlide = $(swiper.clickedSlide);
              let targetIndex = Number($clickedSlide.find('a').data('targetIndex'))
              $(swiper.slides).removeClass('active').eq(activeIdx).addClass('active');
              swiper.slideTo(activeIdx);
              if(targetIndex >= (temp.page.current-1) * temp.page.cnt) {
                temp.page.current = Math.round(targetIndex/temp.page.cnt+1)
                temp.update('page');
              }
              let $target = $('.g_board').first().find('table tbody tr').eq(targetIndex);
              if(!$target.length) return false;
              $target.addClass('focus');
              $('html, body').animate({
                scrollTop: ($target.offset().top - 200) + 'px'
              }, 'fast', function() {
                setTimeout(()=>$target.removeClass('focus'), 500);
              });
              return false;
            }
          }
        }
      });
    },
    mToggle: function(_preview, toggleLock) {
      const $frameDevice = $(_preview);
      let $trigger = $(temp.el.tableCont);
      if(!toggleLock) {
        if($('html').hasClass('m')) {
          $('html').removeClass('m').removeAttr('style');
          if (!$frameDevice.hasClass('pop')) {
            console.log('no pop')
            $trigger.off('click');
            $trigger.find('.id a').attr('target','_blank');
            $trigger.find('.big').attr('target','_blank');
          }
        }else {
          $('html').addClass('m');
        }
      }
      $trigger.off('click').on('click', 'tbody td.id a, tbody td .big', function() {
        const $this = $(this)
        let $btnNewWindow = $frameDevice.find('.newWindow')
        , pID = $this.text()
        , pName = $this.closest('td').siblings('td.name').text()
        , url = $this.attr('href');
        if($frameDevice.hasClass('pop') || $('html').hasClass('m')) {
          $this.attr('target', 'device');
          $this.closest('tr').addClass('active').siblings('tr').removeClass('active');
          $frameDevice.find('.p_id').text(pID);
          $frameDevice.find('.p_name').text(pName);
          $frameDevice.find('.head').addClass('active');
          setTimeout(function () {
            $frameDevice.find('.head').removeClass('active');
          }, 500);
          $btnNewWindow.attr('href', url);
        }
      });
    },
    frameResize: function (_preview) {
      var _wH = $(window).height(),
        _hH = $('#gHeader').height(),
        _iH = $('.frame_device .head').height(),
        $frame = $('.frame_device iframe');
      $frame.css('height', _wH - _hH - _iH - 65);
    },
    devicePreview: function(_preview) {
      const $frameDevice = $(_preview);
      let $btnSize = $('.btn_size_set button')
      , $btnPopDevice = $('.frame_device .disconnect');
      $btnSize.off('click').on('click', function (e) {
        e.preventDefault();
        var $this = $(this), deviceW = $this.text(), frameW = Number(deviceW) + 10;
        $('html.m').css({ '--width': frameW +'px' });
        $frameDevice.css('width', frameW);
      });
      $btnPopDevice.off('click').on('click', function () {
        var _a = $('.g_board table tbody td.id a');
        guide.mToggle(_preview);
        $frameDevice.toggleClass('pop');
        if ($frameDevice.hasClass('pop')) {
          $frameDevice.drags('opt');
          _a.attr('target', 'device');
        } else {
          $frameDevice.drags('opt', 'destroy');
          $frameDevice.removeClass('pop').removeAttr('style');
        }
      });
      guide.frameResize(_preview);
    },
    preview: function(_preview) {
      const $frameDevice = $(_preview);
      $(document).on('click', '.btn_responsive', function() {
        guide.mToggle(_preview);
        guide.devicePreview(_preview);
        if ($frameDevice.hasClass('pop')) {
          $frameDevice.drags('opt', 'destroy');
          $frameDevice.removeClass('pop').removeAttr('style');
        }
      }).on('mouseover', 'td a.btn_hover', function (e) {
        let url = $(this).attr('href'),
            $device = $frameDevice.find('iframe'),
            $deviceID = $frameDevice.find('.p_id'),
            $deviceName = $frameDevice.find('.p_name'),
            $link = $frameDevice.find('.newWindow'),
            _screenID = $(this).closest('tr').find('td.id>a').text(),
            _screenName = $(this).closest('tr').find('td.name').text();
        $device.attr('src', url);
        $link.attr('href', url);
        $deviceID.text(_screenID);
        $deviceName.text(_screenName);
      });
      $(window).on('resize', function () {
        var windowWidth = $(window).width(),
          _a = $('.g_board table tbody td.id a, .g_board table tbody td .big');
        if (windowWidth < 1024) {
          $('html').removeClass('m');
          _a.attr('target', '_blank');
          $(_preview).removeAttr('style');
        }
        guide.frameResize(_preview);
      });
    },
    projectDropdown: function() {
      var $project = $('body').attr('data-project'),
          $btnC = $('.g_project .current');
          console.log($project)
      $('.g_project').find('a').each(function() {
        let href = $(this).data('host') + $(this).attr('href');
        $(this).attr('href', href);
      })
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
    filterReset: function(btnReset) {
      if(btnReset) {
        $(temp.el.wrapper).find('.g_alert_btn_set button').removeClass('active');
      }
      $(temp.el.tableCont).find('thead th').removeClass('selected');
      $(temp.el.tableCont).find('thead select').val('');
      temp.page.current = 1;
      temp.search = null;
    },
    filter: function() {
      const $select = $(temp.el.tableCont).find('thead select');
      let _selectedValue = '', _selectLength = 0;
      $select.on('change', function(e) {
        let _value = this.value;
        _selectLength = $(this).closest('thead').find('.selected').length;
        _selectedValue = $(this).closest('thead').find('.selected select').val();
        let $th = $(this).closest('th'), $tbody = $(this).closest('table').find('tbody');
        if(!_selectLength || $th.hasClass('selected')) {
          guide.filterReset(true);
          if(_value == '') {
            temp.update('page');
          }else {
            temp.page.current = 10;
            guide.searchFor(_value, $th.attr('id'));
            temp.update('filter');
            $th.addClass('selected');
            $(this).val(_value);
          }
        }else {
          if(_value == '') {
            guide.searchFor(_selectedValue, $th.siblings('.selected').attr('id'));
            temp.update('filter');
            $th.siblings('.selected').find('select').val(_selectedValue);
          }else {
            guide.searchFor(_value, $th.attr('id'));
            $tbody.find('tr').hide();
            temp.search[temp.activeKey].forEach(_this=>{
              $tbody.find(`[data-no="${_this.no}"]`).show();
            })
            $th.siblings().not('.selected').find('select').val('');
            $(this).val(_value);
          }
        }
      })
    },
    etcListChk: function() {
      guide.searchFor('디자인확인', 'etc')
      let design = temp.search[temp.activeKey];
      guide.searchFor('기획확인', 'etc');
      let plan = temp.search[temp.activeKey];
      $(temp.el.wrapper).find('.g_alert_btn_set').empty();
      
      if (design.length) $(temp.el.wrapper).find('.g_alert_btn_set').append('<button type="button" class="btn_design">디자인파트에서 확인 필요한 항목이 <strong>' + design.length + '</strong>개 있습니다.</button>');
      if (plan.length) $(temp.el.wrapper).find('.g_alert_btn_set').append('<button type="button" class="btn_plan">기획파트에서 확인 필요한 항목이 <strong>' + plan.length + '</strong>개 있습니다.</button>');
      if(design.length || plan.length) {
        $(temp.el.wrapper).off('click.checking')
        .on('click.checking', '.g_alert_btn_set', function (e) {
          let $this = $(e.target);
          let _value = $this.hasClass('btn_design') ? '디자인확인':'기획확인';
          if($this.hasClass('active')) _value = '';
          $this.toggleClass('active').siblings().removeClass('active');
          guide.filterReset();
          if(_value == '') {
            temp.update('page');
          }else {
            temp.page.current = 10;
            guide.searchFor(_value, 'etc');
            temp.update('filter');
          }
        });
      }
    },
    event: function() {
      guide.scroll();
      $(document).off('click.tableEvent')
      .on('click.tableEvent', '.remark', function () {
        if(!$('.remark_pop').length) {
          var $clone = $(this).clone(),
            $remarkPop = '<div class="remark_pop"><h2>History</h2><div class="history"></div>',
            $dimmed = '<div class="dimmed"></div>';
          $('body').append($remarkPop, $dimmed);
          $('.remark_pop .history').append($clone);
        }
      })
      .on('click.tableEvent', '.dimmed', function () {
        $('.remark_pop, .dimmed').remove();
      })
      .on('click.tableEvent','.btn_util', function () {
        $('html').toggleClass('util_show');
        if ($('html').hasClass('util_show')) {
          $('#Gsearch').keydown(function (e) {
            if (e.keyCode == 13) $('html').removeClass('util_show');
          });
          $('#btnGsearch').on('click', function () {
            $('html').removeClass('util_show');
          });
        };
      })
      .on('click.tableEvent', 'thead th button', function() {
        const $this = $(this);
        let $class = $this.closest('th').attr('class');
        let $grid = $this.closest(temp.el.tableCont).find('table');
        $grid.addClass('col_hide_'+$class);
      })
    },
  }
  return guide;
}
