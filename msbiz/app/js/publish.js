// console.log(localStorage.lightMode);
//             setTimeout(function(){
//                 (localStorage.lightMode == "dark") ? $('html').addClass('dark') : $('html').removeClass('dark');
//             },300);



$(function(){
        (localStorage.lightMode == "dark") ? $('html').addClass('dark') : $('html').removeClass('dark');
})