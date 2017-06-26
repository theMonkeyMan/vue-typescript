<template>
  <div>
    <div class="choosePro" v-show="isChooseFood">
      <div class="contentPro">
        <div class="tips">
          <p>选择商品</p>
          <i class="el-icon-close" @click="closeChoose"></i>
        </div>
        <div class="titleMenus">
          <div class="leftMenu">
            <el-input size="small" placeholder="请输入内容" v-model="input8">
            </el-input>
            <el-button size="small">搜索</el-button>
          </div>
          <div class="block">
            <el-pagination layout="prev, next" @current-change="handleCurrentChange" :total="total">
            </el-pagination>
          </div>
        </div>
        <div class="proList">
          <div class="topTips">
            <div class="left">
              <el-checkbox v-model="checkAll" @change="checkedAll"></el-checkbox>
              <p>菜品名称</p>
            </div>
            <div class="right">
              <span class="sell_price">菜品价格</span>
              <span class="repertory">库存</span>
            </div>
          </div>
          <div class="lietContent" v-for="(list, index) in newProArr" v-bind:key="index">
            <div class="proInfo">
              <div class="proMsg-left">
                <el-checkbox v-model="list.isChecked" @change="getChooseState(list, index, list.isChecked)"></el-checkbox>
                <p>{{list.name}}</p>
              </div>
              <div class="proMsg-right">
                <span>{{list.price_sell}} 元</span>
                <span>{{list.stock}}</span>
              </div>
            </div>
          </div>
          <div class="listBottom">
            <div class="bottomLeft">
              <el-button type="primary" size="small" @click="achieve">完成</el-button>
              <span>已选{{count}}条</span>
            </div>
            <div class="bottomRight">
              <span>共{{page_count}}页，每页5条</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import * as Vue from 'vue';
import Component from 'vue-class-component';
import { searchAppendage } from '../../../service/product/feed';
@Component({
  props: {
    isChooseFood: Boolean,
    chooseArr: Array,
  }
})
export default class ChooseFood extends Vue {
  input8: string = '';
  total: number = 0;
  checkAll: boolean = false;
  proArr: Array<any> = []; // 获取到所有非单买商品的数据
  count: number = 0; // 选中非单买商品的数量
  checkProArr: Array<any> = []; // 选中商品的数据
  page_count: any = '';
  newProArr: Array<any> = [];
  // watch: {
  //   isChooseFood (oldVal, newVal) {
  //     if (!newVal) {
  //       console.log(this.chooseArr)
  //     }
  //   }
  // },
  created() {
    this.getAppendage()
  }

  handleCurrentChange(currentPage: any) {
    this.newProArr = []
    for (let i = 0; i < this.proArr.length; i++) {
      if (i >= (currentPage - 1) * 5) {
        this.newProArr.push(this.proArr[i])
        if (this.newProArr.length === 5) {
          console.log(this.newProArr)
          return
        }
      }
    }
    // console.log(this.newProArr)
    // console.log(this.checkProArr)
    // console.log(currentPage)
    // let s = this.checkProArr.splice(0, 5)
    // console.log(s)
    // this.newProArr = this.proArr
    // this.newProArr = this.newProArr.splice((currentPage - 1) * 5, 5)
    // console.log(this.proArr)
    // // 分页
    // console.log(currentPage)
    // this.checkAll = false
    // this.checkProArr = []
    // this.count = 0
    // let argument = {
    //   page_size: 5,
    //   page: currentPage - 1
    // }
    // searchAppendage(argument).then(data => {
    //   if (data.code === '0') {
    //     for (let item of data.data[0].list) {
    //       item.isChecked = false
    //     }
    //     this.proArr = data.data[0].list || []
    //     for (let list of this.proArr) {
    //       list.price_sell = list.price_sell / 100
    //     }
    //   }
    // })
  }

  hideChoosea() {
    this.$emit('hideChoosea')
  }

  closeChoose() {
    // 关闭添加非单买商品的弹窗
    this.hideChoosea()
    this.getAppendage()
    this.checkProArr = []
    this.newProArr = []
    this.checkAll = false
    this.count = 0
  }

  checkedAll() {
    // 实现全选状态
    this.checkProArr = []
    this.count = 0
    if (this.checkAll) {
      this.count = this.proArr.length
      for (let list of this.proArr) {
        list.isChecked = true
        // 将全部商品添加到数组中
        this.checkProArr.push(list)
      }
    } else {
      for (let list of this.proArr) {
        list.isChecked = false
        this.checkProArr = []
      }
      for (let list of this.newProArr) {
        list.isChecked = false
      }
    }
    for (let list of this.newProArr) {
      if (this.checkAll === true) {
        list.isChecked = true
      }
    }
  }

  achieve() {
    // 将选中的非单买商品传递到父组件中
    this.$emit('transferArr', this.checkProArr)
    this.hideChoosea()
    // this.submitChooseArr()
    // console.log(this.checkProArr)
  }

  getChooseState(list: any, index: any, value: any) {
    // 复选框状态
    // 将选中的非单买商品添加到数组中
    if (value && !this.checkAll) {
      this.checkProArr.push(list)
    } else {
      // this.checkProArr.splice(index, 1)
      for (let i = 0; i < this.checkProArr.length; i++) {
        if (list.id === this.checkProArr[i].id) {
          this.checkProArr.splice(i, 1)
        }
      }
    }
    // 选中的非单买商品的数量
    this.count = this.checkProArr.length
    // 遍历实现非全选和全选的状态
    for (let item of this.proArr) {
      if (item.isChecked === false) {
        this.checkAll = false
        break
      } else {
        this.checkAll = true
      }
    }
    for (list of this.newProArr) {
      if (list.isChecked === false) {
        this.checkAll = false
      }
    }
  }

  getAppendage() {
    // 获取非单买商品列表
    searchAppendage({
      page_size: 1000
    }).then((data: any) => {
      if (data.code === '0') {
        // 遍历给所有非单买商品添加一个复选框状态的属性
        this.total = Math.ceil(data.data[0].pagination.total_count / 5) * 10
        for (let item of data.data[0].list) {
          item.isChecked = false
        }
        this.page_count = Math.ceil(data.data[0].list.length / 5)
        this.proArr = data.data[0].list || []
        for (let list of this.proArr) {
          list.price_sell = list.price_sell / 100
          if (list.stock_on === 2) {
            list.stock = '不设置库存'
          }
        }
        this.proArr = this.proArr
        this.newProArr = JSON.parse(JSON.stringify(this.proArr))
        // console.log(this.proArr)
        this.newProArr = this.newProArr.splice(0, 5)
      }
    })
  }
}
</script>
<style lang='less' scoped>
.choosePro {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  .contentPro {
    background: #fff;
    width: 700px;
    .tips {
      height: 50px;
      color: #f13e42;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f13e42;
      color: #fff;
      p {
        margin-left: 20px;
      }
      i {
        margin-right: 20px;
      }
    }
    .titleMenus {
      display: flex;
      justify-content: space-between;
      margin-left: 30px;
      margin-right: 30px;
      margin-top: 15px;
      .leftMenu {
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          width: 120px;
          font-size: 15px;
          color: #4992ff;
        }
        .el-button {
          margin-left: 20px;
          margin-right: 20px;
        }
      }
    }
    .proList {
      margin-left: 30px;
      margin-right: 30px;
      margin-top: 15px;
      .topTips {
        background: #f1f0f2;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          margin-left: 20px;
          display: flex;
          p {
            margin-left: 40px;
            font-size: 15px;
          }
        }
        .right {
          display: flex;
          margin-right: 20px;
          span {
            width: 200px;
            font-size: 14px;
            text-align: right;
          }
        }
      }
      .lietContent {
        margin-left: 20px;
        margin-right: 20px;
        .proInfo {
          height: 40px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #7e7d7e;
          font-size: 15px;
          .proMsg-right {
            display: flex;
            span {
              width: 200px;
              text-align: right;
            }
          }
          .proMsg-left {
            display: flex;
            p {
              margin-left: 40px;
              font-size: 15px;
            }
          }
        }
      }
      .listBottom {
        height: 45px;
        background: #f1f0f2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        .bottomLeft {
          margin-left: 20px;
          span {
            font-size: 15px;
            color: #7e7d7e;
          }
        }
        .bottomRight {
          margin-right: 20px;
          span {
            font-size: 15px;
            color: #7e7d7e;
          }
        }
      }
    }
  }
}

.block {
  .el-pagination {
    .btn-prev {
      margin-right: 20px;
      width: 40px;
      border-right: 1px solid rgb(229, 211, 209);
    }
    .btn-next {
      width: 40px;
      border-left: 1px solid rgb(229, 211, 209);
    }
  }
}
</style>

