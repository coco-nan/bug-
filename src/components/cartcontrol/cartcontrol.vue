<template>
  <div class="cartcontrol">
      <transition name='move'>
        <div class="cart-decrease  " v-show="food.count>0" 
            @click = "decreaseCart" >
            <span class="inner icon-remove_circle_outline" ></span>
        </div>
      </transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle " @click.stop="addCart($event)"></div>
  </div>


</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
 
export default {
    props:{
        food:{
            type:Object
        }
    },
    methods:{
        addCart(event){
            if( !this.food.count){
                Vue.set(this.food,'count',1)
                 this.food.count = 1
            }else{
                this.food.count++
            }
            //子组件通过$emit触发组件的方法???开发一个事件
            this.$emit('increment', event.target)
            
        },
        decreaseCart(){
            if(this.food.count){
                this.food.count--

            }
        }

    }
    
}
</script>

<style lang='stylus'>
  .cartcontrol
    font-size 0px
    .cart-decrease
      display inline-block
      padding 6px
      opacity  1
      .inner
        line-height 24px
        font-size 24px
        color rgb(0,160,220)
        transition all 0.4s linear
        transform rotate(0)
      &.move-enter-active,&.move-leave-active
        transition all 0.4s linear
      &.move-enter,&.move-leave-active
        opacity 0
        transform translate3d(24px,0,0)
        .inner 
          transform rotate(180deg)
    .cart-count
      display inline-block
      vertical-align top
      padding-top 6px
      width 12px
      text-align center
      line-height 24px
      font-size 10px
      color rgb(147,153,159)
    .cart-add 
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0,160,220)

</style>
