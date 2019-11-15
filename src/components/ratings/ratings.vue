<template>
<div class="ratings" ref="ratings">
 <div>
    <div class="ratings-content">
        <div class="overview">
            <div class="overview-left">
                <h1 class="score">{{seller.score}}</h1>
                <div class="title">综合评分</div>
                <div class="rank">高于周边商家{{seller.rankRate}}%</div>
            </div>
            <div class="overview-right">
                <div class="score-wrapper">
                    <span class="title">服务态度</span>
                    <v-star class="star" :size="36" :score="seller.serviceScore"></v-star>
                    <span class="score" >{{seller.serviceScore}}</span>
                </div>

                <div class="score-wrapper">
                    <span class="title">商品评价</span>
                    <v-star class="star" :size="36" :score="seller.foodScore"></v-star>
                    <span class="score">{{seller.foodScore}}</span>
                </div>

                <div class="delivery-wrapper">
                    <span class="title">送达时间</span>
                    <span class="delivery">{{seller.deliveryTime}}分钟</span>
                </div>

            </div>
        </div>
    </div>
    <v-split></v-split>
     <v-ratingselect :ratings="ratings" 
                     :select-type="selectType"
                     :only-content = "onlyContent"  
                     @increment="incrementTotal">
     </v-ratingselect>
     <div class="rating-wrapper">
         <ul>
             <li v-for="rating in ratings" :key="rating.index" class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
                 <div class="avatar">
                     <img :src="rating.avatar" width="28" height="28">
                 </div>
                 <div class="content">
                     <h1 class="name">{{rating.username}}</h1>
                     <div class="star-wrapper">
                         <v-star :size="24" :score="rating.score"></v-star>
                         <span class="delivery">{{rating.deliveryTime}}分钟送达</span>
                     </div>
                     <p class="text">{{rating.text}}</p>
                     <div class="recommend">
                         <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                         <span v-for="(item,index) in rating.recommend" :key="index" class="item" >{{item}}</span>
                     </div>
                     <div class="time">
                         {{rating.rateTime | formatDate}}
                     </div>
                 </div>
             </li>
         </ul>
     </div>
  </div><!--不能出现多个同级div-->
</div>

</template>

<script type="text/ecmascript-6">

import BScroll from '@better-scroll/core' 
import star from '../star/star.vue'
import split from '../split/split.vue'
import ratingselect from '../ratingselect/ratingselect.vue'
import {formatDate} from  '../../common/js/data.js'



const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
const ERR_OK = 0

export default {
    props:{
        seller:{
            type:Object
        }
    },
    components:{
        'v-star':star,
        'v-split':split,
        'v-ratingselect':ratingselect  
    },
    
    data(){
        return {
            ratings:[],
            selectType:ALL,
            onlyContent:true,

        }
    },
    created(){
        this.$http.get('/api/ratings').then(res=>{
            res = res.body
            if(res.errno === ERR_OK){
                this.ratings = res.data
                this.$nextTick(()=>{
                    this.scroll = new BScroll(this.$refs.ratings,{
                        click:true
                    })
                })
                 
            }
        })
    },
    methods:{
      incrementTotal(type,data){
          this[type] = data
          //异步更新，在改变数据中，vue的更新是异步的
          this.$nextTick(() => {
            this.scroll.refresh
          })
        },
        needShow(type,text){
          if(this.onlyContent && !text){
            return false
          }
           if(this.selectType === ALL){
             return true
           }else{
             //如果我选择的类型和传进来的类型都一样的话，就显示
             return type === this.selectType
           }

        }
    },
    filters:{
      formatDate(time){
        let data = new Date(time)
        return formatDate(data,'yyyy-MM-dd hh:mm')
      }
    }
    
}
</script>

<style lang="stylus">
 @import "../../common/stylus/mixin.styl"

.ratings
  position absolute   //为什么要绝对定位
  top 174px
  bottom 0
  left 0
  width 100%
  overflow hidden
  .overview
    display flex
    padding 18px 0
    .overview-left
      flex 0 0 137px
      width 137px  //兼容性
      padding 6px 0
      border-right 1px solid rgba(7,17,27,0.1)
      text-align center
      @media only screen and (max-width 375px)
        flex 0 0 120px
        width 120px
      .score
         margin-bottom 6px
         font-size 24px
         color rgb(255,153,0)
         line-height 28px
      .title
         font-size 12px
         color rgb(7,17,27)
         line-height 12px
         margin-bottom 8px
      .rank
         font-size 10px
         color rgb(147,153,159)
         line-height 10px
    .overview-right
       flex 1
       padding 6px 0 6px 24px
       @media only screen and (max-width 375px) 
          padding-left 6px  //兼容？
       .score-wrapper
          margin-bottom  8px
          font-size 0px
          color rgb(7,17,27)
          //   line-height 18px 父元素加了line-height,高度变为24px
          .title
            display inline-block //要给每个子元素设置line-height
            vertical-align top
            font-size 12px
            margin-right 12px
            line-height 18px
          .star
            display inline-block
            vertical-align top
            margin-right 12px
          .score
            display inline-block
            vertical-align top
            font-size 12px
            color rgb(255,153,0)
            line-height 18px
       .delivery-wrapper
          font-size 0px
         .title
           font-size 12px
           color rgb(7,17,27)
           line-height 18px
         .delivery
           font-size 12px
           color rgb(147,153,159)
           line-height 18px
           margin-left 12px
           display inline-block
           vertical-align top
  .rating-wrapper
    padding 0 18px
    .rating-item
      display flex
      padding 18px 0
      border-1px(rgba(7,17,27,0.1))
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
          font-size 10px
          color rgb(7,17,27)
          line-height 12px
        .star-wrapper
          margin-bottom 6px
          font-size 0
          .star 
            display inline-block
            vertical-align top
            margin-right 6px
          .delivery
            display inline-block
            vertical-align top
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
        .text
          margin-bottom 8px
          font-size 12px
          line-height 18px
          color rgb(7,17,27)
        .recommend
          font-size 0px
          .icon-thumb_up,.icon-thumb_down
            display inline-block
            line-height 16px
            margin 0 8px 4px 0
            font-size 12px
            vertical-align top
          .icon-thumb_up
              color rgb(0,160,220)
          .icon-thumb_down
              color rgb(183,187,191)
          .item
            display inline-block
            vertical-align top
            line-height 16px
            font-size 9px
            margin 0 8px 4px 0
            color rgb(147,153,159)
            border 1px solid rgba(7,17,27,0.1)
            border-radius 1px
            background #ffffff
            padding 0 6px
        .time
          position absolute 
          top 0
          right 0
          line-height 12px
          font-size 10px
          color rgb(147,153,159)


        

          

        

            
          
        
  
</style>
