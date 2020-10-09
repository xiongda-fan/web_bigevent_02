//入口函数
$(function() {
    //1. 定义校验规则
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度为1 ~ 6位之间";
            }
        }
    });



    //2. 初始化用户信息
    initUserInfo();


    //初始化用户信息函数封装 后面页面还需要用
    //导出layer
    var layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //成功,后渲染
                form.val("formUserInfo", res.data);
            }
        })
    }


    //3. 表单重置
    $("#btnReset").on('click', function(e) {
        //阻止表单的默认重置
        e.preventDefault();
        //重新渲染用户
        initUserInfo();
    })


    //4. 修改用户信息
    $(".layui-form").on('submit', function(e) {
        //阻止表单的默认提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //成功
                layer.msg("恭喜您，修改用户信息成功！");
                //调用父框架的全局属性方法
                window.parent.getUserInfo();
            }
        })
    })
})