$(function() {
    //点击 “去注册账号”的链接
    $("#link_reg").on('click', function() {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    //点击 “去登录”的链接
    $("#link_login").on('click', function() {
        $(".login-box").show();
        $(".reg-box").hide();
    })



    // 2. 自定义表单验证
    //从 layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    //通过 form.verify()函数自定义校验规则
    form.verify({
        //自定义了一个叫做 pwd 校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致的规则
        repwd: function(value) {
            //通过形参拿到的是确认密码框中的内容
            //还需要拿到密码框中的内容
            //然后进行一次等于的判断
            //如果判断失败，则return一个提示消息即可
            var pwd = $(".reg-box input[name=password]").val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })



    //监听注册表单的提交事件
    $("#form_reg").on('submit', function(e) {
        //1. 阻止表单的默认提交行为
        e.preventDefault();
        //2. 发起ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val(),
            },
            success: function(res) {
                //判断返回状态
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                //提交成功后的处理代码
                layer.msg(res.message);
                //手动切换到登录表单
                $("#link_login").click();
                //重置form表单
                $("#form_reg")[0].reset();
            }
        });
    })



    //登录功能（给form标签绑定事件，button按钮触发提交事件）
    $("#form_login").submit(function(e) {
        //阻止表单默认提交
        e.preventDefault();
        //发送ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                //判断返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //提示信息  保存token 跳转页面
                layer.msg("恭喜您，登录成功！！！");
                //保存 token 未来接口要使用token
                localStorage.setItem('token', res.token);
                //跳转
                location.href = "/index.html";
            }
        })
    })
})