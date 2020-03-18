/*  通用日期格式化
    将日期格式中的字母替换为真实日期 其他格式不改变 如 'yyyy-MM-dd' 变为 '2019-1-1' 'yyyy--MM--dd' 变为 '2019--1--1' */
export let formatDate = (date, fmt) => {
    if (/(y+)/.test(fmt)) {
        // 获取并重新设置时间格式
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}
// 月份左边补零方法
function padLeftZero (str) {
    return ('00' + str).substr(str.length);
}
