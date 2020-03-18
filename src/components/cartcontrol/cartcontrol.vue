<template>
  <div class="cartcontrol">
      <!-- 减少按钮 -->
    <transition name="move">
        <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreasecart">
            <span class="inner icon-remove_circle_outline"></span>
        </div>
    </transition>
      <!-- 数量 -->
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <!-- 增加按钮 -->
         <div class="car-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
    props: {
        food: {
            type: Object
        }
    },
    created () {
        // console.log(this.food);
    },
    methods: {
        // 添加按钮点击
        addCart (event) {
            if (!this.food.count) {
                // 当food.count属性不存在时 不能通过food.count = 1赋值 所以通过vue插件赋值
                Vue.set(this.food, 'count', 1);
                // this.food.count = 1;
            } else {
                this.food.count++;
            }
            // 向父组件设置一个监听 并传一个值
            this.$emit('cart-add', event.target);
        },
        // 减少按钮点击
        decreasecart () {
            if (this.food.count) {
                this.food.count--;
            }
        }
    }
}
</script>

<style lang='stylus'>
    .cartcontrol
        font-size : 0
        .cart-decrease
            display : inline-block
            padding 6px
            transition : all 0.4s linear
            opacity : 1
            transform : translate3d(0, 0, 0)
            .inner
                display : inline-block
                font-size : 24px
                line-height : 24px
                color : rgb(0, 160, 220)
                transition : all 0.4s linear
                transform : rotate(0)
            &.move-enter, &.move-leave-active
                opacity : 0
                transform : translate3d(24px , 0, 0)
                .inner
                    transform : rotate(180deg)
        .cart-count
            display : inline-block
            vertical-align : top
            width : 12px
            padding-top : 6px
            line-height : 24px
            text-align : center
            font-size : 10px
            color : rgb(147, 153, 159)
        .car-add
            display : inline-block
            padding 6px
            font-size : 24px
            line-height : 24px
            color : rgb(0, 160, 220)
</style>
