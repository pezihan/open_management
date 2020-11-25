<template>
    <div>
        <div class="column">
          <img src="../assets/images/logo.png" alt="">
          <h2>OpenA网店订单管理系统</h2>
          <div>
            <span class="iconfont icon-denglu"></span>
            <a href="#">{{ employeeName }}</a>
            <span class="iconfont icon-tuichu" @click="logout"></span>
          </div>
        </div>
        <div class="navigation">
            <div v-for="(th, index) in logList" :key="index">
              <tr @click="isShow(index, $event)">
                <th>
                  <span :class="iconsObj1[index]"></span>
                  {{ th.name }}
                  <span :class="iconsObj2[index]"></span>
                </th>
              </tr>
              <div v-show="tdShow">
                <tr v-for="(td, index) in th.lis" :key="index">
                  <router-link :to="td.nav" tag="td" active-class="pitch">{{ td.name }}</router-link>
                </tr>
              </div>
            </div>
        </div>
        <div class="content">
          <div class="aaa"></div>
          <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      employeeName: window.sessionStorage.employeeName,
      logList: [],
      tdShow: false,
      iconsObj1: {
        0: 'iconfont icon-icon',
        1: 'iconfont icon-icon_huabanfuben',
        2: 'iconfont icon-caiwu',
        3: 'iconfont icon-yonghuguanli'
      },
      iconsObj2: {
        0: 'iconfont icon-xiangyou',
        1: 'iconfont icon-xiangyou',
        2: 'iconfont icon-xiangyou',
        3: 'iconfont icon-xiangyou'
      }
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('/home')
      console.log(res)
      if (res.success !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.logList = res.message
    },
    isShow (index, e) {
      // console.log(e.currentTarget.getElementsByClassName('iconfont icon-xiangyou'), index)
      if (e.currentTarget.nextElementSibling.style.display === 'none') {
        this.iconsObj2[index] = 'iconfont icon-xiangxia'
        e.currentTarget.nextElementSibling.style.display = 'block'
      } else {
        e.currentTarget.nextElementSibling.style.display = 'none'
        this.iconsObj2[index] = 'iconfont icon-xiangyou'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .column {
    position: relative;
    width: 100%;
    background-color: #fe7844;
    height: 60px;
    img {
      float: left;
      height: 45px;
      margin-left: 30px;
      margin-top: 8px;
    }
    h2 {
      float: left;
      margin-left: 20px;
      text-align: center;
      line-height: 20px;
      color: #fff;
    }
    div {
      height: 60px;
      float: right;
      color: #fff;
      margin-right: 40px;
      a {
        margin-right: 30px;
        color: #fff;
        vertical-align: middle;
        font-size: 18px;
      }
      span {
        font-size: 30px;
        line-height: 60px;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
  .navigation {
    float: left;
    width: 220px;
    text-align: center;
    padding-top: 20px;
    th {
      position: relative;
      height: 50px;
      border: 1px solid #cccccc;
      border-left: none;
      border-right: none;
      width: 220px;
      text-align: center;
      line-height: 50px;
      font-size: 18px;
      font-weight: inherit;
      cursor: default;
      background-color: #e4e4e4;
      span {
        margin: 0 20px;
        font-size: 21px;
      }
    }
    td {
      height: 50px;
      width: 220px;
      text-align: center;
      line-height: 50px;
      font-size: 18px;
      cursor: default;
    }
    td:hover {
      background-color: #fe7844;
      color: #fff;
    }
  }
  .pitch {
    background-color: #fe7844;
    color: #fff;
  }
  .content {
    position: absolute;
    top: 60px;
    left: 220px;
    width: 88%;
    height: 92%;
    background-color: #f1f1f1;
    .aaa {
      background-color: #e4e4e4;
      height: 20px;
    }
  }
</style>
