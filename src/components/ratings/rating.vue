<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <!-- 顶部商家评分 -->
      <div class="overview">
        <!-- 左侧评分 -->
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
           <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <!-- 右侧评分 -->
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings"
       @ratingtype-select="ratingtype_select" @content-toggle="content_toggle"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in ratings" :key="rating.rateTime" class="rating-item">
            <!-- 头像 -->
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime === ''">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend" :key="item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll';
import star from 'components/star/star';
import split from 'components/split/split';
import ratingselect from 'components/ratingselect/ratingselect';
import {formatDate} from 'common/js/date';

const ALL = 2;
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    star,
    split,
    ratingselect
  },
  data () {
    return {
      ratings: [],
      showFlag: false,
      selectType: ALL,
      onlyContent: true
    }
  },
  created () {
    this.$http.get('api/ratings').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.ratings = response.data;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new Bscroll(this.$refs.ratings, {
              click: true
            });
          } else {
              this.scroll.refresh();
          }
      })
      }
    })
  },
  methods: {
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
    // 评论列表筛选显示
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
  filters: {
    formatDate (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import '../../common/stylus/mixin.styl'
  .ratings
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        padding 6px 0
        flex 0 0 137px
        border-right 1px solid rgba(7, 17, 27, .1)
        text-align center
        @media only screen and (max-width: 320px)
          flex 0 0 110px
          width 120px
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255, 153, 0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7, 17, 27)
        .rank
          padding-bottom 6px
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            vertical-align top
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .star
            display inline-block
            margin 0 12px
            vertical-align top
          .score
            display inline-block
            vertical-align top
            line-height 18px
            font-size 12px
            color rgb(255, 153, 0)
        .delivery-wrapper
          font-size 0
          .title
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .delivery
            margin-left 12px
            font-size 12px
            color rgb(147, 153, 159)
    .rating-wrapper
      padding 0 18px
      .rating-item
        padding 18px 0
        display flex
        border-1px(rbga(7, 17, 27, .1))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7, 17, 27)
          .star-wrapper
            margin-bottom 6px
            font-size 0
            star
              display inline-block
              margin-right 6px
              vertical-align top
            .delivery
              display inline-block
              vertical-align top
          .text
            margin-bottom 8px
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up, .item
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .item
              padding  0 6px
              border: 1px solid rgba(7, 17, 27, .1)
              border-radius 1px
              color rgb(147, 153, 159)
              background #fff
          .time
            position absolute
            top 0
            right 0
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
</style>>
