let util={};
util.addHandler = function(element, type, handle) {
    if (element.addEventListener) {
        element.addEventListener(type, handle, false)
    } else if (element.attachEvent) { //兼容ie浏览器
        element.attachEvent("on" + type, handle);
    } else {
        element["on" + type] = handle;
    }
}
util.formatDate=function(obj){
    let date =  new Date(obj);
    let y = 1900+date.getYear(),
        m = "0"+ (date.getMonth()+1),
        d = "0"+ date.getDate(),
        h = "0"+ date.getHours(),
        mm = "0" + date.getMinutes(),
        s = "0"+ date.getSeconds();
    return y +"-"+ m.slice(-2)+"-"+ d.slice(-2) +" "+ h.slice(-2)+":"+ mm.slice(-2)+":"+ s.slice(-2);
}
export default util;