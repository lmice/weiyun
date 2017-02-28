//复用函数封装


//把当前容器中的所有内容存到nowFile数组中
function nowData() {
    nowFile = [];
    for (var i=0;i<$('.folder').length;i++){
        if($('.folder')[i].id == ''){ //防止将正在新建文件夹的li被push进去
            nowFile.push($('.folder')[i]);
        }
    }
}

//@desc 根据pid渲染整个容器中的内容  并把渲染的内容push到nowFile数组中
function initFile() {
    var str = '';
    for (var i=0;i<data.length;i++){
        if(data[i].pid == pid) {
            str+= '<li _id='+ data[i].id + ' class="item folder"><span class="check_icon"></span><div class="icon"></div><div class="name">'+ data[i].name + '</div></li>'
        }
    }
    container.html(str);
    nowData()
}

/**
 *
 * @param type  新建的文件在数据中对应的type
 * @param pid   新建的文件在数据中对应的pid
 * @param id    新建的文件在数据中对应的id
 * @param name  新建的文件在数据中对应的name
 * @desc    新建文件夹条件满足时执行这条函数，往数据中push数据(pushData),再渲染容器  如果同个pid下名字相同则后面加上数字表示不同
 */
var name_num = 1;
function repeatName(name) {
    for(var i=0;i<data.length;i++){
        if(data[i].pid == pid && data[i].name == name){
            return  name + '   ( '+ name_num++ +' )'
        }
    }
    return name
}

function newFile(type,pid,id,name) {
    var name = repeatName(name);
    pushData(type,pid,id,name);
    container.html('<li _id='+ id + ' class="item folder"><span class="check_icon"></span><div class="icon"></div><div class="name">'+ name + '</div></li>' + container.html());
    nowData();
}

// 判断是否全部选中，全选则勾起全选按钮，否则取消全选
function checkedAll() {
    if($('.folder').length == checked_file.length){
        $('.checkall').addClass('checked')
    }else{
        $('.checkall').removeClass('checked');
    }
}

//生成面包屑导航 递归
var breadcrumbs_zIndex = 0;  //存一个全局的z-index值来设置他们的层级
function breadcrumbs(pid,str) {
    var _pid = pid;
    var _str = str===undefined ? '' : str;
    for(var i = 0; i<data.length;i++){
        if(data[i].id == _pid){
            _str = '<li _id='+ data[i].id +' style="z-index: '+ (breadcrumbs_zIndex++) +' ;" class="item">'+ data[i].name +'</li>' + _str;
            _pid = data[i].pid;
            if(_pid != 0 ){
                return breadcrumbs(_pid,_str)
            }
        }
    }
    $('.breadcrumbs').html(_str);
    breadcrumbs_zIndex = 0;
}


//检测是否有选中文件，有的话显示选中了文件才能使用的功能 例如删除，复制，没有选中则关闭功能

function poFn() {
    if (checked_file.length != 0){
        $('.moveto').removeClass('not');
        $('.delete').removeClass('not');
        $('.copy').removeClass('not');
    }else{
        $('.moveto').addClass('not');
        $('.delete').addClass('not');
        $('.copy').addClass('not');
    }
    if(checked_file.length == 1){
        $('.rename').removeClass('not');
    }else{
        $('.rename').addClass('not');
    }

}

//移动到提示层

function cabinet(num) {
    var html = '';
    for (var i= 0;i<data.length;i++){
        var off = true;
        if(data[i].pid == num){
            for (var z=0 ;z<data.length;z++){
                if(data[z].pid == data[i].id ){
                    html += '<p class="op" _id="'+ data[i].id +'"><em class="jia"></em><span></span>'+ data[i].name +'</p>';
                    off = false;
                    break;
                }
            }
            if(off){
                html +='<p class="op" _id="'+ data[i].id +'"><em class="wu"></em><span></span>'+ data[i].name +'</p>'
            }
        }
    }
    $('.tips .content').html(html);
    $('.tips .content').click(function (e) {
        var _this = $(e.target);
        if (e.target.className == 'jia'){
            e.target.className = 'jian';
            var pad = parseInt($(_this.parent()).css('paddingLeft')) + 25;
            var _id =  $(_this.parent()).attr('_id');
            for (var i=data.length-1;i>0;i--){
                var off = true;
                if(data[i].pid == _id){
                    for (var z=0 ;z<data.length;z++){
                        if(data[z].pid == data[i].id ){
                            $(_this.parent()).after('<p class="op" style="padding-left: '+ pad +'px " _id="'+ data[i].id +'"><em class="jia"></em><span></span>'+ data[i].name +'</p>');
                            off = false;
                            break;
                        }
                    }
                    if(off){
                        $(_this.parent()).after('<p class="op" style="padding-left: '+ pad +'px " _id="'+ data[i].id +'"><em class="wu"></em><span></span>'+ data[i].name +'</p>');
                    }
                }
            }
        }else if(e.target.className == 'jian'){
            e.target.className ='jia';
            var pad = parseInt($(_this.parent()).css('paddingLeft'));
            var a = $('.content P').length;
            for (var i = 0 ;i< a ;i++){
                var nextPad = parseInt(_this.parent().next().css('paddingLeft'));
                if(pad<nextPad){
                    _this.parent().next()[0].remove()
                }
            }
        }
        var op = document.getElementsByClassName('op');
        for(var i=0;i<op.length;i++){
            if (e.target == op[i]){
                var ele;
                $('.content P').css('backgroundColor','#f5f6f9');
                if(_this.parents('p').length == 0 ){
                    ele = _this;
                    _this.css('backgroundColor','#fff');
                }else {
                    ele = _this.parents('p');
                    _this.parents('p').css('backgroundColor','#fff');
                }
                $('.yes').addClass('but');
                $('.yes').attr('_id',ele.attr('_id'));
            }
        }
    });
}


function newfile_left() {
    var spans = $('.side dd .name');
    var arr = $('.side dd .arr');
    var dds = $('.side dd');
    for(var i=0;i<data.length;i++){
        if(data[i].id == pid){
            console.log(1);
            for (var s=0;s<spans.length;s++){
                if(data[i].name == spans[s].innerHTML){
                    $(arr[s]).addClass('kai');
                    $(arr[s]).removeClass('wu');
                    var pad = parseInt($(dds[s]).css('paddingLeft'))+10;
                    $(dds[s]).after('<dd style="padding-left: '+ pad +'px" _id="' + data[data.length-1].id + '"><span class="arr icon left wu"></span> <span class="f icon left"></span> <span class="name left">'+data[data.length-1].name +'</span> </dd>');
                }
            }
        }
    }
}