/* 작업환경이 퍼블리싱 환경인지 체크 */

if(!window.SPA) {
    var publish = function() {
        function constructor() {
            return publish();
        }

        function init() {
            //css
            [
                {src : "/msbiz/app/css/common.css", description: "공통 요소별 스타일"},
                // {src : "/msbiz/app/css/common_mix.css", description: "공통 요소별 스타일"},
                {src : "/msbiz/app/css/style.css", description: "운영 공통 적용 스타일"}
            ].forEach(function(css) {
                let cssFile = document.createElement('link');
                cssFile.rel = "stylesheet";
                cssFile.dataset.description = css.description;
                cssFile.href = css.src;
                document.querySelector('head').insertAdjacentElement('beforeend', cssFile);
            });

            //js
            inportJs();

            
        }

        /**
         * js 파일 include 순서가 중요하여 async/await 사용
         * jQuery 먼저 삽입되어야 함
         */
        async function inportJs() {
                await promiseImportJS("/msbiz/app/js/library/jquery-3.3.1-min.js").catch('"/msbiz/app/js/library/jquery-3.3.1-min.js" 파일 include 실패!!');
                await promiseImportJS("/msbiz/app/js/library/jquery-ui.min.js").catch('"/msbiz/app/js/library/jquery-ui.min.js" 파일 include 실패!!');
                await promiseImportJS("/msbiz/app/js/common_ui.js").catch('"/msbiz/app/js/common_ui.js" 파일 include 실패!!');
                await promiseImportJS("/msbiz/app/js/publish.js").catch('"/msbiz/app/js/publish.js" 파일 include 실패!!');

                if(window.UICommon) {
                    window.UICommon.init();
                } else {
                    console.log('UICommon 실패!')
                }
        }

        function promiseImportJS(src) {
            return new Promise(function(resolve, reject){
                let s = document.createElement('script');
                let r = false;
                s.type = 'text/javascript';
                s.src = src;
                s.async = false;
                s.onerror = function(err){
                    reject(err, r);
                }
                s.onload = s.onreadystatechange = function() {
                    if(!r && (!this.readyState || this.readyState == 'complete')) {
                        r = true;
                        resolve();
                    }
                }
                let t = document.getElementsByTagName('head')[0];
                t.appendChild(s);
            });
        }

        return {
            init:init
        }
    }
    window.publish = new publish();
    window.publish.init();
}
