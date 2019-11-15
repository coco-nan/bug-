<template>
<div >
    <transition name="move"> 
       <div v-show="showFlag" class="food" ref="food">
           <div class="food-content">
               <div class="image-header">
                   <!-- 为什么这里不用{{}} -->
                   <img :src="food.image" >
                   <div class="back" @click="hide()">
                       <i class="icon-arrow_lift"></i>
                   </div>
               </div>
               <div class="content">
                   <h1 class="title">{{food.name}}</h1>
                   <div class="detail">
                       <span class="sell-count">月售{{food.sellCount}}份</span>
                       <span class="rating">好评率{{food.rating}}%</span>
                   </div>
                   <div class="price">
                       <span class="now">￥{{food.price}}</span>
                       <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                   </div>
                   <div class="cartcontrol-wrapper">
                       <v-cartcontrol :food="food"></v-cartcontrol>
                   </div> 
                   <transition name="buy">
                     <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst($event)">加入购物车</div> 
                   </transition>
               </div>
               <v-split v-show = "food.info"></v-split>
               <div class="info" v-show = "food.info">
                   <h1 class="title">商品信息</h1>
                   <p class="text">{{food.info}}</p>
               </div>
               <v-split></v-split>
               <div class="rating">
                   <h1 class="title">商品评价</h1>
                   <v-ratingselect :ratings="food.ratings" 
                                   :select-type="selectType"
                                   :only-content = "onlyContent" 
                                   :desc="desc"  
                                   @increment="incrementTotal">
                   </v-ratingselect>
                   <div class="rating-wrapper">
                     <ul v-show = "food.ratings && food.ratings.length">
                       <li v-for="rating in food.ratings" :key="rating.index" class="rating-item border-1px" v-show='needShow(rating.rateType,rating.text)' >
                          <div class="user">
                            <span class="name">{{rating.username}}</span>
                            <img :src="rating.avatar" width="12" height="12" class="avatar">
                          </div>
                          <div class="time">{{rating.rateTime | formatDate}}</div>
                          <p class="text">
                            <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType===1}"></span>
                            {{rating.text}}
                          </p>
                       </li>
                     </ul>
                    <div class="no-rating" v-show = "!food.ratings || !food.ratings.length">暂无评价</div>
                  </div>
                    
               </div>
           </div>
       </div>
    </transition> 
</div>

</template>

<script type='text/ecmascript-6'>
import cartcontrol from '../cartcontrol/cartcontrol.vue'
import split from '../split/split.vue'
import BScroll from '@better-scroll/core' 
import ratingselect from '../ratingselect/ratingselect.vue'
import Vue from 'vue'
import {formatDate} from '../../common/js/data.js'

const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
    props:{
        food:{
            type:Object
        }
    },
    data(){
        return {
            showFlag:false,
            selectType:ALL,
            onlyContent:true,
            desc:{
                all:'全部',
                positive:'推荐',
                negative:'吐槽'
            }

        }
    },
    methods:{
        //外部可调用的方法就设为一下的命名方式
        //内部为_私有
        show(){
            this.showFlag = true
            this.selectType = ALL
            this.onlyContent = true
            this.$nextTick(()=>{
                //什么情况
                if(!this.scroll){
                    this.scroll = new BScroll(this.$refs.food,{
                        click:true
                    })
                }else{
                    //重新渲染
                    this.scroll.refresh()
                }
            })
        },
        hide(){
            this.showFlag = false
        },
        //没有小球变化
        addFirst(event){
            Vue.set(this.food,'count',1)
           this.$emit('increment',event.target)
        },
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
    components:{
        'v-cartcontrol':cartcontrol,
        'v-split':split,
        'v-ratingselect':ratingselect
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

@import  '../../common/stylus/mixin.styl'

.food
   position fixed
   left 0
   top 0
   bottom 48px //购物车底部
   z-index 30
   width 100%
   background #ffffff
   transform translate3d(0,0,0)
   &.move-enter-active,&.move-leave-active
     transition all 0.2s linear 
     transform translate3d(0,0,0)
   &.move-enter, &.move-leave-active
     opacity: 0
     transform: translate3d(100%, 0, 0)
   .image-header
     position relative
     width 100%
     height 0
     padding-top 100% //这里相当于限制了高度
     img 
       position absolute
       top 0
       left 0
       width 100%
       height 100%
     .back 
        position absolute
        top 0
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
       line-height 14px
       margin-bottom 8px
       font-size  14px
       font-weight 700
       color rgb(7,17,27)
     .detail
       margin-bottom 18px
       line-height 10px
       height 10px //?
       font-size 0 
       .sell-count,.rating
         font-size 10px
         display inline-block
         color rgb(147,153,159)
       .sell-count
         margin-right 12px
     .price
       font-weight 700
       line-height  24px
       .now
         margin-right 8px
         font-size 14px
         color rgb(240,20,20)
       .old
         text-decoration line-through
         font-size 10px
         color rgb(147,153,159)
     .cartcontrol-wrapper //?
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
        font-size 10px
        border-radius 12px
        color #fff
        background rgb(0,160,220)
        opacity 1
        &.buy-enter-active,&.buy-leave-active
          transition all 0.4s
          opacity 1
        &.buy-enter,&.buy-leave-active
          opacity 0
   .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7,17,27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77,85,93)
   .rating
     padding-top 18px
     .title 
       line-height 14px
       margin-left 18px
       font-size 14px
       color rgb(7,17,27)
     .rating-wrapper
       padding 0 18px
       .rating-item
         position relative
         padding 16px 0
         border-1px(rgba(7,17,27,0.1))
         .user
           position absolute
           right 0
           top 16px
           font-size 0px
           line-height 12px
           .name
             display inline-block
             vertical-align top
             font-size 10px
             color rgb(147,153,159)
             margin-right 6px
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 12px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              line-height 12px
              margin-right 4px
              font-size 12px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
       .no-rating
         padding 16px 0
         font-size 12px
         color rgb(147,153,159)
         




       
  
        
    
       

      
      





</style>
