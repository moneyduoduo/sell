import axios from 'axios'
// let token = localStorage.getItem('token');
// axios.interceptors.request.use(
//     config => {
//         if (token) {
//             console.log('token is not null')
//             config.headers.HEADER_STRING = token;
//         } else {
//             console.log('token is null')
//             vue.$router.replace('/login')
//         }
//         return config
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );
// axios.interceptors.response.use(function (response) {
//     // 对响应数据做点什么
//     return response;
//   }, function (error) {
//     // 对响应错误做点什么
//     console.log(error + '---------');
//     if (error.response.status === 401) {
//         alert('234234')
//     }
//     return Promise.reject(error.response.data);
//   });
let base = 'http://localhost:8084';

export const queryUserByUid = param => { return axios.get(`${base}/user/${param}`); }// 查询用户是否存在
export const addUser = (url, data) => {
    return axios.post(base + url, data);
}// 添加用户
export const login = (url, data) => {
    return axios.post(base + url, data);
}
export const getGoods = param => { return axios.get(`${base}/${param}`); }// get goods
export const getSeller = param => { return axios.get(`${base}/${param}`); }// get goods
export const addOrderAPI = (param, data) => { return axios.post(`${base}/${param}`, data); }// 下单
export const orderSellCountAddAPI = param => { return axios.get(`${base}/${param}`); }// 订单数量加1
export const getOrderListAPI = (url, pageNum) => { return axios.get(`${base}/${url}/${pageNum}`); }// 用户订单列表
export const FoodSellCountAddAPI = (param, fId, sellCount) => { return axios.get(`${base}/${param}/${fId}/${sellCount}`); }// 商品销量增加
export const foodRatingAPI = (url, data) => {
    return axios.post(base + url, data);
}// 添加评论
export const orderRatingAPI = (url, data) => {
    return axios.post(base + url, data);
}// 添加评论
export const ratingOverAPI = (param) => { // pingjia over
    return axios.get(base + param);
}
export const changeRatingAPI = (param) => { // 商品好评率修改
    return axios.get(base + param);
}
export const getRatingsAPI = (param) => { // 评价列表
    return axios.get(base + param);
}
export const testAPI = (param) => {
    return axios.get(base + param)
}
