class Template {
    constructor(data) {
        // categories
        this.el = data.el;
        this.document = document.querySelector(this.el.wrapper);
        this.cateName = data.cateName;
        this.cateList = data.cateList;
        this.column = data.column;
        this.htmlCollector = data.htmlCollector;
        this.activeIdx = (data.activeIdx > Object.keys(data.cateList).length - 1) ? 0 : data.activeIdx;
        this.activeKey = data.cateKeys[this.activeIdx];
        this.tableCont = this.document.querySelector(data.el.tableCont);
        this.shortcutColumn = data.shortcutColumn;
        this.page = {total: 0, current: 1, cnt: 50};
        this.filterON  = true;
    }
    set() {
        const temp = this;
        if(temp.document.querySelector(temp.el.cateCont)) temp._setCateTabs();
        if(temp.document.querySelector(temp.el.shortcutCont)) temp._setShortcut();
        temp._setTable(temp.tableCont, true);
        addEventListener('scroll', e=>temp._scroll(temp))
    }
    update(type) {
        const temp = this;
        switch(type) {
            case 'init' : temp._init(); break;
            case 'body' : 
            temp._init(), 
            temp._setTableBody(); 
            temp._setTableHeaderFilter();
            if(temp.document.querySelector(temp.el.shortcutCont)) temp._setShortcut();
            setTimeout(()=>{temp.page.current = Math.ceil(temp.page.total/temp.page.cnt);temp.update('page');}, 300); // init 후 나머지 페이지 불러오기
            break;
            case 'page' : 
            temp._setTableBody();
            temp._setTableHeaderFilter();
            break;
            case 'filter' : 
            temp._setTableBody(temp.search);
            temp._setTableHeaderFilter(temp.search);
            break;
            case 'search' : 
            temp.page.current = 10,
            temp._search();
            break;
        }
    }
    _init() {
        const temp = this;
        temp.page.current = 1;
        window.scrollTo({top:0})
        console.log('init', temp)
    }
    _search() {
        const temp = this;
        if(!temp.document.querySelector('.'+temp.el.searchClassName)) {
            let wrap = document.createElement('div');
            let tr = '';
            wrap.classList.add(temp.el.searchClassName, 'g_board')
            if(temp.search) {
                temp._setTable(wrap, false);
                temp.tableCont.after(wrap);
                // temp._setTableBody(temp.search, wrap);
                for(let key in temp.search) {
                    if(temp.search[key]) tr += temp._appendTr(temp.search[key]);
                }
                wrap.querySelector('tbody').innerHTML = tr;
            }
        }else {
            let wrap = temp.document.querySelector('.'+temp.el.searchClassName);
            let tr = '';
            for(let key in temp.search) {
                if(temp.search[key]) {
                    if(temp.search[key].length) tr += `<tr><th class="th" colspan=${Object.keys(temp.column).length}>${key}</th></tr>`;
                    tr += temp._appendTr(temp.search[key]);
                }
            }
            wrap.querySelector('tbody').innerHTML = tr;
            // temp._setTableBody(temp.search, wrap)
        }

    }
    _setCateTabs() {
        const temp = this;
        let ul = document.createElement('ul');
        let li = '', cnt = 0;
        for(let key in temp.cateList) {
        li += `<li class="swiper-slide ${(cnt == temp.activeIdx)?'active':''}"><button type="button" data-cate-key="${key}">${temp.cateName[cnt]}</button></li>`;
        cnt++;
        }
        ul.classList.add('swiper-wrapper');
        ul.innerHTML = li;
        temp.document.querySelector(temp.el.cateCont).innerHTML = ul.outerHTML;
    }
    _setShortcut() {
        const temp = this, arr= [];
        let ul = document.createElement('ul');
        let li = '', currentColumn = '', cnt = 0;
        for(let obj of temp.cateList[temp.activeKey]) {
            if(obj[temp.shortcutColumn] != '' && obj[temp.shortcutColumn] !== currentColumn) {
                currentColumn = obj[temp.shortcutColumn];
                li += `<li class="swiper-slide"><a href="#" data-target-index="${cnt}" class="go">${obj[temp.shortcutColumn]}</a></li>`;
            }
            cnt++
        }
        ul.classList.add('swiper-wrapper');
        ul.innerHTML = li;
        temp.document.querySelector(temp.el.shortcutCont).innerHTML = ul.outerHTML;
    }
    
    /**
     * @param {*} appendTarget append 할 타겟의 엘리먼트(필수)
     * @param {boolean} filterON 테이블 헤더 필터 설정 여부
     */
    _setTable(appendTarget, filterON) {
        const temp = this;
        let table = document.createElement('table');
        table.append(document.createElement('colgroup'))
        table.append(document.createElement('thead'))
        table.append(document.createElement('tbody'))
        table.querySelector('colgroup').innerHTML = temp._setTableHeader().col;
        table.querySelector('thead').innerHTML = temp._setTableHeader().th;
        appendTarget.append(table);
        if(filterON) temp._setTableHeaderFilter();
    }

    /**
     * @returns 테이블 헤더에 들어갈 col, th html
     */
    _setTableHeader() {
        const temp = this;
        let col = '', th = '';

        // 테이블 헤더 html 생성
        for(let key in temp.column) {
            // 클래스명 설정
            let _class = temp.column[key].class ? temp.column[key].class:'';
            if(temp.column[key].wrapper) _class += ' '+temp.column[key].wrapper;

            // col 요소 생성
            if(temp.column[key].width) col += `<col ${_class ? 'class="'+ _class+'"' : ''} style="width: ${temp.column[key].width}">`;
            else col += `<col ${_class ? 'class="'+ _class+'"' : ''}>`;

            // th 요소 생성
            th += `<th scope="col" id="${key}" class="${_class ? _class : ''}">${temp.column[key].text}</th>`;
        }
        return {col,th};
    }

    /**
     * @param {object} isSearch 헤더 필터 사용 중인 경우 필터에 해당하는 옵션만 노출
     * 이 함수를 밖으로 빼야 하나 고민중..
     */
    _setTableHeaderFilter(isSearch) {
        const temp = this;
        if(!temp.filterON) return false;
        let filters = {};
        let tableList = isSearch ? isSearch[temp.activeKey] : temp.cateList[temp.activeKey];
        for(let key in temp.column) {
            if(temp.column[key].filter) {
                let _filter = [];
                for(let _obj of tableList) {
                    // if(key == 'complete') {
                    //     if(_obj.state == 'del' && key == 'complete') _obj[key] = '삭제';
                    //     if((_obj.complete == null || _obj.complete == '') && _obj.workdate !== 'N/A') _obj[key] = '대기중';
                    // }
                    _filter.push(String(_obj[key]).replace(/null|undefined/g,''));
                }
                filters[key] = [... new Set(_filter.filter(v=>v!=''))].sort();
                let _option = temp.column[key].text;
                for(let _value of filters[key]) {
                    if(isSearch && key == 'complete') {
                        let regexp = /[a-z0-9]|[\[\]{{}()<>?|`~!@#$%^&*=/\"'\\}]/g;
                        _value = _value.replace(regexp,'').trim();
                    }
                    if(_value != '') _option += `<option value="${_value}">${_value}</option>`;
                }
                temp.document.querySelector(`#${key} ${temp.column[key].filter}`).innerHTML = _option;
            }
        }
    }
    _setTableBody(htmlCollector, appendTarget) {
        const temp = this;
        let target = appendTarget ? appendTarget : temp.tableCont;
        htmlCollector = htmlCollector ? htmlCollector : temp.htmlCollector;
        let tr = '', cnt = 0;
        for(let key in htmlCollector) {
            if(temp.activeIdx == cnt) {
                tr = temp._appendTr(htmlCollector[key]);
            }
            cnt++;
        }
        target.querySelector('tbody').innerHTML = tr;
    }
    _scroll(temp) {
        let val = innerHeight + scrollY;
        if(val >= document.body.offsetHeight) {
            if(temp.page.total >= temp.page.current * temp.page.cnt) {
                temp.page.current++;
                temp.update('page');
            }else {
                console.log('end scroll')
            }
        }
    }
    _appendTr(data) {
        const temp = this;
        let tr = '';
        temp.page.total = data.length;
        data.forEach((_data, idx) => {
            if(idx > (temp.page.current * temp.page.cnt)) return;
            // _data.no = idx+1;
            tr += `<tr class="${_data.tr.join(' ')}" data-no="${_data.no}">`;
            for(let key in temp.column) {
                tr += `<td class="${key}" headers="${key}">${_data[key]?_data[key]:''}</td>`;
            }
            tr += `</tr>`;
        });
        return tr;
    }
}

/**
 * jQuery UI 기능 추가
 */
 $.fn.drags = function (opt, destroy) {
    var $el = null;
    opt = $.extend({ handle: ".head", cursor: "move" }, opt);
    if (opt.handle === "") {
      $el = this;
    } else {
      $el = this.find(opt.handle);
    }
    if (destroy === 'destroy') {
      $el.css('cursor', 'auto').off("mousedown");
    } else {
      $el.css('cursor', opt.cursor).on("mousedown", function (e) {
        var $drag = null;
        if (opt.handle === "") {
          $drag = $(this).addClass('draggable');
        } else {
          $drag = $(this).addClass('active-handle').parent().addClass('draggable');
        }
        var z_index = $drag.css('z-index'),
          drg_h = $drag.outerHeight(),
          drg_w = $drag.outerWidth(),
          pos_y = $drag.offset().top + drg_h - e.pageY,
          pos_x = $drag.offset().left + drg_w - e.pageX;
        $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
          $('.draggable').offset({
            top: e.pageY + pos_y - drg_h,
            left: e.pageX + pos_x - drg_w
          }).on("mouseup", function () {
            $(this).removeClass('draggable').css('z-index', z_index);
          });
        });
        e.preventDefault(); // disable selection
      }).on("mouseup", function () {
        if (opt.handle === "") {
          $(this).removeClass('draggable');
        } else {
          $(this).removeClass('active-handle').parent().removeClass('draggable');
        }
      });
    }
}
$.fn.highlight = function (pat) {
function innerHighlight(node, pat) {
    var skip = 0;
    if (node.nodeType == 3) {
    var pos = node.data.toUpperCase().indexOf(pat);
    if (pos >= 0) {
        var spannode = document.createElement('span');
        spannode.className = 'highlight';
        var middlebit = node.splitText(pos);
        var endbit = middlebit.splitText(pat.length);
        var middleclone = middlebit.cloneNode(true);
        spannode.appendChild(middleclone);
        middlebit.parentNode.replaceChild(spannode, middlebit);
        skip = 1;
    }
    }
    else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
    for (var i = 0; i < node.childNodes.length; ++i) {
        i += innerHighlight(node.childNodes[i], pat);
    }
    }
    return skip;
}
return this.each(function () {
    innerHighlight(this, pat.toUpperCase());
});
};
$.fn.removeHighlight = function () {
function newNormalize(node) {
    for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {
    var child = children[i];
    if (child.nodeType == 1) {
        newNormalize(child);
        continue;
    }
    if (child.nodeType != 3) { continue; }
    var next = child.nextSibling;
    if (next == null || next.nodeType != 3) { continue; }
    var combined_text = child.nodeValue + next.nodeValue;
    new_node = node.ownerDocument.createTextNode(combined_text);
    node.insertBefore(new_node, child);
    node.removeChild(child);
    node.removeChild(next);
    i--;
    nodeCount--;
    }
}
return this.find("span.highlight").each(function () {
    var thisParent = this.parentNode;
    thisParent.replaceChild(this.firstChild, this);
    newNormalize(thisParent);
}).end();
};