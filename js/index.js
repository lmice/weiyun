//页面主要功能实现

//获取容器
var container = $('.container');
//记录页面当前pid
var pid = 0;

//记录当前页面的所有的文件
var nowFile = [];


//记录当前页面被选中的所有的文件
var checked_file = [];



if (localStorage.getItem('dta')) {
    data = JSON.parse(localStorage.getItem('dta'));
}else{
    localStorage.setItem('dta', JSON.stringify(data));
}

initFile();


//新建文件夹
$('.newfile').click(function () {
    var type = 'folder';
    var name = '';
    var id = newId();


    //清空选中状态
    $('.checkall').removeClass('checked');
    for (var i=0;i<nowFile.length;i++){
        $(nowFile[i]).removeClass('active')
    }
    checked_file = [];
    poFn();

    container.html( '<li id="new" class="item folder"><span class="check_icon"></span><div class="icon"></div><input id="input" type="text"></li>' + container.html() );
    $('#input').focus();
    $('#input').keydown(function (e) {
        var _this = $(this);
        if(e.keyCode==13){
            $('#new').remove();
            if(_this.val()!=''){
                name = _this.val();
                newFile(type,pid,id,name);
            };
            newfile_left();
        }
    });
    $('#input').blur(function () {
        var _this = $(this);
        if(_this.val()!=''){
            name = _this.val();
            newFile(type,pid,id,name);
        };
        $('#new').remove();
        nowData();
        newfile_left();
    });

});


//文件夹左上角checkbox事件    事件委托
$('.container').on( 'click','.folder .check_icon',function (e) {
    for (var i = 0; i<nowFile.length;i++){
        if($(e.target).parents('.folder')[0]==nowFile[i]){
            var target = $(nowFile[i]);
            var has_target = false;
            for (var z = 0 ; z < checked_file.length;z++){
                if(target[0]==checked_file[z]){
                    target.removeClass('active');
                    checked_file.splice(z,1);
                    has_target = true;
                }
            }
            if(!has_target){
                target.addClass('active');
                checked_file.push(target[0]);
            }
        }
    }
    checkedAll();
    poFn();
    e.stopPropagation()
});

//全选
$('.checkall').click(function () {
    var _this = $(this);
    if(_this.hasClass('checked')){
        _this.removeClass('checked');
        for (var i=0;i<nowFile.length;i++){
            $(nowFile[i]).removeClass('active')
        }
        checked_file = [];
    }else{
        _this.addClass('checked');
        for (var i=0;i<nowFile.length;i++){
            $(nowFile[i]).addClass('active');
        }
        for(var i=0;i<nowFile.length;i++){
            checked_file.push(nowFile[i]);
        }
    }
    poFn();
});

//文件夹单击事件
container.on( 'click','.folder',function (e) {
    for (var i = 0; i<nowFile.length;i++){
        if($(e.target).parents('.folder')[0]==nowFile[i] || e.target ==nowFile[i] ){
            var target = $(nowFile[i]);
            pid = target.attr('_id');
            initFile();
        }
    }
    //生成面包屑导航
    breadcrumbs(pid);
    //清空选中文件夹数组
    checked_file = [];

    poFn()
});


//面包屑导航 点击
$('.breadcrumbs').on('click','.item',function (e) {
    var target = $(e.target);
    pid = target.attr('_id');
    breadcrumbs(pid);
    initFile();
});
$('.weiyun').click(function () {
    var target = $(this);
    pid = target.attr('_id');
    breadcrumbs(pid);
    initFile();
});


//重命名

$('.rename').click(function (e) {
    if(checked_file.length !=1) return;
    var target = $(checked_file[0]);
    var id =target.attr('_id');

    var p = target.children('.name');
    var input = $('<input id="input" type="text">').replaceAll(p);
    input.val(p.html());
    input.focus();
    input.select();
    input.keydown(function (e) {
        if(e.keyCode == 13){
            input.blur();
        }
    });
    input.blur(function () {
        var _this = $(this);
        p.replaceAll(_this);
        if(_this.val() == ''){
            p.html(p.html())
        }else{
            p.html(_this.val());

            var dds = $('.side dd')
            for (var i=0;i<dds.length;i++){
                var dds_id = $(dds[i]).attr('_id')
                if(dds_id == id ){
                    $(dds[i]).children('.name').html(_this.val())
                }
            }

        }
        renNameData(id,p.html());
    });
});


//删除
$('.delete').click(function () {
    if(checked_file.length ==0 ) return;
    for(var i = checked_file.length-1 ; i>=0 ;i--){
        $(checked_file[i]).remove()
    }
    for(var i = 0; i<checked_file.length;i++){
        var id = $(checked_file[i]).attr('_id');
        delData(id)

        var dds = $('.side dd');
        for (var z=0;z<dds.length;z++){
            var dds_id = $(dds[z]).attr('_id');
            if(dds_id == id ){
                $(dds[z]).remove()
            }
        }
    }
    checkedAll();
    checked_file = [];
});

//移动到
$('.moveto').click(function () {
    if(checked_file == 0) return;
    $('.tips').css('left','50%').css('marginLeft','-305px');
    cabinet(0);
    $('.yes').click(function () {
        var off = true;
        for(var i = checked_file.length-1 ; i>=0 ;i--){
            var id = $(checked_file[i]).attr('_id');
            var pid = $('.yes').attr('_id');
            if (!itself(id,pid)){
                off = false
            }
        }
        if(off){
            for(var i = checked_file.length-1 ; i>=0 ;i--){
                var id = $(checked_file[i]).attr('_id');
                var pid = $('.yes').attr('_id');
                $(checked_file[i]).remove();
                moveTo(id,pid);
            }

        }else{
            return alert('不能选择自身及子级文件夹');
        }

        checked_file = [];
        $('.tips').css('left','-999px')
    });
});

//复制
$('.copy').click(function () {
    if(checked_file == 0) return;
    $('.tips').css('left','50%').css('marginLeft','-305px');
    cabinet(0);
    $('.yes').click(function () {
        var off = true;
        var pid = $('.yes').attr('_id');
        for(var i = checked_file.length-1 ; i>=0 ;i--){
            var id = $(checked_file[i]).attr('_id');
            if (!itself(id,pid)){
                off = false
            }
        }
        if(off){
            for(var i = checked_file.length-1 ; i>=0 ;i--){
                var id = $(checked_file[i]).attr('_id');
                copy(id,pid);
            }
        }else {
            return alert('不能选择自身及子级文件夹');
        }
        $('.tips').css('left','-999px')
    })
});

$('.no').click(function () {
    $('.tips').css('left','-999px');
});

//左侧树导航
if(data.length != 0 ){
    $('.side .active .arr').addClass('kai');
}
var html = $('.side').html();
for (var i=0; i<data.length;i++){
    if(data[i].pid==0){
        for(var z=0; z<data.length;z++){
            if(data[z].pid == data[i].id){
                html += '<dd _id="' + data[i].id + '"><span class="arr icon left"></span> <span class="f icon left"></span> <span class="name left">'+data[i].name +'</span> </dd>'
                i++;
                break;
            }
        }
        html += '<dd _id="' + data[i].id + '"><span class="arr icon left wu"></span> <span class="f icon left"></span> <span class="name left">'+data[i].name +'</span> </dd>'

    }
}
$('.side').html(html);
$('.side').on('click','dd', function (e) {
    var _this = $(e.currentTarget);
    var pad = parseInt(_this.css('paddingLeft'))+10;
    var id = _this.attr('_id');
    var arr = _this.find('.arr');
    var a = _this.siblings('dd').length;
    if(arr.hasClass('kai')){
        arr.removeClass('kai');
        for (var i = 0 ;i<a;i++){
            var nextPad = parseInt(_this.next().css('paddingLeft'));
            if(pad<=nextPad){
                _this.next().remove()
            }
        }
    }else {
        _this.find('.arr').addClass('kai');
        for (var i=data.length-1;i>=0;i--){
            var off = true;
            if(data[i].pid == id){
                for (var z=data.length-1 ;z>=0;z--){
                    if (data[z].pid == data[i].id){
                        _this.after('<dd style="padding-left: '+ pad +'px" _id="' + data[i].id + '"><span class="arr icon left"></span> <span class="f icon left"></span> <span class="name left">'+data[i].name +'</span> </dd>');
                        off = false;
                    }
                }
                if (off){
                    _this.after('<dd style="padding-left: '+ pad +'px" _id="' + data[i].id + '"><span class="arr icon left wu"></span> <span class="f icon left"></span> <span class="name left">'+data[i].name +'</span> </dd>');
                }
            }
        }
    }
    pid = id;
    initFile();
    breadcrumbs(pid);
    $('.side dd').css('backgroundColor','#FFF').css('color','#000');
    _this.css('backgroundColor', '#38f').css('color','#fff');
});


$('.side dt').click(function () {
    pid = 0;
    initFile();
    breadcrumbs(pid);
});

