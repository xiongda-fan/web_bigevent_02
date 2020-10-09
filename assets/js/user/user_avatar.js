$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //给上传按钮绑定点击事件
    $("#btnChooseImage").on('click', function() {
        $("#file").click();
    })


    //为文件选择框绑定change事件
    $("#file").on('change', function(e) {
        //1. 拿到用户选择的文件
        var files = e.target.files;
        if (files.length === 0) {
            return layui.layer.msg("请选择用户头像！")
        }
        //选择成功 修改图片
        //1. 拿到用户选择的文件
        var file = e.target.files[0];
        //2. 根据选择的文件  创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        //3. 先销毁旧的裁剪区域 再从新设置图片路劲  之后再重新设置裁剪区域与
        $image
            .cropper("destroy") //销毁旧的裁剪区域
            .attr('src', newImgURL) //重新设置图片路劲
            .cropper(options) //重新初始化裁剪区域
    });



    //为确定按钮绑定点击事件
    $("#btnUpload").on('click', function() {
        //获取base64格式类型的头像（字符串）
        var dataURL = $image
            .cropper("getCroppedCanvas", { // 创建一个 Canvas 画布
                width: 100,
                height: 100,
            })
            .toDataURL("image/png") // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        console.log(dataURL);
        console.log(typeof dataURL);
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg("恭喜您，更换头像成功！");
                window.parent.getUserInfo();
            }
        })
    })

    getUserInfo();
    //渲染默认图像
    function getUserInfo() {
        //发送ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                console.log(res);
                //判断状态码
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                //请求成功，渲染用户头衔信息

                $image.cropper("destroy") //销毁旧的裁剪区域
                    .attr('src', res.data.user_pic) //重新设置图片路劲
                    .cropper(options) //重新初始化裁剪区域
            },

        });
    }
})