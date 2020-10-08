//入口函数
$(function() {
    //1. 获取用户信息
    getUserInfo();

    //2.退出
    var layer = layui.layer;
    $("#btn-logout").on('click', function() {
        //框架提供的询问框
        layer.confirm('是否确认退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //1. 清空本地存储的token
            localStorage.removeItem("token");
            //2. 页面跳转
            location.href = "/login.html";
            //layui 自己提供的关闭询问框功能
            layer.close(index);
        });
    })
});


//获取用户信息封装函数
// 注意 ，位置写到入口函数外面 后面代码中要使用这个方法
function getUserInfo() {
    //发送ajax请求
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     //重新登陆 因为token过期事件12小时
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function(res) {
            console.log(res);
            //判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            //请求成功，渲染用户头衔信息
            renderAvatar(res.data);
        },

        //无论成功还是失败 都会触发complete方法
        // complete: function(res) {
        //     console.log(res);
        //     //判断 如果是身份认证失败  强制跳转回登陆页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         //1. 删除本地的token
        //         localStorage.removeItem("token");
        //         //2. 页面跳转
        //         location.href = "/login.html";
        //     }
        // }
    });
}


//封装用户头像渲染函数
function renderAvatar(user) {
    //1. 用户名（昵称优先  没有用username）
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    //用户头像
    if (user.user_pic !== null) {
        //有头像
        $(".layui-nav-img").show().attr("src", user.user_pic);
        $(".user-avatar").hide();
    } else {
        //没有头像
        $(".layui-nav-img").hide();
        //转换为大写
        var text = name[0].toUpperCase();
        $(".user-avatar").show().html(text);
    }
}