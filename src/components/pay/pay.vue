<template>
    <!-- 评价详情页 -->
    <transition name="move">
      <div class="rating" v-show="showFlag" ref="food" v-loading="loading">
        <div class="rating-content">
          <div class="header">
            <!-- 返回键 -->
            <div class="back" @click="hide">
                <i class="icon-arrow_lift"></i>
            </div>
            <div class="title">
              <span>提交订单</span>
            </div>
          </div>
          <!-- 订单列表 -->
          <div class="rating-list">
            <div class="rating-item">
              <el-form ref="form" :model="orderForm">
                <el-form-item style="marin-left:10px;">
                   <div class="content">
                      <ul>
                        <li>
                          <el-select style="width:100%;margin: 5px 0" v-model="seatNo" placeholder="请选择你的餐桌号数" size="mini">
                            <el-option
                              v-for="i in 40"
                              :key="i"
                              :label="i"
                              :value="i">
                            </el-option>
                          </el-select>
                        </li>
                        <li v-for="(item, index) in selectFoods" :key="index" style="border-bottom:1px solid rgba(7,17,27,0.1)">
                            <img :src="'http://localhost:8084/pic/' + item.image" alt="" height="40px" width="40px" style="border-radius:5px;">
                            <span style="vertical-align:top;margin-left:10px">{{item.name}}</span>
                            <div style="display:inline-block;vertical-align:top;float:right;">
                              <span class="num" style="margin-right:15px;">x{{item.count}}</span>
                              <span class="price" style="display:inline-block;width:80px">￥{{item.price}}</span>
                            </div>
                        </li>
                        <li>
                          <span>餐桌费</span>
                          <div style="display:inline-block;vertical-align:top;float:right;">
                            <span style="display:inline-block;width:80px">￥{{deliveryPrice}}</span>
                          </div>
                        </li>
                        <li style="position:relative;">
                          <span style="font-size:12px;position:absolute;top:-15px;color:gray;">{{support}}</span>
                        </li>
                      </ul>
                    </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="pay">
          <div class="totalCount" @click="pay()">
            <span class="count">共 ￥{{setTotalPrice()}}</span>
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
import {addOrderAPI, orderSellCountAddAPI, FoodSellCountAddAPI} from '@/common/js/httpAPI'
import Bscroll from 'better-scroll';
import split from 'components/split/split';

export default {
  data () {
    return {
      showFlag: false,
      seatNo: null,
      ratingInputList: {}, // 评级列表
      ratingEnd: '',  // 最后评论
      rate: 5, // 评分
      orderForm: {}, // 订单提交表单
      total: 0, // 临时存放满减后的价格
      loading: false // 加载flag
    };
  },
  components: {
    split
  },
  methods: {
    // 订单数加一
    orderSellCountAdd () {
      orderSellCountAddAPI('/sell/orderCount/upd/admin').then(result => {
            result = result.data;
            if (result.error) {
              this.$message('更新失败！');
            }
          }).catch(error => {
            this.$message(error);
          })
    },
    pay () {
      if (this.seatNo === null) {
        this.$message('请选择桌号！');
        return;
      }
      this.loading = true;
      let foods = [];
      this.selectFoods.forEach((item, index) => {
        let food = {};
        console.log(item)
        food.name = item.name;
        food.price = item.price;
        food.count = item.count;
        food.fId = item.fId;
        food.image = item.image;
        foods.push(JSON.stringify(food));
      });
      let orderData = {
        'count': this.total,
        'seatNo': this.seatNo,
        'foods': foods.join('*'),
        'userName': localStorage.getItem('userName'),
        'sId': 'admin'
      }
       setTimeout(() => {
        this.loading = false;
          addOrderAPI('/sell/order/add', orderData).then(result => {
            result = result.data;
            if (!result.error) {
              // 商品销量增加
              foods.forEach(item => {
                FoodSellCountAddAPI('/sell/food/sellCount/', JSON.parse(item).fId, JSON.parse(item).count).then(result => {
                  result = result.data;
                });
              })
              // 订单数量加一
              this.orderSellCountAdd();
              this.$message({
                message: '成功下单',
                type: 'success'
              });
              this.showFlag = false;
              this.$router.replace('/order');
              // 购物车清空
              this.selectFoods.forEach((food) => {
                food.count = 0;
              });
            } else {
              this.$message('下单失败');
            }
          }).catch(error => {
            this.$message(error);
          })
      }, 2000);
    },
    // 满减处理
    setTotalPrice () {
      this.total = 0;
      if (this.support !== null && this.support !== '') {
        let support = this.support;
        let discountOne = support.match(/满(\S*)减/)[1];
        let discountTwo = support.match(/减(\S*)/)[1];
        let total = this.totalPrice;
        if (total > discountOne) {
          total = this.totalPrice - discountTwo;
          if (total < 0) {
            total = 0.01;
          }
        }
        this.total = total + this.deliveryPrice;
        return total + this.deliveryPrice;
      } else {
        return this.totalPrice + this.deliveryPrice;
      }
    },
    //  展示本页面
    show () {
      this.showFlag = true;
      this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new Bscroll(this.$refs.food, {
              click: true
            });
          } else {
              this.scroll.refresh();
          }
      })
    },
    // 隐藏本页面
    hide () {
        this.showFlag = false;
    }
  },
  props: {
    // 已选中的商品数量和价格
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            price: 0,
            count: 0
          }
        ];
      }
    },
    totalPrice: {
      type: Number
    },
    // 满减信息
    support: {
      type: String
    },
    // 配送费
    deliveryPrice: {
      type: Number,
      default: 0
    },
    deliveryTime: {
      type: Number,
      default: 0
    },
    // 最低起送价
    minPrice: {
      type: Number,
      default: 0
    }
  },
  filters: {
  },
  computed: {
  }
};
</script>

<style lang='stylus' scoped>
@import '../../common/stylus/mixin.styl'
.rating
  position fixed
  left 0
  top 0
  bottom 0
  z-index 300
  width 100%
  background #f5f7f9
  transition all 0.2s linear
  transform translate3d(0, 0, 0)
  &.move-enter, &.move-leave-active
    transform translate3d(100%, 0, 0)
  .rating-content
    position  relative
    .header
      padding 18px
      padding-left 40px
      width 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #000
      .title
        padding-top 4px
    .rating-list
      overflow hidden
      background-color #f5f7f9
      padding-bottom 48px
      .rating-item
        margin 10px
        padding 5px
        border-radius 5px
        background-color #fff
        .el-form-item__label
          font-size 12px
  .pay
    position fixed
    bottom 0px
    left 0px
    width 100%
    height 48px
    background #141d27
    .totalCount
      float right
      width 105px
      height 48px
      line-height 48px
      text-align center
      background #00b43c
      color #fff
      .count
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
</style>
