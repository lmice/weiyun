
//数据操作函数


/**
 *
 * @param type  文件数据 文件类型
 * @param pid   文件数据 pid
 * @param id    文件数据 id
 * @param name  文件数据 name
 * @desc 创建新文件夹时需要往数据中添加一个新的对象来对应该文件夹
 */
function pushData(type,pid,id,name) {
    data.push(
        {
            type : type,
            pid : pid,
            id : id,
            name : name
        }
    );
    localStorage.setItem('dta', JSON.stringify(data));
}

/**
 *
 * @return {number}
 * @desc 每次新建文件或者复制的时候都需要一个新的数据id来对应这个文件，我定义的新id就是在data中取最大的id+1
 */
function newId() {
    var id = -Infinity;
    for (var i = 0 ; i<data.length;i++){
        if(data[i].id > id ){
            id = data[i].id;
        }
    }
    return id+1;
}
function copy(id,pid) {
    for (var i = 0 ;i <data.length;i++){
        if(data[i].id == id ){
            var num = newId();
            var obj = {
                type:'folder',
                pid : pid,
                id : num,
                name: data[i].name
            };
            data.push(obj);
            for (var z = 0 ;z <data.length;z++){
                if(data[z].pid == id ){
                    copy(data[z].id,num);
                }
            }
        }
    }
    localStorage.setItem('dta', JSON.stringify(data));
}
function delData(id) {
    for (var i=data.length-1;i>=0;i--){
        if(data[i].id == id ){
            data.splice(i,1);
            for (var z=data.length-1;z>=0;z--){
                if(data[z].pid == id ){
                    delData(data[z].id)
                }
            }
        }
    }
    localStorage.setItem('dta', JSON.stringify(data));
}

function moveTo(id,pid) {
    for (var i=data.length-1;i>=0;i--){
        if(data[i].id == id ){
            data[i].pid = pid;
            for (var z=data.length-1;z>=0;z--){
                if(data[z].pid == id ){
                    moveTo(data[z].id,data[z].pid);
                }
            }
        }
    }
    localStorage.setItem('dta', JSON.stringify(data));
}
function itself(id,pid){
    if(id == pid){
        return false;
    }
    for (var i=data.length-1;i>=0;i--){
        if(data[i].id == pid) { //找到了对应的数据
            if(data[i].pid == id ){
                return false;
            }else if(data[i].pid !=0 ){
                return itself(id,data[i].pid);
            }
        }
    }
    return true;
}
function renNameData(id,name) {
    for (var i=data.length-1;i>=0;i--){
        if(data[i].id == id ){
            data[i].name = name;
        }
    }
    localStorage.setItem('dta', JSON.stringify(data));
}