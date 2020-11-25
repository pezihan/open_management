<template>
  <div class="loginImg">
    <img src="@/assets/images/login.jpg" alt="" >
    <div class="panel">
      <div>OpenA网店订单管理系统</div>
      <div>
          <input type="text" v-model="useerList.username"  placeholder="请输入账号"  @blur="verdictName">
          <a href="#" v-show="fasle1">请输入账号</a>
          <input type="password" v-model="useerList.password"  placeholder="请输入密码"  @blur="verdictPass">
          <a href="#" v-show="fasle2">请输入密码</a>
          <button @click="register">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      useerList: {
        username: 'admin',
        password: 'admin'
      },
      fasle1: false,
      fasle2: false
    }
  },
  methods: {
    verdictName () {
      if (this.useerList.uesrname === '') {
        this.fasle1 = true
        return
      }
      this.fasle1 = false
    },
    verdictPass () {
      if (this.useerList.password === '') {
        this.fasle2 = true
        return
      }
      this.fasle2 = false
    },
    async register () {
      if (this.useerList.uesrname === '') {
        return this.$message.error('请输入账号')
      } else if (this.useerList.password === '') {
        return this.$message.error('请输入密码')
      }
      const { data: res } = await this.$http.post('/login', this.useerList)
      console.log(res)
      if (res.success !== 200) {
        return this.$message.error('密码或账号错误！')
      }
      window.sessionStorage.setItem('token', res.tokenKey)
      window.sessionStorage.setItem('id', res.message.id)
      window.sessionStorage.setItem('username', res.message.username)
      window.sessionStorage.setItem('employeeName', res.message.employeeName)
      this.$message.success('登录成功')
      this.$router.push('/home')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .loginImg {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .panel {
    background:rgba(255, 255, 255, .7);
    position: absolute;
    width: 500px;
    height: 340px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    input {
      position: absolute;
      width: 70%;
      height: 13%;
    }
  }
  .panel div:nth-child(1){
    width: 100%;
    height: 18%;
    background-color: #fb824e;
    color: #fff;
    text-align: center;
    line-height: 300%;
    font-size: 130%;
    font-weight: bold;
  }
  .panel div:nth-child(2){
    position: relative;
    height: 100%;
  }
  .panel input:nth-child(1) {
    left: 50%;
    transform: translateX(-50%);
    top: 12%;
  }
  .panel input:nth-child(3) {
    left: 50%;
    transform: translateX(-50%);
    top: 40%;
  }
  .panel button {
    background-color: #fb824e;
    border: none;
    outline: none;
    color: #fff;
    width: 17%;
    height: 30px;
    float: right;
    margin-top: 42%;
    margin-right: 10%;
  }
  a {
    position: absolute;
    color: red;
    left: 16%;
    font-size: 14px;
  }
  .panel a:nth-child(2){
    top: 27%;
  }
  .panel a:nth-child(4){
    top: 55%;
  }
</style>
