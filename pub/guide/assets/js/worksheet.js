var UIGuide = function () {
  var init = function () {
      workSheet.init();
  }
  var workSheet = {
      init: function() {
          (localStorage.lightMode == 'dark') ? $('html').attr('light-mode', 'dark').addClass('dark') : $('html').removeAttr('light-mode').removeClass('dark');
          workSheet.makeHead();
          workSheet.makeBoard();
      },
      makeHead: function() {
          var $headerHtml = ''
          $headerHtml += '<h1>Upleat Design System</h1>';
          $headerHtml += '<button type="button" class="btn_util"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="65px" height="50px" viewBox="0 0 65 65" xml:space="preserve"><path class="bar b1" d="M20,23.912h23.997c0,0,16.004-0.501,16.004,13.416 S46.75,47.912,41.834,42.995S22.668,23.412,22.668,23.412"/><path class="bar b2" d="M24.751,41.995H44c0,0,16.001,1.167,16.001-12.25 c0-13.417-9.508-15.157-18.004-6.745S22.001,42.995,22.001,42.995"/><line class="bar b3" x1="30.125" y1="32.999" x2="43.997" y2="32.999"/></svg><span class="offscreen">메뉴열기</span></span></button>';
          $headerHtml += '<div class="g_util">';
          $headerHtml += '<div class="g_search">';
          $headerHtml += '<input type="text" id="Gsearch" placeholder="검색어를 입력하세요" />';
          $headerHtml += '<button type="button" id="btnGsearch"><span class="offscreen">검색하기</span></button>';
          $headerHtml += '</div>';
          $headerHtml += '<div class="switch">';
          $headerHtml += '<span class="bar"></span>';
          $headerHtml += '<ul>';
          $headerHtml += '<li><a href="/pub/guide/html/worksheet.html" target="_blank">Worksheet</a></li>';
          $headerHtml += '<li><a href="/pub/guide/html/guide.html" target="_blank">Guide</a></li>';
          $headerHtml += '<li><a href="/pub/guide/html/document.html" target="_blank">Document</a></li>';
          $headerHtml += '</ul>';
          $headerHtml += '</div>';
          $headerHtml += '<div class="g_project">';
          $headerHtml += '<button type="button" class="current" title="프로젝트 목록보기">선택</button>';
          $headerHtml += '<ul class="g_list">';
          if (location.host == 'zmsbiz.kbstar.com' || location.host == 'zobiz.kbstar.com' || location.host =='ztadmin.kbstar.com' || location.host =='zmnbank.kbstar.com') {
              $headerHtml += '<li><a href="https://zmsbiz.kbstar.com/pub/guide/html/worksheet.html" target="_blank">App</a></li>';
          } else {  
              $headerHtml += '<li><a href="/pub/guide/html/worksheet.html" target="_blank">App</a></li>';
          }
          if (location.host == 'zobiz.kbstar.com' || location.host == 'zmsbiz.kbstar.com' || location.host == 'ztadmin.kbstar.com' || location.host =='zmnbank.kbstar.com') {
              $headerHtml += '<li><a href="https://zobiz.kbstar.com/obiz/publishing_2022/guide/html/worksheet.html" target="_blank">PC</a></li>';
          } else {  
              $headerHtml += '<li><a href="/obiz/publishing_2022/guide/html/worksheet.html" target="_blank">PC</a></li>';
          }
          if (location.host == 'ztadmin.kbstar.com' || location.host == 'zobiz.kbstar.com' || location.host == 'zmsbiz.kbstar.com' || location.host =='zmnbank.kbstar.com') {
              $headerHtml += '<li><a href="http://ztadmin.kbstar.com/bizAdmin/guide/html/worksheet.html" target="_blank">Admin</a></li>';
          } else {  
              $headerHtml += '<li><a href="/bizAdmin/guide/html/worksheet.html" target="_blank">Admin</a></li>';
          }
          $headerHtml += '</ul>';
          $headerHtml += '</div>';
          $headerHtml += '<button type="button" class="btn_responsive"><i><i><i class="offscreen">메뉴</i></i></i></button>';
          $headerHtml += '</div>';
          if ($('#gHeader').length) $('#gHeader').html($headerHtml);
      },
      makeBoard: function() {
          var $slide = $('.g_board_tab .swiper-slide');
          var $lenth = $slide.length;
          var htmlBoard = function (boardid, data) {
              var html = '<div id="' + boardid + '" class="g_board_panel">';
              html += '<div class="panel_head">';
              html += '<div class="g_target">';
              html += '<ul class="swiper-wrapper">';
              html += '</ul>';
              html += '</div>';
              html += '<span class="g_status">';
              html += '<span class="num total">본수 : <strong class="num"></strong></span>';
              html += '<span class="num working">진행본수 : <strong class="num"></strong></span>';
              html += '<span class="num cp_num">완료본수 : <strong class="num"></strong></span>';
              html += '<span class="g_status_box"> <span class="bar"></span><span class="ing">진행률 : <strong class="num"></strong>%</span></span>';
              html += '</span>';
              html += '</div>';
              html += '<div class="g_alert_btn_set">';
              html += '</div>';
              html += '<div class="g_board">';
              html += '<table>';
              html += '<caption>메뉴별 코딩리스트</caption>';
              html += '<colgroup>';
              html += '<col style="width:50px">';
              html += '<col style="width:150px">';
              html += '<col style="width:90px">';
              html += '<col class="d1" style="width:auto">';
              html += '<col class="d2" style="width:auto">';
              html += '<col class="d3" style="width:auto">';
              html += '<col class="d4" style="width:auto">';
              html += '<col style="width:300px">';
              html += '<col style="width:90px">';
              html += '<col style="width:100px">';
              html += '<col style="width:100px">';
              html += '<col style="width:80px">';
              html += '<col style="width:100px">';
              html += '</colgroup>';
              html += '<thead>';
              html += '<tr>';
              html += '<th scope="col">No</th>';
              html += '<th scope="col" class="id">화면id</th>';
              html += '<th scope="col" class="type">화면타입</th>';
              html += '<th scope="col" class="deps d1">1Depth<button type="button" rel="d1"><span class="offscreen">숨기기</span></button></th>';
              html += '<th scope="col" class="deps d2">2Depth<button type="button" rel="d2"><span class="offscreen">숨기기</span></button></th>';
              html += '<th scope="col" class="deps d3">3Depth<button type="button" rel="d3"><span class="offscreen">숨기기</span></button></th>';
              html += '<th scope="col" class="deps d4">4Depth<button type="button" rel="d4"><span class="offscreen">숨기기</span></button></th>';
              html += '<th scope="col" class="name">화면명</th>';
              html += '<th scope="col" class="worker">';
              html += '<select>';
              html += '<option value="">작업자</option>';
              html += '</select>';
              html += '</th>';
              html += '<th scope="col" class="c_date">';
              html += '<select>';
              html += '<option value="">작업일</option>';
              html += '</select>';
              html += '</th>';
              html += '<th scope="col" class="m_date">';
              html += '<select>';
              html += '<option value="">수정일</option>';
              html += '</select>';
              html += '</th>';
              html += '<th scope="col" class="complete">상태</th>';
              html += '<th scope="col" class="etc">비고</th>';
              html += '</tr>';
              html += '</thead>';
              html += '<tbody>';
              html += data;
              html += '</tbody>';
              html += '</table>';
              html += '</div>';
              html += '</div>';
              $('.g_content').append(html);
          };
          var htmlTbody = function (data) {
              var $data = data;
              var tbodyHtml = '';
              var idx = 1;
              var urlLink = '';
              var createTr = function (obj) {
                var trHtml = '';
                if (obj.directory !== undefined && obj.directory !== '') {
                  urlLink = obj.directory;
                } else {
                  (obj.state) ? trHtml += '<tr class="' + obj.state + '">' : trHtml += '<tr>';
                  trHtml += '<td class="no">' + idx + '</td>';
                  idx += 1;
                  if (obj.id) {
                      if (obj.link) {
                          trHtml += '<td class="id">' + obj.id + '</td>';
                      } else {
                          trHtml += '<td class="id"><a href="' + urlLink + '/' + obj.id + '.html" target="_blank">' + obj.id + '</a></td>';
                      }
                  } else {
                      trHtml += '<td class="id"></td>';
                  }
                  if (obj.type) {
                      trHtml += '<td class="type"><span>' + obj.type + '</span></td>';
                  } else {
                      trHtml += '<td class="type"><span>본창</span></td>';
                  }
                  if (obj.depth1) {
                      trHtml += '<td class="depth1">' + obj.depth1 + '</td>';
                  } else {
                      trHtml += '<td class="depth1"></td>';
                  }
                  if (obj.depth2) {
                      trHtml += '<td class="depth2">' + obj.depth2 + '</td>';
                  } else {
                      trHtml += '<td class="depth2"></td>';
                  }
                  if (obj.depth3) {
                      trHtml += '<td class="depth3">' + obj.depth3 + '</td>';
                  } else {
                      trHtml += '<td class="depth3"></td>';
                  }
                  if (obj.depth4) {
                      trHtml += '<td class="depth4">' + obj.depth4 + '</td>';
                  } else {
                      trHtml += '<td class="depth4"></td>';
                  }
                  if (obj.name) {
                      trHtml += '<td class="name">' + obj.name + '</td>';
                  } else {
                      trHtml += '<td class="name"></td>';
                  }
                  if (obj.worker) {
                      trHtml += '<td class="worker">' + obj.worker + '</td>';
                  } else {
                      trHtml += '<td class="worker"></td>';
                  }
                  if (obj.workdate) {
                      trHtml += '<td class="c_date">' + obj.workdate + '</td>';
                  } else {
                      trHtml += '<td class="c_date"></td>';
                  }
                  if (obj.change) {
                      trHtml += '<td class="m_date">' + obj.change + '</td>';
                  } else {
                      trHtml += '<td class="m_date"></td>';
                  }
                  if (obj.complete && obj.state == undefined) {
                      trHtml += '<td class="complete"><span class="done">' + obj.complete + '</span></td>';
                  } else if (obj.state === 'del') {
                      trHtml += '<td class="complete"><span class="del">삭제</span></td>';
                  } else if (obj.state === 'hold') {
                      trHtml += '<td class="complete"><span class="hold">보류</span></td>';
                  } else if (obj.workdate) {
                      trHtml += '<td class="complete"><span class="ing">검수중</span></td>';
                  } else {
                      trHtml += '<td class="complete"><span>대기중</span></td>';
                  }
                  if (obj.etc) {
                      var remark = '';
                      $.each(obj.etc, function () {
                          if (this.indexOf('디자인확인') != -1) {
                              remark += '<li class="design">' + this + '</li>';
                          } else if (this.indexOf('기획확인') != -1) {
                              remark += '<li class="plan">' + this + '</li>';
                          } else {
                              remark += '<li>' + this + '</li>';
                          }
                      });
                      trHtml += '<td class="etc"><ul class="remark">' + remark + '</ul><a href="' + urlLink + '/' + obj.id + '.html" class="btn_hover" target="_blank">' + obj.id + '</a></td>';
                  } else {
                      trHtml += '<td class="etc"><a href="' + urlLink + '/' + obj.id + '.html" class="btn_hover" target="_blank">' + obj.id + '</a></td>';
                  }
                }
                trHtml += '</tr>';
                return trHtml;
              };
              $.each($data, function () {
                tbodyHtml += createTr(this);
              });
              return tbodyHtml;
          };
          var LoadCount = 0;
          $slide.each(function (i) {
              var $this = $(this);
              var $rel = 'panel' + i;
              $this.attr('rel', $rel);
              var $json = $this.find('button').data('json');
              var $dataHtml = '';
              if ($json !== undefined) {
                  jQuery.ajax({
                      type: 'GET',
                      url: $json,
                      dataType: 'JSON',
                      success: function (data) {
                          if (data.length) $dataHtml = htmlTbody(data);
                      },
                      complete: function (data) {
                          LoadCount += 1;
                          htmlBoard($rel, $dataHtml);
                          if (LoadCount === $lenth) {
                          setTimeout(function () {
                              workSheet.set.init();
                              setTimeout(function () {
                                  $(window).resize();
                                  }, 100);
                              }, 100);
                          }
                      },
                      error: function (xhr, status, error) {
                          console.error($rel, '에러발생', xhr, status, error);
                      }
                  });
              }
          });
      }
  }

  var tabSwiper = '', targetSwiper = [];
  workSheet.set = {
      init: function() {
          workSheet.set.header();
          workSheet.set.board();
          workSheet.set.state();
          workSheet.set.UI();
          workSheet.set.slide();
          workSheet.set.switchSet();
          workSheet.set.switch();
          workSheet.set.tab();
          workSheet.set.devicePreview();
          workSheet.set.searcher('#Gsearch');
          workSheet.set.resize();
          workSheet.set.scroll();
          workSheet.set.shortcut();
          workSheet.set.etcListChk();
      },
      header: function (title) {
          var $pathname = location.pathname;
          var $urlName = $pathname.split('/').pop();
          $('.g_nav a').each(function () {
              var $this = $(this);
              var $href = $this.attr('href').split('/').pop();
              if ($urlName == $href) $(this).parents('li').addClass('active');
          });
          if ($('.g_content>h2').length && $('.g_content>h2').text() != '') {
              var $title = document.title;
              document.title = $('.g_content>h2').text() + ' | ' + $title;
          }
          $('.btn_util').on('click', function () {
              $('html').toggleClass('util_show');
              if ($('html').hasClass('util_show')) {
                  $('#Gsearch').keydown(function (e) {
                      if (e.keyCode == 13) $('html').removeClass('util_show');
                  });
                  $('#btnGsearch').on('click', function () {
                      $('html').removeClass('util_show');
                  });
              };
          });
      },
      switchSet: function (e) {
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
      switch: function () {
          if ($('.switch').length) {
              $('.switch>ul>li>a').on('mouseover focusin', function (e) {
                  var $this = $(this);
                  workSheet.set.switchSet($this);
              }).on('mouseout focusout', function (e) {
                  workSheet.set.switchSet();
              });
          }
      },
      tab: function () {
          var $tab = $('.g_board_tab ul li'),
              $tabCurrent = $tab.eq(0),
              $panelCurrent = $('#' + $tabCurrent.attr('rel'));
          $tab.eq(0).addClass('active');
          $panelCurrent.addClass('active').find('.bar').css('width', $panelCurrent.data('bar-width') + '%');
          $tab.on('click', function (e) {
              e.preventDefault();
              var $this = $(this);
              var $panelActive = $('#' + $this.attr('rel'));
              var $scrollTop = $(window).scrollTop();
              $this.addClass('active').siblings('li').removeClass('active');
              $panelActive.addClass('active').find('.bar').css('width', $panelActive.data('bar-width') + '%');
              $panelActive.siblings('.g_board_panel').removeClass('active').find('.bar').css('width', 0);
              $(window).scrollTop($scrollTop);
              $.each(targetSwiper, function (i, item) {
                    console.log($);
                  item.update();
              });
          });
      },
      board: function () {
          $('.g_board td.id').each(function () {
              var _a = $(this).find('a');
              var _href = _a.attr('href');
              var _txt = _a.text();
      
              if (!!_href && _href.indexOf('#') !== 0) {
              if (_href.indexOf(_txt) == -1 && _href.indexOf('.html') == -1) {
                  var _setHref = _href + _txt;
                  var _file = location.pathname.split('.').pop();
                  if (_file) _setHref = _setHref + '.' + _file;
                  _a.attr('href', _setHref);
              }
              } else {
              //console.log(_txt);
              }
          });
          $('.g_board').each(function () {
              var _this = $(this);
              var dayArry = [];
              var dayArry2 = [];
              var workerArry = [];
              $(this).find('tbody td.c_date').each(function () {
                  var _txt = $(this).text();
                  if (!!_txt) {
                  var _txt2 = parseInt(_txt.split('-').join(''));
                  var _class = 'c_' + _txt2;
                  $(this).closest('tr').addClass(_class);
                  if (dayArry.indexOf(_txt2) == -1) {
                      dayArry.push(_txt2);
                  }
                  }
              });
              dayArry.sort(function (a, b) {
                  return a - b;
              });
              $(this).find('tbody td.m_date').each(function () {
                  var _txt3 = $(this).text();
                  if (!!_txt3) {
                      var _txt4 = parseInt(_txt3.split('-').join(''));
                      var _class2 = 'm_' + _txt4;
                      $(this).closest('tr').addClass(_class2);
                      if (dayArry2.indexOf(_txt4) == -1) {
                          dayArry2.push(_txt4);
                      }
                  }
              });
              dayArry2.sort(function (a, b) {
                  return a - b;
              });
              $(this).find('tbody td.worker').each(function (index) {
                  var _txt5 = $(this).text();
                  if (!!_txt5) {
                      var _class3 = _txt5;
                      if (workerArry.indexOf(_txt5) == -1) {
                          workerArry.push(_txt5);
                      }
                  }
              });
              workerArry.sort(function (a, b) {
                  return a - b;
              });
              var $select = $(this).find('thead th.c_date select');
              if ($select.length) {
                  for (var i in dayArry) {
                      var opt = dayArry[i];
                      $select.append('<option val="' + opt + '">' + opt + '</option>');
                  }
              }
              var $select2 = $(this).find('thead th.m_date select');
              if ($select2.length) {
                  for (var j in dayArry2) {
                      var opt2 = dayArry2[j];
                      $select2.append('<option val="' + opt2 + '">' + opt2 + '</option>');
                  }
              }
              var $select3 = $(this).find('thead th.worker select');
              if ($select3.length) {
                  for (var j in workerArry) {
                      var opt3 = workerArry[j];
                      $select3.append('<option val="' + opt3 + '">' + opt3 + '</option>');
                  }
              }
      
              var _isMouseDown = false;
              var _startX = '';
              var _scrollLeft = '';
              var _scrollChkHtml = '<div class="g_board_scroll"><div></div></div>';
              if (!_this.next('.g_board_scroll').length) _this.after(_scrollChkHtml);
              _this.on('mousedown', function (e) {
                  var _scrollWidth = _this.get(0).scrollWidthl;
                  var _thisWidth = _this.width();
                  if (_scrollWidth - _thisWidth > 0) {
                      _isMouseDown = true;
                      _this.addClass('catching');
                      _startX = e.pageX - _this.offset().left;
                      _scrollLeft = _this.scrollLeft();
                  }
              });
              _this.on('mouseup', function (e) {
                  _isMouseDown = false;
                  _this.removeClass('catching');
              });
              _this.on('mouseeleave', function (e) {
                  _isMouseDown = false;
                  _this.removeClass('catching');
              });
              _this.on('mousemove', function (e) {
                  if (!_isMouseDown) return;
                  e.preventDefault();
                  var _x = e.pageX - _this.offset().left;
                  var _walk = _x - _startX;
                  var _scroll = _scrollLeft - _walk;
                  _this.scrollLeft(_scroll);
              });
              var catchChk = function () {
                  var _sclWid = _this.get(0).scrollWidth - _this.width();
                  var _thisLeft = _this.scrollLeft();
                  (_sclWid > 0) ? _this.addClass('catch') : _this.removeClass('catch');
                  return (_thisLeft / _sclWid) * 100;
              };
              catchChk();
              _this.on('scroll resize', function (e) {
                  var _tar = _this.next('.g_board_scroll').find('>div');
                  var _per = catchChk();
                  _tar.css('width', _per + '%');
              });
          });
          $('.g_board thead th select').change(function () {
            $(this).parent('th').siblings('th').find('select').val('');
            var $thead = $(this).closest('thead');
            var $cVal = $thead.find('.c_date select').val();
            var $mVal = $thead.find('.m_date select').val();
            var $wVal = $thead.find('.worker select').val();
            var $tbody = $(this).closest('.g_board').find('tbody');
            if ($cVal == '' && $mVal == '' && $wVal == '') {
                $tbody.find('tr').removeAttr('style');
            } else {
                $tbody.find('tr').not('.hr').hide();
                if ($cVal != '') $tbody.find('.c_' + $cVal).show();
                if ($mVal != '') $tbody.find('.m_' + $mVal).show();
                if ($wVal != '') {
                    $($tbody.find('.worker')).each(function () {
                        if($wVal === $(this).text()) $(this).closest('tr').show();
                    });
                }
            }
          });
      },
      state: function () {
          $('.g_content tbody .c_date').each(function () {
              if (!$.trim($(this).html()) == '' || $(this).closest('tbody').find('.done').length) {
                  $(this).parent('tr').addClass('working');
              }
          });
          $('.g_content tbody .m_date').each(function () {
              if (!$.trim($(this).html()) == '' && !$(this).parent('tr').hasClass('del')) {
                  $(this).parent('tr').addClass('modify');
              }
          });
          $('.g_board_panel').each(function () {
              var $this = $(this);
              var $no = $this.find('table .no');
              var pageNum = function () {
                  var length = 0;
                  $no.each(function () {
                      length += 1;
                  });
                  return length;
              };
              var $noidx = 1;
              $this.find('tbody tr').each(function () {
              if ($(this).hasClass('cms')) {
                  $(this).find('.no').text('CMS');
              } else if ($(this).find('.no').length) {
                  $(this).find('.no').text($noidx);
                  $noidx++;
              }
              });
              var delNum = function () {
                  var length = 0;
                  $this.find('tbody tr.del').each(function () {
                      length += 1;
                  });
                  return length;
              };
              var ingNum = function () {
              var length = 0;
              $this.find('tbody tr.working').each(function () {
                  if (!$(this).hasClass('del')) length += 1;
              });
              return length;
              };
              var completeNum = function () {
                  var length = 0;
                  $this.find('tbody tr td.complete').each(function () {
                      if (!$(this).hasClass('del') && $(this).find('span').text() === '완료') length += 1;
                  });
                  return length;
              };
              var per = pageNum() === 0 ? 0 : Math.round((100 / pageNum()) * completeNum());
              if (per === 100) Math.floor((100 / pageNum()) * completeNum());
              $this.find('.total .num').text(pageNum());
              $this.find('.working .num').text(ingNum());
              $this.find('.cp_num .num').text(completeNum());
              $this.find('.ing .num').text(per);
              $this.data('bar-width', per);
          });
          var totalPageNum = function () {
              var length = 0;
              $('table .no').each(function () {
                  //if (!$(this).closest('.del').length) length += 1;
                  length += 1;
              });
              return length;
          };
          var totalDelPageNum = function () {
              var length = 0;
              $('table .no').each(function () {
                  if ($(this).closest('.del').length) length += 1;
              });
              return length;
          };
          var ingTotalNum = function () {
              var length = 0;
              $('table tr.working').each(function () {
                  if (!$(this).hasClass('del')) length += 1;
              });
              return length;
          };
          var completeTotalNum = function () {
              var length = 0;
              $('table td.complete').each(function () {
                  if (!$(this).parent('tr').hasClass('del') && $(this).find('span').text() === '완료') length += 1;
              });
              return length;
          };
          var perTotal = totalPageNum() === 0 ? 0 : Math.round((100 / totalPageNum()) * completeTotalNum());
          if (perTotal === 100) Math.floor((100 / totalPageNum()) * completeTotalNum());
          $('.g_project_status .total .num').text(totalPageNum());
          $('.g_project_status .del .num').text(totalDelPageNum());
          $('.g_project_status .working .num').text(ingTotalNum());
          $('.g_project_status .cp_num .num').text(completeTotalNum());
          $('.g_project_status .ing .num').text(perTotal);
          $('.g_project_status .bar').css('width', perTotal + '%');
      },
      UI: function () {
          var $thBtn = $('th button'),
              $btnResponsive = $('.btn_responsive'),
              $idLink = $('td.id a'),
              $projectSelect = $('.g_project .current'),
              $document = $(document),
              $currentName = $('nav a[href^="' + location.pathname.split("/")[5] + '"]'),
              $currentTile = $currentName.text(),
              $codeView = $('.g_guide_info .code_view'),
              $codeViewTarget = $('.g_guide_info .code_view h4 a'),
              $remark = $('.g_board .remark'),
              $project = $('body').attr('data-project');
          $currentName.closest('li').addClass('active').parents('li').addClass('active'); // 현재 메뉴 활성화
          if (!$('.btm_btn_set').length) $('body').append('<div class="btm_btn_set"><button type="button" class="btn_guide_top"><span class="offscreen">TOP</span></button><button type="button" class="btn_light_mode"><i></i><i></i><i></i><i></i><span class="offscreen">다크모드</span></button></div>');
          $('.g_project .g_list li').each(function () {
              var $this = $(this);
              if ($project.charAt(0).toUpperCase() + $project.slice(1) === $this.text()) {
                  $this.addClass('active');
                  $projectSelect.text($this.text());
              }
          });
          $projectSelect.on('click', function (e) {
              e.preventDefault();
              $(this).toggleClass('active').next('.g_list').slideToggle();
          });
          $document.on('click', function (e) {
              var _a = e.target;
              if ($(_a).closest('.g_project').length === 0) {
                  $('.g_project .current').removeClass('active').next('.g_list').slideUp();
              }
          });
          if ($('.code').length > 0) {
              SyntaxHighlighter.all();
          }
          $codeViewTarget.on('click', function () {
              var $this = $(this).closest('.code_view');
              if (!$this.hasClass('active')) {
                  $codeView.removeClass('active');
                  $this.addClass('active');
              } else {
                  $this.removeClass('active');
              }
          });
          $thBtn.on('click', function () {
              var $this = $(this);
              var $idx = $this.closest('th').index();
              var $grid = $this.closest('.g_board');
              $this.closest('th').hide();
              $grid.find('tr').not('.hr').each(function () {
                  $(this).find('td').eq($idx).hide();
              });
              $grid.resize();
              var thNum = $grid.find('thead th:not([style*="display: none"])').length;
              $grid.find('.hr th').attr('colspan', thNum);
          });
          $(document).on('click', 'td.id a', function (e) {
              var $this = $(this),
              $btnNewWindow = $('.frame_device .newWindow'),
              pID = $this.text(),
              pName = $this.closest('td').siblings('td.name').text(),
              url = $this.attr('href');
              $this.closest('tr').addClass('active').siblings('tr').removeClass('active');
              $('.frame_device .p_id').text(pID);
              $('.frame_device .p_name').text(pName);
              $('.frame_device .head').addClass('active');
              setTimeout(function () {
                  $('.frame_device .head').removeClass('active');
              }, 500);
              $btnNewWindow.attr('href', url);
          });
          $(document).on('mouseover', 'td a.btn_hover', function (e) {
              var url = $(this).attr('href'),
                  $device = $('.frame_device iframe'),
                  $deviceID = $('.frame_device .p_id'),
                  $deviceName = $('.frame_device .p_name'),
                  $link = $('.frame_device .newWindow'),
                  _screenID = $(this).closest('tr').find('td.id>a').text(),
                  _screenName = $(this).closest('tr').find('td.name').text();
              $device.attr('src', url);
              $link.attr('href', url);
              $deviceID.text(_screenID);
              $deviceName.text(_screenName);
          });
          $btnResponsive.on('click', function () {
              workSheet.set.mToggle();
              workSheet.set.devicePreview();
              var $frameDevice = $('.frame_device');
              if ($frameDevice.hasClass('pop')) {
                  $frameDevice.drags('opt', 'destroy');
                  $('.g_project_status').removeAttr('style');
                  $frameDevice.removeClass('pop').removeAttr('style');
              }
          });
          $remark.on('click', function () {
              var $clone = $(this).clone(),
              $remarkPop = '<div class="remark_pop"><h2>History</h2><div class="history"></div>',
              $dimmed = '<div class="dimmed"></div>';
              $('body').append($remarkPop, $dimmed);
              $('.remark_pop .history').append($clone);
          });
          $(document).on('click', '.dimmed', function () {
              $('.remark_pop, .dimmed').remove();
          });
      },
      slide: function () {
          var $tab = $('.g_board_tab');
          if ($tab.length > 0) {
              tabSwiper = new Swiper('.g_board_tab', {
                  slidesPerView: 'auto',
                  freeMode: true
              });
              $('.g_board_tab .swiper-slide').on('click', function (e) {
                  var $this = $(this),
                      gnbWidth = $tab.width(),
                      offset = $this.width() + $this.offset().left + $this.width(),
                      myIndex = $this.index();
                  (gnbWidth < offset) ? tabSwiper.slideNext() : tabSwiper.slideTo(myIndex - 1);
              });
              $(window).on('load', function () {
                  tabSwiper.update();
              });
          }
      },
      devicePreview: function () {
          var $currentTab = $('.g_board_tab li.active button').text(),
              $panel = $('.g_board_panel'),
              $currentPanel = $('.g_board_panel.active');
          var $firstTr = ($currentTab === '전체보기') ? $panel.eq(0) : $currentPanel;
          var $firstLink = $firstTr.find('tbody a').first(),
              _url = $firstLink.attr('href'),
              _screenID = $firstLink.text(),
              _screenName = $firstLink.closest('tr').find('.name').text();
          if ($('.frame_device').length) {
              var $device = $('.frame_device iframe'),
              $deviceID = $('.frame_device .p_id'),
              $deviceName = $('.frame_device .p_name');
              $device.attr('src', _url);
              $deviceID.text(_screenID);
              $deviceName.text(_screenName);
          } else {
              var $html = '';
              $html += '<div class="frame_device">';
              $html += '<div class="head">';
              $html += '<a href="' + _url + '" class="newWindow" target="_blank"><span class="offscreen">새창으로</span></a>';
              $html += '<h2><span class="p_id">' + _screenID + '</span><span class="p_name">' + _screenName + '</span></h2>';
              $html += '<button type="button" class="disconnect"><span class="offscreen">팝업으로 분리</span></button>';
              $html += '</div>';
              $html += '<div class="device">';
              $html += '<div class="btn_size_set">';
              $html += '<button type="button">320</button>';
              $html += '<button type="button">360</button>';
              $html += '<button type="button">375</button>';
              $html += '<button type="button">768</button>';
              $html += '</div>';
              $html += '<iframe src="' + _url + '" frameborder="0" name="device"></iframe>';
              $html += '</div>';
              $html += '</div>';
              $('#gWrap').append($html);
          }
          var $btnSize = $('.btn_size_set button'),
              $btnPopDevice = $('.frame_device .disconnect');
          $btnSize.off('click').on('click', function (e) {
              e.preventDefault();
              var $this = $(this), $frameDevice = $('.frame_device'), deviceW = $this.text(), frameW = Number(deviceW) + 10, wrapP = Number(deviceW) + 10;
              $frameDevice.css('width', frameW);
              if (!$frameDevice.hasClass('pop')) {
              $('#gContainer').css('marginRight', wrapP);
              $('.g_project_status').css('paddingRight', wrapP);
              $('html.m .g_board_tab').css('right', wrapP);
              $('html.m .panel_head').css('right', wrapP);
              $('html.m .search_title').css('right', wrapP);
              }
          });
          $btnPopDevice.off('click').on('click', function () {
              workSheet.set.mToggle();
              var $frameDevice = $('.frame_device'),
              _a = $('.g_board table tbody td.id a');
              $frameDevice.toggleClass('pop');
              if ($frameDevice.hasClass('pop')) {
                  $frameDevice.drags('opt');
                  _a.attr('target', 'device');
              } else {
                  $frameDevice.drags('opt', 'destroy');
                  $('.g_project_status').removeAttr('style');
                  $frameDevice.removeClass('pop').removeAttr('style');
              }
          });
          workSheet.set.frameResize();
      },
      searcher: function (target) {
          var $gContent = $('.g_content'),
              $thead = $('.g_board_panel thead'),
              $tbody = $('.g_board_panel tbody'),
              $searchF = $(target);
          function keyShow() {
              $('body').removeHighlight();
              if ($searchF.val()) $('body').highlight($searchF.val());
              $thead.hide();
              $tbody.find('tr').hide();
              $('.highlight').closest('tr').show();
              //$tbody.find('tr')
              if (!$gContent.hasClass('searcher')) $gContent.addClass('searcher');
              if ($('.search_title').length == 0) $gContent.prepend('<div class="search_title"><h3>검색결과</h3><button type="button" class="btn_search_cancel">검색취소</button></div>');
          }
          function keyHide() {
              $('body').removeHighlight();
              $thead.show();
              $tbody.find('tr').show();
              $gContent.removeClass('searcher');
              $('#Gsearch').val('').change().focus();
          }
          $(document).on('keyup focus', target, function () {
              var $this = $(this), $val = $this.val();
              if ($val != '') {
                  if (!$this.next('.btn_search_del').length) $this.after('<a href="#" class="btn_search_del" role="button"><span class="offscreen">입력내용삭제</span></a>');
                  $this.next('.btn_search_del').addClass('on');
              } else {
                  if ($this.next('.btn_search_del').length) $this.next('.btn_search_del').remove();
              }
          }).on('focusout', target, function () {
              var $this = $(this);
              if ($this.next('.btn_search_del').length) {
                  $this.next('.btn_search_del').removeClass('on');
                  setTimeout(function () { $this.next('.btn_search_del').remove() }, 400);
              }
          });
          $('#btnGsearch').on('click', function () {
              keyShow();
          });
          $searchF.on('keydown', function (e) {
              var $keyCode = e.keyCode ? e.keyCode : e.which;
              if (e.target == this && $keyCode == 13 && $(this).val() != '') {
                  keyShow();
              }
          });
          $(document).on('click', '.btn_search_del, .btn_search_cancel', function () {
              keyHide();
          });
      },
      frameResize: function () {
          var _wH = $(window).height(),
              _hH = $('#gHeader').height(),
              _iH = $('.frame_device .head').height(),
              $frame = $('.frame_device iframe');
          $frame.css('height', _wH - _hH - _iH - 65);
      },
      resize: function () {
          $(window).on('resize', function () {
              var $hr = $('tr.hr th'),
              windowWidth = $(window).width(),
              _a = $('.g_board table tbody td.id a'),
              $device = $('.frame_device');
              if (windowWidth < 1024) {
                  $hr.attr('colspan', '2');
                  $('html').removeClass('m');
                  _a.attr('target', '_blank');
                  $device.removeAttr('style');
              } else {
                  $hr.attr('colspan', '13');
              }
              workSheet.set.frameResize();
          });
      },
      scroll: function () {
          $(window).scroll(function () {
              workSheet.set.btnSet();
              workSheet.set.headPixed();
          });
          $(window).scroll();
      },
      btnSet: function () {
          var $window = $(window), $btmBtnSet = $('.btm_btn_set'), $btnTop = $('.btn_guide_top'), $btnLightMode = $('.btn_light_mode');
          ($(window).scrollTop() > 100) ? $btmBtnSet.addClass('active') : $btmBtnSet.removeClass('active');
          $btnTop.on('click', function () {
              $(window).scrollTop(0);
          });
          $btnLightMode.off('click').on('click', function () {
              workSheet.set.toggle_light_mode();
          });
      },
      headPixed: function () {
          var $window = $(window), $wrap = $('#gWrap'), $gHeader = $('#gHeader'), $gTitle = $('.g_titles');
          ($(window).scrollTop() > $gTitle.height() && $(window).width() > 1024) ? $wrap.addClass('fixed') : $wrap.removeClass('fixed');
      },
      mToggle: function () {
          var _a = $('.g_board table tbody td.id a'),
              $device = $('.frame_device');
          if ($('html').hasClass('m')) {
              $('html').removeClass('m');
              if (!$device.hasClass('pop')) _a.attr('target', '_blank'), $('#gContainer, .frame_device').removeAttr('style');
              $('.g_board_tab').css('right', 0);
              $('.panel_head').css('right', 0);
              $('.search_title').css('right', 0);
          } else {
              $('html').addClass('m')
              _a.attr('target', 'device');
          }
      },
      toggle_light_mode: function () {
          var app = $('html');
          if (localStorage.lightMode == "dark") {
              localStorage.lightMode = "light";
              app.attr("light-mode", "light").removeClass('dark');
          } else {
              localStorage.lightMode = "dark";
              app.attr("light-mode", "dark").addClass('dark');
          }
      },
      shortcut: function () {
          var prevTargetText = null;
          var $gTarget = $('.g_target');
          $('.g_content').each(function (index, item) {
              var targets = $(item).find('tbody tr td:nth-child(5)');
              $.each(targets, function (i, target) {
                  var area = $(target).closest('.g_board_panel').find('.g_target>ul');
                  var targetText = $(target).text();
                  var row = $(target).parent();
                  if (prevTargetText == targetText || targetText == '' || row.hasClass('del')) return;
                  row.attr('id', 'target' + i);
                  area.append('<li class="swiper-slide"><a href="#target' + i + '" class="go">' + targetText + '</a></li>');
                  prevTargetText = $(target).text();
              });
          });
          $gTarget.each(function (i, item) {
              targetSwiper[i] = new Swiper(item, {
                  slidesPerView: 'auto',
                  freeMode: true
              });
              $(item).find('.swiper-slide>a').on('click', function (e) {
                  e.preventDefault();
                  var $this = $(this);
                  var cWidth = Math.floor($(item).width());
                  var offset = Math.floor($this.width() + $this.position().left + $this.width());
                  var myIndex = $this.index();
                  var targetID = $this.attr('href');
                  $this.addClass('active').parent('li').siblings('li').find('a').removeClass('active');
                  (cWidth < offset) ? targetSwiper[i].slideNext() : targetSwiper[i].slideTo(myIndex - 1);
                  $(targetID).addClass('focus');
                  setTimeout(function () {
                      $(targetID).removeClass('focus');
                  }, 1000);
                  $('html, body').animate({
                      scrollTop: ($(targetID).offset().top - 200) + 'px'
                  }, 300);
              });
          });
      },
      etcListChk: function () {
          $('.g_board_panel').each(function () {
              var $this = $(this),
              $design = $this.find('.remark li.design'),
              $plan = $this.find('.remark li.plan');
              if ($design.length) {
                  var num = $design.length,
                      $btn = $this.find('.btn_design');
                  $design.closest('tr').addClass('design');
                  if (!$btn.length) $this.find('.g_alert_btn_set').append('<button type="button" class="btn_design">디자인파트에서 확인 필요한 항목이 <strong>' + num + '</strong>개 있습니다.</button>');
              }
              if ($plan.length) {
                  var num = $plan.length,
                      $btn = $this.find('.btn_plan');
                  $plan.closest('tr').addClass('plan');
                  if (!$btn.length) $this.find('.g_alert_btn_set').append('<button type="button" class="btn_plan">기획파트에서 확인 필요한 항목이 <strong>' + num + '</strong>개 있습니다.</button>');
              }
          });
          $('.g_alert_btn_set').find('button').on('click', function (e) {
              var $this = $(this),
              $tr = $this.closest('.g_board_panel').find('.g_board tbody tr');
              if ($this.hasClass('btn_design')) {
                  $this.siblings().removeClass('active');
                  if (!$this.hasClass('active')) {
                      $this.addClass('active');
                      $tr.hide().siblings('tr.design').show().find('.remark>li').show();
                  } else {
                      $this.removeClass('active');
                      $tr.show().siblings('tr.design').find('.remark>li').removeAttr('style');
                  }
              }
              if ($this.hasClass('btn_plan')) {
                  $this.siblings().removeClass('active');
                  if (!$this.hasClass('active')) {
                      $this.addClass('active');
                      $tr.hide().siblings('tr.plan').show().find('.remark>li').show();
                  } else {
                      $this.removeClass('active');
                      $tr.show().siblings('tr.plan').find('.remark>li').removeAttr('style');
                  }
              }
          });
          if (localStorage.lightMode == "dark") $('.g_board table tbody td.id a').addClass('dark');
      }
  }

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
              var z_idx = $drag.css('z-index'),
                  drg_h = $drag.outerHeight(),
                  drg_w = $drag.outerWidth(),
                  pos_y = $drag.offset().top + drg_h - e.pageY,
                  pos_x = $drag.offset().left + drg_w - e.pageX;
              $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
                  $('.draggable').offset({
                      top: e.pageY + pos_y - drg_h,
                      left: e.pageX + pos_x - drg_w
                  }).on("mouseup", function () {
                      $(this).removeClass('draggable').css('z-index', z_idx);
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
          } else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
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

  return {
      init,
      workSheet
  }
}
window.UIGuide = new UIGuide();
$(function () {
  window.UIGuide.init();
});