<template>
    <div>
        <!-- 导航栏 -->
      <div class="navigation">
        <li>个人信息</li>
      </div>
       <!-- 搜索栏 -->
        <div class="operation">
          <div class="operations">
            <div>admin</div>
            <div><img src="@/assets/images/logo.png" alt=""></div>
            <div v-if="boxShow===true">
              <div>
                <a href="#">姓名：{{userList.employeeName}}</a>
                <a href="#" class="a1">性别：{{ sexcom }}</a>
              </div>
              <div>
                <a href="#">家庭住址：{{userList.address}}</a>
              </div>
              <div>
                <a href="#">出生日期：{{userList.birthday | dateBirth}}</a>
              </div>
              <div>
                <a href="#">所在部门：{{userList.department}}</a>
                <a href="#" class="a2">岗位：{{userList.job}}</a>
              </div>
              <div><a href="#">员工编号：{{userList.employeeID}}</a></div>
            </div>
            <div v-else class="boxPassword">
              <div>
                <span>原密码：</span>
                <input type="password" v-model="password.former">
              </div>
              <div>
                <span>新密码：</span>
                <input type="password" v-model="password.newPass1">
              </div>
              <div>
                <span>确认密码：</span>
                <input type="password" v-model="password.newPass2">
                <p>{{ reminder }}</p>
              </div>
              <div>
                <button id="yesOne" @click="yespass">确定</button>
                <button @click="boxNOshow" id="noOne">取消</button>
              </div>
            </div>
          </div>
          <button @click="amendpass"><span class="iconfont icon-key"></span>  修改个人密码</button>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      userList: {
        employeeName: '',
        sex: null,
        address: '',
        birthday: null,
        department: '',
        job: '',
        employeeID: ''
      },
      // 控制信息面板与修改密码面板的切换
      boxShow: true,
      // 密码信息
      password: {
        id: window.sessionStorage.id,
        former: '',
        newPass1: '',
        newPass2: ''
      },
      // 密码输入提示信息
      reminder: ''
    }
  },
  created () {
    this.getuser(window.sessionStorage.id)
  },
  methods: {
    async getuser (id) {
      const { data: res } = await this.$http.get('/userId', { params: { id: id } })
      if (res.success !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userList = res.message
      console.log(res)
    },
    // 显示修改密码面板
    amendpass () {
      this.boxShow = false
    },
    // 关闭修改密码面板
    boxNOshow () {
      this.boxShow = true
      this.reminder = ''
      this.password = {
        id: window.sessionStorage.id,
        former: '',
        newPass1: '',
        newPass2: ''
      }
    },
    async yespass () {
      if (this.password.former === '') {
        this.reminder = '请输入旧密码'
      } else if (this.password.newPass1 === '') {
        this.reminder = '请输入新密码'
      } else if (this.password.newPass2 === '') {
        this.reminder = '请再次确认新密码'
      } else if (this.password.newPass1 !== this.password.newPass2) {
        this.reminder = '两次密码输入不一样'
      } else {
        this.reminder = ''
        const { data: res } = await this.$http.post('/passwordId', this.password)
        if (res.success !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success('修改密码成功')
        this.boxShow = true
      }
    }
  },
  computed: {
    sexcom () {
      if (this.userList.sex === 0) {
        return '男'
      } else {
        return '女'
      }
    }
  }
}
</script>

<style lang="less" scoped>
   .navigation {
    margin-top: 1%;
    margin-left: 2%;
    overflow: hidden;
    li {
      float: left;
      margin-right: 5%;
      cursor: default;
      color: #fe7844;
    }
  }
    // 导航栏
  .operation {
    background-color: #fff;
    width: 97%;
    height: 740px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 20px;
    button {
      float: right;
      margin-right: 50px;
      margin-top: 40px;
      background-color: #fd4c4c;
      border: none;
      color: #fff;
    }
  }
  .operations {
    width: 580px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top:5%;
    >div:nth-child(1) {
      background-color: #fe7844;
      color: #fff;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
    }
    >div:nth-child(2) {
      background-color: #f1f1f1;
      height: 80px;
      position: relative;
      img {
        width: 10%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
    }
    >div:nth-child(3) {
      margin-top: 3px;
      background-color: #f1f1f1;
      height: 550px;
      div {
        margin-bottom: 0px;
      }
      a {
        // font-weight: bold;
        line-height: 100px;
        margin-left: 80px;
        font-size: 16px;
      }
      .a1 {
        margin-left: 240px;
      }
      .a2 {
        margin-left: 160px;
      }
    }
  }
.boxPassword {
  position: relative;
  input {
    height: 30px;
    border: 1px solid #cccccc;
  }
  p {
    text-align: center;
    font-size: 15px;
    color: red;
  }
  >div:nth-child(1) {
   position: absolute;
   left: 50%;
   transform: translateX(-50%);
    top: 100px;
    width: 300px;
  }
  >div:nth-child(2) {
   position: absolute;
   left: 50%;
   top: 200px;
   transform: translateX(-50%);
   width: 300px;
  }
  >div:nth-child(3) {
   position: absolute;
   left: 50%;
   top: 300px;
   transform: translateX(-50%);
   width: 340px;
  }
  >div:nth-child(4) {
   position: absolute;
   left: 50%;
   top: 400px;
   transform: translateX(-50%);
   width: 400px;
  }
}
#yesOne {
  width: 80px;
  height: 30px;
  margin-left: 100px;
  background-color: #fe7844;
}
#noOne {
  width: 80px;
  height: 30px;
  background-color: #919191;
}
</style>
