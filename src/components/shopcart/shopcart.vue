<template>
<div>
  <div class="shopcart">
      <div class="content" @click = "toggleList">
          <div class="content-left">
              <div class="logo-wrapper" >
                  <div class="logo" :class="{'heighlight':totalCount>0}">
                      <i class="icon-shopping_cart" :class="{'heighlight':totalCount>0}"></i>
                  </div>
                  <div class="num">{{totalCount}}</div>
              </div>
              <div class="price" :class="{'heighlight':totalCount>0}">￥{{totalPrice}}元</div>
              <div class="desc">另需要配送费￥{{deliveryPrice}}</div>
          </div>
          <div class="content-right" @click.stop.prevent = "pay">
            <div class="pay" :class='payClass'>
              {{payDesc}}
            </div>
          </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls" :key="ball.index" >
          <transition name="drop" @before-enter="beforeEnter" @enter="dropEnter" @after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
                 <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list"  v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <div class="empty" @click = "empty">清空</div>
          </div>
          <div class="list-content" ref="listContent">
              <ul>
                <li class="food" v-for="food in selectFoods" :key="food.index">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span >￥{{food.price*food.count}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <v-cartcontrol :food="food"></v-cartcontrol>
                  </div>
                  
                </li>
              </ul>
            </div>  
          

        </div>
      </transition>
  </div>
  <transition name="fade">
     <div class="list-mask" v-show = "listShow" @click="hideList"></div>
  </transition>
</div>


  

</template>

<script type="text/ecmascript-6">
import cartcontrol from '../cartcontrol/cartcontrol.vue'
import BScroll from '@better-scroll/core' 

export default {
    props:{
        deliveryPrice:{
            type:Number,
            default:0
        },
        minPrice:{
          type:Number,
          default:0
        },
        selectFoods:{
          type:Array,
          default(){
            return [
              {
                price:0,
                count:0

              }
            ]
          }
        }
    },
    data(){
      return{
        balls:[
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          }
        ],
        dropBalls:[],
        fold: true //表示折叠
      }
    },
    computed:{
      totalPrice(){
        let total = 0;
        this.selectFoods.forEach((food)=>{
          total += food.price * food.count

        })
        return total
      },
      totalCount(){
        let count = 0;
        //这里的callback是为每个循环的数执行回调函数的
        this.selectFoods.forEach(food =>{
          count += food.count
        })
        return count
      },
      payDesc(){
        if(this.totalPrice === 0){
          return `￥${this.minPrice}元起送`
        }
        else if(this.totalPrice < this.minPrice){
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}`
        }
        else{
          return '去结算'
        }
      },
      payClass(){
        if(this.totalPrice < this.minPrice){
          return 'not-enough'
        }else{
          return 'enough'
        }
      },
      listShow(){
        //如果没有购买任何商品
        //fold标记为折叠，且购物列表不显示
        if(!this.totalCount){
          this.fold = true
          return false
        }
        //如果fold被改为false不折叠了
        //那么就会show显示列表
        let show = !this.fold
        if(show){
          this.$nextTick(()=>{
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.listContent,{
                click:true
            })
          }else{
            this.scroll.refresh()
           }
         })
        }
        return show
      }
    },
    methods:{
      drop(el){
        for(let i = 0; i < this.balls.length; i++ ){
          let ball = this.balls[i]
          if(!ball.show){
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      //这里的el是小球的div
      beforeEnter(el,done){
        let count = this.balls.length
        while(count--){
          let ball = this.balls[count]
          if(ball.show){
            //返回元素的大小及其相对于视口位置
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight-rect.top-22)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translated3d(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }

      },
      dropEnter(el,done){
        /*eslint-disable no */
        let rf = el.offsetHeight
        this.$nextTick(()=>{
           el.style.webkitTransform ='translate3d(0,0,0)'
            el.style.transform = 'translated3d(0,0,0)'
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = 'translate3d(0,0,0)'
            inner.style.transform = 'translate3d(0,0,0)'
             el.addEventListener('transitionend', done) // Vue为了知道过渡的完成，必须设置相应的事件监听器。它可以是transitionend或 animationend
            })
       
      },
      afterEnter(el){
        let ball = this.dropBalls.shift()
        if(ball){
          ball.show = false
          el.style.display = 'none'
        }
      },
      //点击购物车栏发生的事件
      toggleList(){
        //如果没有任何商品，不放回任何值
        if(!this.totalCount){
          return 
        }
        //如果有商品的话，fold就不折叠
        this.fold = !this.fold
      },
      hideList(){
        this.fold = true
      },
      empty(){
        this.selectFoods.forEach((food)=>{
          food.count = 0
        })
      },
      pay(){
        if(this.totalPrice < this.minPrice){
          return
        }
        window.alert(`请支付${this.totalPrice}元`)
      }

    },
    components:{
      'v-cartcontrol':cartcontrol
    }

    
}
</script>
<style lang="stylus" >
@import "../../common/stylus/mixin.styl"

  .shopcart
    position fixed
    width 100%
    height 48px
    left 0
    bottom 0
    z-index 50
    .content
      display flex
      background #141d27
      color rgba(255,255,255,0.4)
      .content-left
        flex 1
        font-size 0
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background rgb(43,52,60)
            text-align center
            &.heighlight
              background rgb(0,160,220)
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a  
              &.heighlight
               color #fff
          .num
            position absolute
            top 0
            right 0
            height 16px
            width 24px
            background  rgb(240, 20, 20)
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4)
            color: #ffffff
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700

        .price
          display inline-block
          vertical-align top
          font-size 16px
          font-weight 700
          color  rgba(255,255,255,0.4)
          line-height 24px
          padding-right 12px
          margin 12px 0
          border-right 1px solid rgba(255,255,255,0.1)
          &.heighlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          line-height 24px
          margin 12px 
          text-align center
          color rgba(255,255,255,0.4)
          font-size 10px
          font-weight 700
      .content-right
        flex 0  0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          background rgb(43,52,60)
          font-size 12px
          font-weight 700
          &.not-enough
            background rgb(43,52,60)
          &.enough
            background #00b43c 
            color #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        .inner
          width: 15px
          height: 15px
          border-radius: 50%
          background-color: #00A0DC
          transition: all 1s linear
        &.drop-enter-active
          transition: all 1s cubic-bezier(0.49, -0.29, 0.75, 0.41)
    .shopcart-list
       position absolute 
       left 0
       top 0 
       z-index -1
       width 100%
       transform translate3d(0,-100%,0)
       &.fold-enter-active,&.fold-leave-active
         transition all 0.5s linear 
         transition translate3d(0,-100%,0)
       &.fold-enter,&.fold-leave-active
         transform translate3d(0,0,0)
       .list-header
         height 40px
         line-height 40px
         padding 0 18px
         background #f3f5f7
         border-bottom 1px solid rgba(7,17,27,0.1)
         .title
            float left
            font-size 14px
            color rgb(7,17,27)
         .empty
           float right
           font-size 12px
           color rgb(0,160,220)
       .list-content
          padding 0 18px
          max-height 217px
          overflow hidden
          background #fff
          .food
            position relative //?
            padding 12px 0
            box-sizing border-box
            border-1px(rgba(7,17,27,0.1))
            .name
              line-height 24px
              font-size 14px
              color rgb(7,17,27)
            .price
               position absolute 
               right 90px
               bottom 12px
               line-height 24px
               font-size 14px
               font-weight 700
               color rgb(240,20,20)
            .cartcontrol
              position absolute 
              right 0
              bottom 6px
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    -webkit-backdrop-filter blur(10px)
    opacity 1
    background rgba(7,17,27,0.6)
    &.fade-enter-active,&.fade-leave-active
       transition all 0.5s linear 
       opacity 1
       background rgba(7,17,27,0.6)
    &.fade-enter,&.fade-leave-active
      opacity 0
      background:rgba(7,17,27,0)


    
     
       

      







</style>