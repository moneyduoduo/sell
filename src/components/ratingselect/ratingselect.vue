<template>
<!-- 评价满意度选择模块 -->
  <div class="ratingselect">
      <div class="rating-type border-1px">
          <span @click="select(2, $event)" class="block positive" :class="{'active': selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
          <span @click="select(0, $event)" class="block positive" :class="{'active': selectType === 0}">{{desc.positive}}<span class="count">{{posivices.length}}</span></span>
          <span @click="select(1, $event)" class="block negative" :class="{'active': selectType === 1}">{{desc.negative}}<span class="count">{{nagetives.length}}</span></span>
      </div>
      <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
        <span class="icon-check_circle"></span>
        <span class="text">只看有内容的评价</span>
      </div>
  </div>
</template>
<script>
const POSITIVE = 0 // 正向评价
const NEGATIVE = 1 // 负面评价
const ALL = 2 // 所有评价
export default {
    props: {
        ratings: {
            type: Array,
            default () {
                return [];
            }
        },
        selectType: {
            type: Number,
            default: ALL
        },
        onlyContent: {
            type: Boolean,
            default: false
        },
        desc: {
            type: Object,
            default () {
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }
        }
    },
    methods: {
      select (type, event) {
        // this.selectType = type
        this.$emit('ratingtype-select', type)// 改变评价类型时通知父组件
      },
      toggleContent () {
        // this.onlyContent = !this.onlyContent;
        this.$emit('content-toggle', !this.onlyContent);
      }
    },
    computed: {
      posivices () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        })
      },
      nagetives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        })
      }
    }
}
</script>

<style lang='stylus' scoped>
@import '../../common/stylus/mixin.styl'

.ratingselect
  .rating-type
    padding: 18px 0
    margin: 0 18px
    border-1px(rgba(7, 17, 27, 0.1))
    font-size : 0
    .block
      display: inline-block
      padding: 8px 12px
      margin-right : 8px
      line-height: 16px
      font-size : 12px
      border-radius : 1px
      color : rgb(77, 85, 93)
      &.active
        color: #fff
      .count
        margin-left : 2px
        font-size : 8px
      &.positive
        background : rgba(0, 160, 220, 0.2)
        &.active
          background : rgb(0, 160, 220)
      &.negative
        background : rgba(77, 85, 93, 0.2)
        &.active
          background : rgb(77, 85, 93)
  .switch
    padding 12px 18px
    line-height 24px
    border-bottom 1px solid rgba(7,17,27,0.1)
    color rgb(147,153,159)
    font-size 0
    &.on
      .icon-check_circle
        color #00c850
    .icon-check_circle
      display inline-block
      vertical-align top
      margin-right 4px
      font-size 24px
    .text
      display inline-block
      vertical-align top
      font-size 12px
</style>>
