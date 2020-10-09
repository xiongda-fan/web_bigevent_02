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

    //对需要权限的接口配置头信息
    //必须以my开头的才行
    if (params.url.indexOf("/my/") !== -1) {
        params.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }


    //3. 登录拦截    拦截所有响应  判断身份认证信息
    //无论成功还是失败 都会触发complete方法
    params.complete = function(res) {
        // console.log(res);
        //判断 如果是身份认证失败  强制跳转回登陆页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            //1. 删除本地的token
            localStorage.removeItem("token");
            //2. 页面跳转
            location.href = "/login.html";
        }
    }
})