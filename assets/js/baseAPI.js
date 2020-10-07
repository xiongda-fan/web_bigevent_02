//1. 开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net';
//1. 测试环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net';
//1. 生产环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net';


//拦截所有ajax请求 : get/post/ajax
//处理参数
$.ajaxPrefilter(function(params) {
    // alert(params.url)
    //拼接对应换进的服务器地址
    params.url = baseURL + params.url;
    // alert(params.url)
})