<template>
    <!-- 评价详情页 -->
    <transition name="move">
      <div class="rating" v-show="showFlag" ref="food">
        <div class="rating-content">
          <!-- 头部 -->
          <div class="header">
            <!-- 返回键 -->
            <div class="back" @click="hide">
                <i class="icon-arrow_lift"></i>
            </div>
            <div class="title">
              <span>发表评价</span>
            </div>
            <div class="submit" @click="ratingSubmit()">
              <el-link type="primary">发布</el-link>
            </div>
          </div>
          <!-- 商品评价列表 -->
          <div class="rating-list">
            <div class="rating-item" v-for="(food, index) in orderData.foods" :key="index">
              <!-- 评价商品信息 -->
              <div class="rating-header">
                <div class="pic"><img :src="'http://localhost:8084/pic/' + food.image" alt="" height="40px" width="40px"></div>
                <div class="text"><span>{{food.name}}</span></div>
                <div class="btn">
                  <el-radio v-model="rateType[index]" label="0"><span>👍</span></el-radio>
                  <el-radio v-model="rateType[index]" label="1"><span>👎</span></el-radio>
                </div>
              </div>
              <!-- 评价内容 -->
              <div class="rating-content">
                <el-input
                  type="textarea"
                  placeholder="小店得饭菜可合你胃口呢 快写下你的评论把！"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  v-model="ratingInputList[index]"
                  >
                </el-input>
              </div>
            </div>
            <!-- 最后总评价 -->
            <div class="rating-item">
              <div class="rating-end">
                <span class="title">本次用餐评价</span>
                <div class="rate">
                  <span>服务态度</span>
                  <el-rate v-model="serviceScore"></el-rate>
                </div>
                <div class="rate-food">
                  <span>食物评分</span>
                  <el-rate v-model="foodScore"></el-rate>
                </div>
                <div class="rating-content">
                  <el-input
                    type="textarea"
                    placeholder="写下你的用餐体验把！"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    v-model="ratingEnd"
                    >
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
import {foodRatingAPI, orderRatingAPI, ratingOverAPI, changeRatingAPI} from '@/common/js/httpAPI'
import Bscroll from 'better-scroll';
import split from 'components/split/split';

export default {
  data () {
    return {
      orderData: {}, // 整个订单数据
      rateType: [],
      showFlag: false,
      ratingInputList: [], // 评级列表
      ratingEnd: '',  // 最后评论
      foodScore: 5, // 评分
      serviceScore: 5
    };
  },
  components: {
    split
  },
  props: {
  },
  methods: {
    //  展示本页面
    show (order) {
      this.showFlag = true;
      this.orderData = order;
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
    },
    // 评论提交
    ratingSubmit () {
      let recommend = [];
      this.orderData.foods.forEach((element, index) => {
        if (this.rateType[index] === undefined) {
          this.rateType[index] = '0';
        }
        if (this.ratingInputList[index] === undefined) {
          this.ratingInputList[index] = '';
        }
        if (this.rateType[index] === '0') {
          recommend.push(element.name);
        }
        let temp = {};
        temp.fId = element.fId;
        temp.text = this.ratingInputList[index];
        temp.ratetype = this.rateType[index];
        temp.username = localStorage.getItem('userName');
        // 食物评价
        foodRatingAPI('/sell/foodRating/add', temp).then(result => {
          result = result.data
          if (!result.error) {
            // 修改好评率
            changeRatingAPI('/sell/rating/update/' + element.fId).then(res => {
            })
          }
        })
      });
      let orderTemp = {
        oId: this.orderData.oId,
        userName: localStorage.getItem('userName'),
        text: this.ratingEnd,
        foodScore: this.foodScore,
        serviceScore: this.serviceScore,
        recommend: recommend.join(','),
        sId: 'admin'
      }
      // 订单评价
      orderRatingAPI('/sell/orderRating/add', orderTemp).then(result => {
      })
      // 修改订单状态为已评价
      // 完成订单
      ratingOverAPI('/sell/rating/status/' + this.orderData.oId).then(result => {
        result = result.data
        if (!result.error) {
          this.$message({message: '评论成功', type: 'success'});
          setTimeout(() => {
            this.showFlag = false;
            this.$router.replace('/goods');
          }, 1000);
        }
      })
    }
  },
  filters: {
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
  z-index 30
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
      .submit
        position absolute
        top 20px
        right 10px
    .rating-list
      overflow hidden
      background-color #f5f7f9
      .rating-item
        margin 10px
        padding 5px
        border-radius 5px
        background-color #fff
        .rating-header
          position relative
          margin 5px
          .pic
            display inline-block
            img
              border-radius 5px
          .text
            display inline-block
            vertical-align top
            padding-left 10px
            font-size 14px
            font-weight 700
          .btn
            position absolute
            right 0px
            top 0px
        .rating-content
          margin 5px
          .el-textarea__inner
            border none
            background-color #f3f5f7
          ::-webkit-input-placeholder
            font-size 12px
            color rgba(0, 0, 0, .5)
        .rating-end
          .title
            padding 5px
            font-size 14px
            font-weight 600
          .rate
            display block
            padding 0 5px
            margin-top 15px
            font-size 12px
            .el-rate
              display inline-block
              margin-left 10px
              vertical-align middle
          .rate-food
            padding 0 5px
            margin-top 5px
            font-size 12px
            .el-rate
              display inline-block
              margin-left 10px
              vertical-align middle
</style>
