$(function () {
    btnSet();
    function btnSet() {
        var $btmBtnSet = $(parent.document).find('.btm_btn_set');
        var $btnTop = $(parent.document).find('.btn_guide_top');
        $btnTop.on('click', function () {
            $(window).scrollTop(0);
        });
        $(window).scroll(function () {
            ($(window).scrollTop() > 100) ? $btmBtnSet.addClass('active') : $btmBtnSet.removeClass('active');
        });
    }
});