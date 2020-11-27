<template>
    <div class="Page">
        <a>共{{ pagSum }}条数据</a>
        <button @click="topClick">上一页</button>
        <input type="number" v-model="pagStart" @blur="inputBlur">
        <button @click="botClick">下一页</button>
    </div>
</template>

<script>
export default {
  methods: {
    inputBlur () {
      if (this.pagStart <= 0) {
        this.pagStart = 1
      } else if (this.pagStart > Math.ceil(this.pagSum / 12)) {
        console.log(this.pagSum)
        this.pagStart = Math.ceil(this.pagSum / 12)
      }
      this.$emit('pagEvent', this.pagStart) // 分发事件  子传父
    },
    topClick () {
      if (this.pagStart > 1) {
        this.pagStart--
        this.$emit('pagEvent', this.pagStart)
      }
    },
    botClick () {
      if (this.pagStart < Math.ceil(this.pagSum / 12)) {
        this.pagStart++
        this.$emit('pagEvent', this.pagStart)
      }
    }
  },
  props: {
    pagSum: Number,
    pagStart: Number
  }
}
</script>

<style lang="less" scoped>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button{
        -webkit-appearance: none !important;
        margin: 0;
    }
    .Page {
        margin-top: 20px;
        float: right;
        margin-right: 5%;
        margin-bottom: 20px;
        a {
            color: #666666;
            font-size: 14px;
            margin-right: 60px;
        }
        button {
            width: 70px;
            border: 1px solid #cccccc;
            height: 30px;
            outline: none;
            color: #666666;
        }
        button:hover{
            background-color: #fe7844;
            color: #fff;
        }
        input {
            height: 26px;
            width: 70px;
            border-top: 1px solid #cccccc;
            border-bottom: 1px solid #cccccc;
            color: #666666;
            text-align: center;
        }
    }
</style>
