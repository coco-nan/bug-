<template>

   <div class="seller" ref="seller">
     <div>
        <div class="seller-content">
            <div class="overview">
                <div class="title">{{seller.name}}</div>
                <div class="desc border-1px">
                    <v-star :size="36" :score="seller.score"></v-star>
                    <span class="text">({{seller.ratingCount}})</span>
                    <span class="text">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="stress">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryTime}}</span>分钟
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="toggleFavorite($event)">
                    <i class="icon-favorite" :class="{'active':favorite}"></i>
                    <span class="text">{{favoriteText}}</span>
                </div>
            </div>
            <v-split></v-split>
            <div class="bulletin">
                <h1 class="title">公告与活动</h1>
                <div class="content-wrapper border-1px">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
                <ul v-if="seller.supports" class="supports">
                    <li class="support-item border-1px" v-for="(item,index) in seller.supports" :key="item.index">
                        <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                        <span class="text">{{seller.supports[index].description}}</span>
                    </li>
                </ul>
            </div>
            <v-split></v-split>
            <div class="pics">
                <h1 class="title">商家实景</h1>
                <div class="pic-wrapper" ref = "picWrapper">
                    <ul class="pic-list" ref="picList">
                        <li class="pic-item" v-for="pic in seller.pics" :key="pic.index">
                            <img :src="pic" width="120" height="90" >
                        </li>
                    </ul>
                </div>
            </div>
            <v-split></v-split>
            <div class="info">
                <div class="title border-1px">商家信息</div>
                <ul>
                    <li class="info-item" v-for="(info ,index) in seller.infos" :key="index">{{info}}</li>
                </ul>
            </div>
        </div>   
     </div>
    </div> 


</template>

<script type="text/ecmascript-6">
import star from '../star/star.vue'
import BScroll from '@better-scroll/core'
import split from '../split/split.vue'
import {saveToLocal,loadFromlLocal} from '../../common/js/store.js'

export default {
    props:{
        seller:{
            type:Object
        }
    },
    data(){
        return {
            classMap:[],
            favorite:(()=>{
                return loadFromlLocal(this.seller.id, 'favorite', false);
            })()

        }
    },
    components:{
        'v-star':star,
        'v-split':split
    },
    created(){
       this._initScroll()
       this._initPics()
        this.classMap = ['decrease','discount','special','invoice','guarantee']
    },
    methods:{
        _initPics(){
            if(this.seller.pics){
                let picWidth = 120
                let margin = 6
                //计算了ul宽度
                let width = (picWidth + margin)*this.seller.pics.length - margin
                this.$nextTick(()=>{
                    this.$refs.picList.style.width = width + 'px'
                    if(!this.picScroll){
                        this.picsScroll = new BScroll(this.$refs.picWrapper,{
                            scrollX:true,
                            eventPassthrough:'vertical'//忽略纵向的滚动
                        })
                    }else{
                        this.picsScroll.refresh()
                    }
                })

            }
        },
        _initScroll(){
            this.$nextTick(()=>{
                if(!this.scroll){
                    this.scroll = new BScroll(this.$refs.seller,{
                        click:true
                    })
                }else{
                    this.scroll.refresh()
                }
            })
        },
        toggleFavorite(event){
              if (!event._constructed) {
                  return;
               }
            return this.favorite = !this.favorite
            saveToLocal(this.seller.id,'favorite',this.favorite)
 
        }
    },
    watch:{
        'seller'(){
            //观测seller数据的更新，并执行更新后的操作
            this._initPics()
            this._initScroll()
        }
    },
    computed:{
        favoriteText(){
            return this.favorite ? '已收藏':'收藏'
        }
    }
}

</script>

<style lang='stylus'>
@import "../../common/stylus/mixin.styl"

  .seller
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
       padding 18px
       position relative
       .title
         margin-bottom 8px
         line-height 14px
         font-size 14px
         color rgb(7,17,27)
        .desc
           padding-bottom 18px
           line-height 18px
           font-size 0
           border-1px(rgba(7,17,27,0.1))
           .star
              display inline-block
              vertical-align top
              margin-right 8px
           .text
              display inline-block
              margin-right 12px
              line-height 18px
              font-size 10px
              color rgb(77,85,93)
        .remark
            display flex
            padding-top 18px
            .block
              flex 1
              border-right 1px solid rgba(7,17,27,0.1)
              text-align center
              &:last-child
                border none 
            h2
              margin-bottom 4px
              line-height 10px
              font-size 10px
              color rgb(147,153,159)
            .content
               line-height 24px
               font-size 10px
               color rgb(7,17,27)
               .stress
                 font-size 24px
                 font-weight 100
        .favorite
           position absolute
           width 50px  //为了不让整体变动
           right 11px
           top 18px
           text-align center
           .icon-favorite
              display block
              color #d4d6d9
              line-height 24px
              font-size 24px
              margin-bottom 4px
              &.active
                color rgb(240,20,20)
            .text
               line-height 10px
               font-size 10px
               color rgb(77,85,93)  

    .bulletin
        padding 18px 18px 0 18px
        .title
            margin-bottom 8px
            line-height 14px
            font-size 14px
            color rgb(7,17,27)   
        .content-wrapper
            padding 0 12px 16px 12px
            border-1px(rgba(7,17,27,0.1))
            .content
               line-height 24px
               font-size 12px
               font-weight 200
               color rgb(240,20,20)
        .supports
           .support-item
               padding 16px 12px
               font-size 0px
               border-1px(rgba(7,17,27,0.1))
               &:last-child
                 border none
               .icon
                  display inline-block
                  width 16px
                  height 16px
                  margin-right 6px
                  background-size 16px 16px
                  background-repeat no-repeat
                  vertical-align: top
                  &.decrease
                      bg-image('decrease_4')
                  &.discount
                      bg-image('discount_4')
                  &.guarantee
                      bg-image('guarantee_4')
                  &.invoice
                      bg-image('invoice_4')
                  &.special
                       bg-image('special_4')
               .text
                  line-height  16px
                  font-size 12px
                  font-weight 200
                  color rgb(7,17,27)
    .pics
      padding 18px
      .title 
         margin-bottom 12px
         line-height 14px
         font-size 14px
         color rgb(7,17,27)  
      .pic-wrapper  
          width 100%
          overflow hidden 
          white-space nowrap 
          .pic-list
            font-size 0
            .pic-item
              display inline-block
              margin-right 6px
              width 120px
              height 90px  
              &:last-child
                margin 0 
    .info
       padding  18px 18px 0px 18px
       .title
          padding-bottom 12px
          line-height 14px
          font-size 14px
          color rgb(7,17,27)
          border-1px(rgba(7,17,27,0.1))
        .info-item
            padding 16px 12px 12px 16px
            line-height 16px
            border-bottom 1px solid rgba(7,17,27,0.1)
            font-size 12px
            &:last-child
              border none

      
                   



    
              


           




  
</style>
