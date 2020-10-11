$(function() {
    var form = layui.form;
    var layer = layui.layer;
    //调用函数
    initCate();
    //封装函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    //校验
                    return layer.msg(res.message)
                }
                //赋值  渲染form
                var str = template('tpl-cate', res);
                $("[name=cate_id]").html(str);
                form.render();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //4. 点击按钮  选择图片
    $("#btnChooseImage").on('click', function() {
        $("#coverFile").click();
    })


    //5. 设置图片
    $("#coverFile").change(function(e) {
        //拿到用户选择的文件
        var file = e.target.files[0];
        //非空校验  URL.createObjectURL() 参数不能为 undefined
        if (file == undefined) {
            return layer.msg("请选择文件！")
        }
        //根据选择的文件 创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    //6. 设置状态
    // 定义文章的发布状态
    var state = "已发布";
    //为表单绑定点击事件处理函数
    $("#btnSave2").on('click', function() {
        state = "草稿"
    })


    //7. 添加文章
    $("#form-pub").on('submit', function(e) {
        //阻止默认提交
        e.preventDefault();
        //创建FromData对象  收集数据
        var fd = new FormData(this);
        //放入状态
        fd.append("state", state);
        //放入图片
        $image.cropper("getCroppedCanvas", { //创建一个 Canvas 画布
                width: 400,
                height: 200,
            })
            .toBlob(function(blob) { //将 Canvas 画布上的内容  转化为文件对象
                //得到文件对象后 进行后续的操作
                fd.append("cover_img", blob);
                //发送 ajax请求  要在 toBLOd函数里面!!!!
                // console.log(...fd);
                // fd.forEach(function(value, key) {
                //     console.log(key, value);
                // })
                publishArticle(fd);
            })
    });


    //封装发布文章函数
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //跳转页面
                // location.href = "/article/art_list.html";
                //去除BUG
                layer.msg("恭喜您，添加文章成功，跳转中........")
                setTimeout(function() {
                    window.parent.document.querySelector("#art_list").click();
                }, 2500);
            }
        })
    }
})