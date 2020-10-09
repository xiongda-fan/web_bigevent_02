//入口函数
$(function() {
    //1. 定义验证规则
    var form = layui.form;
    form.verify({
        //所有的密码都要有的验证规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //新旧密码不能相同
        samePwd: function(value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新旧密码不能相同";
            }
        },
        //判断两次新密码是否一致
        rePwd: function(value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次新密码输入不一致！";
            }
        }
    });


    //2. 修改密码
    $(".layui-form").on('submit', function(e) {
        //阻止表单的默认提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: "POST",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg("修改密码成功！");
                $(".layui-form")[0].reset();
            }
        })
    })
})