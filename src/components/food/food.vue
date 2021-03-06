<template>
    <!-- 商品详情页 -->
    <transition name="move">
      <div class="food" v-show="showFlag" ref="food">
        <div class="food-content">
          <!-- 商品图片 -->
          <div class="image-header">
            <img :src="'http://localhost:8084/pic/' + food.image" alt />
            <div class="back" @click="hide">
                <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <!-- 商品文字内容 -->
          <div class="content">
              <h1 class="title">{{food.name}}</h1>
              <div class="detail">
                  <span class="sell-count">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
              </div>
              <!-- 详情页加入购物车功能 -->
              <div class="cartcontrol-wrapper">
                <!-- 购物车小球组件 -->
                <cartcontrol :food="food"></cartcontrol>
                <!-- 当购物车数量为0时 显示按钮为加入购物车
                  当小球控件被加载时由于是要通过计算屏幕高度来定位
                  所以加入购物车按钮消失时要加一个动画 防止小球动画异常 -->
              </div>
              <transition name="fade">
                  <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
              </transition>
          </div>
          <split v-show="food.info"></split>
          <!-- 商品详情介绍 -->
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split></split>
          <!-- 商品评价 -->
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" @ratingtype-select="ratingtype_select" @content-toggle="content_toggle"></ratingselect>
             <!-- 评价内容 -->
            <div class="rating-wrapper">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" :key="rating.rateTime" class="rating-item border-1px">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                  </div>
                  <div class="time">{{rating.ratetime | formatDate}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}"></span>
                    {{rating.text}}
                  </p>
                </li>
              </ul>
              <!-- 当前没有评价内容时提示 -->
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
import Vue from 'vue';
import {formatDate} from 'common/js/date';
import Bscroll from 'better-scroll';
import cartcontrol from 'components/cartcontrol/cartcontrol';
import split from 'components/split/split';
import ratingselect from 'components/ratingselect/ratingselect';

// const POSITIVE = 0 // 正向评价
// const NEGATIVE = 1 // 负面评价
const ALL = 2 // 所有评价

export default {
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  },
  methods: {
    //  展示本页面
    show () {
      this.selectType = ALL;
      this.onlyContent = true; // 重新初始化这两个参数 因为之前可能被使用过
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
    },
    // 加入购物车点击事件
    addFirst (event) {
      // 防止未找到food用Vue.set()
      Vue.set(this.food, 'count', 1);
    },
    // 子页面-详情页中 选择评价类型时通知
    ratingtype_select (type) {
      this.selectType = type;
      // this.$nextTick(() => {
      //   this.scroll.refresh();
      // });
    },
    // 子页面-详情页中 选择只看有评价内容选项时通知
    content_toggle (onlyContent) {
      this.onlyContent = onlyContent;
      // this.$nextTick(() => {
      //   this.scroll.refresh();
      // });
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  props: {
    food: {
      type: Object
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  }
};
</script>

<style lang='stylus' scoped>
@import '../../common/stylus/mixin.styl'
.food
  position fixed
  left 0
  top 0
  bottom 48px
  z-index 30
  width 100%
  background #fff
  transition all 0.2s linear
  transform translate3d(0, 0, 0)
  &.move-enter, &.move-leave-active
    transform translate3d(100%, 0, 0)
  .food-content
    position  relative
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%

      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      position relative
      padding 18px
      .title
        margin-bottom 8px
        font-size 14px
        line-height 14px
        font-weight 700
        color rgb(7, 17, 27)
      .detail
        margin-bottom 18px
        height 10px
        line-height 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        border-radius 12px
        font-size 10px
        color #fff
        background rgb(0, 160, 220)
        transition all 0.2s
        opacity 1
        &.fade-enter, &.fade-leave-active
          opacity 0
  .info
    padding 18px
    .title
      margin-bottom 8px
      font-size 14px
      color rgb(7, 17, 27)
    .text
      line-height 24px
      padding 0 8px
      font-size 12px
      color rgb(77, 85, 93)
  .rating
    padding-top 18px
    .title
      line-height 14px
      margin-left 18px
      font-size 14px
      color rgb(7, 17, 27)
    .rating-wrapper
      padding 0 18px
      .rating-item
        position relative
        padding 16px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .user
          position absolute
          right 0
          top 16px
          line-height 12px
          font-size 0
          .name
            display inline-block
            margin-right 6px
            vertical-align top
            font-size 10px
            color rgb(147, 153, 159)
          .avatar
            border-radius 50%
        .time
          margin-bottom 6px
          line-height 12px
          font-size 10px
          color rgb(147, 153, 159)
        .text
          display inline-block
          vertical-align top
          line-height 16px
          font-size 12px
          color rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right 4px
            line-height 16px
            font-size 12px
          .icon-thumb_up
            color rgb(0, 160, 220)
          .icon-thumb_down
            color rgb(147, 153, 159)
      .no-rating
        padding 16px 0
        font-size 12px
        color rgb(147, 153, 159)
</style>
