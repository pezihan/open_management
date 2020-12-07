<template>
    <div>
        <div class="editRecord"></div>
        <div class="editRecords">
              <div>警告</div>
              <div>
                <div>{{ boxtext }}</div>
                <button class="btn1" @click="delyes">确定</button>
                <button class="btn2" @click="delno">取消</button>
              </div>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    delyes () {
      this.$emit('boxbtnyes', this.id) // 分发事件  子传父
    },
    delno () {
      this.$emit('boxbtnon')
    }
  },
  props: {
    boxtext: Text,
    id: Number
  }
}
</script>

<style lang="less" scoped>
    .editRecord {
    z-index: 80;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
  }
    .editRecords {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 100;
    >div:nth-child(1) {
      width: 300px;
      height: 40px;
      background-color: #fe7844;
      color: #fff;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
    }
    >div:nth-child(2) {
      width: 300px;
      height: 160px;
      background: #fff;
      overflow: hidden;
      border-radius: 0 0 8px 8px;
      div {
        width: 300px;
        height: 110px;
        border: none;
        outline: none;
        font-size: 16px;
        text-align: center;
        line-height: 110px;
      }
      .btn1 {
      background-color: #fe7844;
        border: none;
        color: #fff;
        font-size: 16px;
        width: 80px;
        height: 35px;
        margin-left: 50px;
    }
    .btn2 {
      background-color: #fe7844;
        border: none;
        color: #fff;
        font-size: 16px;
        width: 80px;
        height: 35px;
        float: right;
        margin-right: 50px;
        background-color: #999999;
    }
    }
  }
</style>
