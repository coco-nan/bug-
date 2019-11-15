<template>
<div>
    <div class="goods" :goods='goods'>
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="item.index" class="menu-item" :class="{'current':currentIndex === index}"
                 @click="selectMenu(index ,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>

                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper" >
            <ul>
                <li v-for="item in goods" :key="item.index" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food,$event)" v-for="food in item.foods" :key="food.index" class="food-item border-1px" >
                            <div class="icon">
                                <img :src="food.icon" width="57" height="57">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}</span><span>好评{{food.rating}}</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span><span  class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <v-cartcontrol :food="food" @increment="_drop"></v-cartcontrol>
                                </div>
                                
                            </div>

                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <v-shopcart ref="shopcart" :select-foods ="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice">
        </v-shopcart>
    </div>
    <v-food :food="selectedFood" ref="food"></v-food>
</div>   
</template>

<script type='text/ecmascript-6'>

import BScroll from '@better-scroll/core' 
import shopcart from '../shopcart/shopcart.vue'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
import food from '../food/food.vue'
const ERR_OK = 0;


export default {

    props:{
        seller:{
            type:Object
        }
    },
    data(){
        return {
            goods:[],
            listHeight:[],
            scrollY:0,
            selectedFood: {}

        }
    },
    computed:{
        currentIndex(){
            for(let i=0; i < this.listHeight.length; i++){
                let height1 = this.listHeight[i]
                let height2 = this.listHeight[i+1]
                if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
                    return i
                } 
            }
            return 0
        },
        selectFoods(){
            let foods =[]
            this.goods.forEach(good => {
                good.foods.forEach(food =>{
                    if(food.count){
                        foods.push(food)
                    }
                })
            })
            return foods
        }

    },
    methods:{
         _initScroll() {
             this.meunScroll = new BScroll(this.$refs.menuWrapper,{
                 click:true
             }) 
             this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
                 click:true,
                 probeType:3
             })
             this.foodsScroll.on('scroll',(pos)=>{
                 this.scrollY = Math.abs(Math.round(pos.y))
             })
         },
         _calculateHeight(){
             let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
             let height = 0
             this.listHeight.push(height)
             for(let i=0; i < foodList.length; i++){
                 let item = foodList[i]
                 height += item.clientHeight
                 this.listHeight.push(height)
             }
         },
         selectMenu(index,event){
          if(!event._constructed){
             return 
          }
          let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
          let el = foodList[index]
          this.foodsScroll.scrollToElement(el,300)
         },
         _drop(target){
             //为了性能优化，异步执行
             this.$nextTick(()=>{
                 this.$refs.shopcart.drop(target)
             })
             
         },
         selectFood(food,$event){
             if(!event._constructed){
             return 
            }
          this.selectedFood = food
          this.$refs.food.show()//使用ref调用自组件的方法
        //   console.log(this.selectedFood)
         }

    },
    created(){
        this.$http.get('/api/goods').then(res => {
        res = res.body
        if(res.errno === ERR_OK){
           this.goods = res.data
           this.$nextTick(()=>{
               this._initScroll()
               this._calculateHeight()
           })
           
        }
       })
       this.classMap = ['decrease','discount','special','invoice','guarantee']    
    },
    components:{
        'v-shopcart':shopcart,
        'v-cartcontrol':cartcontrol,
        'v-food':food
    }

}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin.styl'


 .goods
   position absolute 
   width 100%
   top 174px
   bottom 46px
   display flex
   overflow hidden
   .menu-wrapper
     flex 0 0 80px
     width 80px
     background #f3f5f7
     //  overflow auto
     .menu-item
       display:table
       height 54px
       width 56px
       line-height 14px
       padding 0 12px
     .current 
        font-weight 700
        margin-top -1px
        position relative
        z-index 10
        background #fff
        .text
          border-none()
       .text
         display table-cell
         width 56px
         vertical-align middle
         border-1px(rgba(7,17,27,0.1))
         font-size 12px
         .icon
            display inline-block
            width 12px
            height 12px
            margin-right 2px
            background-size 12px 12px
            background-repeat no-repeat
            vertical-align: bottom
            &.decrease
             bg-image('decrease_3')
            &.discount
             bg-image('discount_3')
            &.guarantee
             bg-image('guarantee_3')
            &.invoice
             bg-image('invoice_3')
            &.special
             bg-image('special_3')
   .foods-wrapper
     //  overflow auto
     flex 1
     .title
       padding-left 14px
       height 26px
       line-height 26px
       border-left 2px solid #d9dde1
       font-size 12px
       color rgb(147,153,159)
       background #f3f5f7
     .food-item
       display flex
       margin 18px
       border-1px(rgba(7,17,27,0.1)) 
       padding-bottom 18px
       &:last-child
        border-none()
        margin-bottom 0
       .icon
         flex 0 0 57px
         margin-right 10px
       .content
         flex 1
         .name
          font-size 14px
          line-height 14px
          height 14px
          color rgb(7,17,27)
          margin 2px 0 8px 0
         .desc,.extra
           line-height 12px
           font-size 10px
           color rgb(147,153,159)
         .desc
           margin-bottom 8px
         .extra
           .count
             margin-right 12px
         .price
          font-weight 700
          line-height 24px
          .now
            font-size 14px
            margin-right 8px
            color rgb(240,20,20)
          .old
            font-size 10px
            text-decoration line-through
            color rgb(147,153,159)
         .cartcontrol-wrapper
           position absolute
           right 0
           bottom 12px
  
       
        

      


     

</style>
