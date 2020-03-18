/**
 * 缓存商家信息至本地
 */
export function saveToLocal (id, key, value) {
    // _seller_ 私有属性的写法
    let seller = localStorage._seller_;
    if (!seller) {
        seller = {};
        seller[id] = {};
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    localStorage._seller_ = JSON.stringify(seller);
};
/**
 * 从本地缓存读取是否收藏商家信息
 */
export function loadFromLocal (id, key, def) {
    let seller = localStorage._seller_;
    if (!seller) {
        return def;
    }
    seller = JSON.parse(seller)[id];
    if (!seller) {
        return def;
    }
    let ret =  seller[key];
    return ret || def;
};
