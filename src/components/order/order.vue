<template>
    <div class="wrapper" ref="page">
        <div class="infinite-list-wrapper"  style="overflow:auto;">
            <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
                <li v-for="(item,index) in orderList" class="list-item" :key="index">
                    <!-- 订单 -->
                    <div class="item">
                        <!-- 订单头部 -->
                        <div class="header">
                            <img src="http://localhost:8084/pic/订单头像.jpg" alt="" height="40px" width="40px">
                            <span class="name">{{item.seatNo}}号桌</span>
                            <span class="status">{{item.status === 0? '正在准备': '已完成'}}</span>
                            <span class="time">{{item.date.substring(0, item.date.indexOf('T'))}}</span>
                        </div>
                        <!-- 订单内容 -->
                        <div class="content">
                            <ul>
                                <li v-for="(food, i) in item.foods" :key="i">
                                    <span class="name" >{{food.name}}</span>
                                    <span class="price" >￥{{food.price}}</span>
                                    <span class="num" >x{{food.count}}</span>
                                </li>
                            </ul>
                            <span class="count">共 ￥{{item.count}}</span>
                        </div>
                        <!-- 操作按钮内容 -->
                        <div class="footer">
                            <el-button v-if="item.status === 0" type="success" size="mini" disabled="">进行中</el-button>
                            <el-button v-if="item.status === 1" type="primary" size="mini" @click="selectRating(item)">评价</el-button>
                            <el-button v-if="item.status === 2" type="warning" size="mini" disabled="">已完成</el-button>
                        </div>
                    </div>
                </li>
            </ul>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
        </div>
        <rating ref="rating"></rating>
    </div>
</template>
<script>
import {getOrderListAPI} from '@/common/js/httpAPI'
import rating from 'components/rating/rating'
  export default {
    components: {
      rating
    },
    props: [
    ],
    data () {
      return {
        orderList: [],
        count: 10,
        loading: false,
        clientHeight: '',
        pageNum: 0, // 分页页数
        isNoMore: false
      }
    },
    computed: {
      noMore () {
        return this.isNoMore;
      },
      disabled () {
        return this.loading || this.noMore
      }
    },
    methods: {
      // 获取订单列表
      getOrderList () {
        getOrderListAPI(`sell/order/get/${localStorage.getItem('userName')}`, this.pageNum).then(result => {
          result = result.data;
            if (!result.error) {
              result.data.forEach((element, index) => {
                let tempFoods = element.foods.split('*');
                tempFoods.forEach((item, index) => {
                  tempFoods[index] = JSON.parse(item);
                })
                result.data[index].foods =  tempFoods;
              });
              this.orderList = this.orderList.concat(result.data);
              this.loading = false
            } else {
              this.loading = false
              this.isNoMore = true;
            }
        }).catch(error => {
          this.$message(error);
        })
      },
      // 加载更多
      load () {
        if (this.pageNum === 0) {
          this.pageNum++;
          this.getOrderList();
        } else {
          this.loading = true
          setTimeout(() => {
            this.pageNum++;
            this.getOrderList();
          }, 1000)
        }
      },
      changeFixed (clientHeight) { // 动态修改样式 订单列表
        this.$refs.page.style.height = (clientHeight - 174) + 'px';
      },
      // 点击评价
      selectRating (order) {
        this.$refs.rating.show(order);
      }
    },
    mounted () {
        // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`;
      this.$refs.page.style.height = (this.clientHeight - 174) + 'px';
      window.onresize = function temp () {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };
    },
    watch: {
      // 如果 `clientHeight` 发生改变，这个函数就会运行
      clientHeight: function () {
        this.changeFixed(this.clientHeight)
      }
    },
    created () {
      // this.pageNum = 1;
      // this.getOrderList();
    }
  }
</script>

<style lang="stylus">
@import '../../common/stylus/mixin.styl'
.wrapper
    background-color #f5f7f9
    .infinite-list-wrapper
        height 100%
        width 100%
    .infinite-list-wrapper::-webkit-scrollbar
        display none
    .list-item
        margin 10px 5px
        border-radius 5px
        background-color white
        .item
            padding 10px
            .header
                position relative
                height 100%
                img
                    border-radius 5px
                .name
                    position absolute
                    top 5px
                    left 50px
                    font-size 14px
                    font-weight 500
                .status
                    position absolute
                    right 0px
                    font-size 13px
                    color #93999f
                .time
                    position absolute
                    right 0px
                    bottom 5px
                    font-size 12px
                    color #93999f
            .content
                position relative
                padding 10px
                margin-left 50px
                margin-bottom 10px
                border-radius 5px
                background-color #dcdddf
                li
                    padding 0 5px
                    padding-bottom 5px
                    font-size 12px
                    span
                        display:inline-block;
                        width:20%;
                        overflow:hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    .name
                      min-width 80px
                    .price
                      min-width 50px
                .count
                    position absolute
                    bottom 10px
                    right 10px
                li:last-child
                    padding-bottom 0
            .footer
                padding-right 10px
                text-align right
    p
        padding-bottom 10px
        text-align center
        font-size 12px
</style>
