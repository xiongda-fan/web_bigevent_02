$(function() {
    //为 art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function(dtStr) {
            var dt = new Date(dtStr)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        //在个位数的左侧填充 0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义查询参数 
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: "", //文章分类的 Id
        state: "", //文章的状态  可选值为：已发布和草稿
    }

    initTable();

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var str = template("tpl-table", res);
                $("tbody").html(str);
                //渲染文章列表的同时  渲染分页
                renderPage(res.total)
            }
        })
    }


    //3. 初始化分类
    var form = layui.form // 导入form
    initCate(); //调用函数
    //封装函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                //校验
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //赋值  渲染form
                var str = template("tpl-cate", res);
                $("[name=cate_id]").html(str);
                form.render(); //
            }
        })
    }

    //筛选功能
    $("#form-search").on('submit', function(e) {
        //阻止默认提交
        e.preventDefault();
        //获取
        var state = $("[name=state]").val();
        var cate_id = $("[name=cate_id]").val();
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        //初始化文章列表
        initTable();
    })


    //分页功能模块
    var laypage = layui.laypage;

    function renderPage(num) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意  这里的test1 是 ID
            count: num, //数据总数  从服务器获得
            limit: q.pagesize, //每页几条数据
            curr: q.pagenum, //设置默认被选中的分页

            //分页模块设置 显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换时 触发 jump 回调
            //触发 JUMP  ： 分页初始化的时候  页码改变的时候 

            jump: function(obj, first) {
                //obj 所有参数所在的对象  first 是否是第一次初始化分页
                //改变当前页
                q.pagenum = obj.curr;
                //将每页显示的条数 赋值给 pagesize 然后触发文章列表初始化
                q.pagesize = obj.limit;
                //判断 不是第一次初始化分页  才能重新调用初始化文章列表
                if (!first) {
                    //初始化文章列表
                    initTable();
                }
            }
        })
    }


    //通过代理的方式  为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function() {
        //先获取id 进入到函数中this代指就改变了
        var id = $(this).attr("data-id");
        //显示对话框
        layui.layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    //因为更新成功  所以要重新渲染页面中的数据
                    //页面汇总删除按钮个书等于1 页码大于1
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                    layui.layer.msg("恭喜您，文章删除成功！");
                }
            })
            layui.layer.close(index);
        });

    })
})