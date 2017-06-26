<template>
  <div class='index'>
    <!--<Menus
        :menu-index="menuIndex"
        :menu-sub-index="menuSubIndex"
        :shop-msg="shopMsg"
       ></Menus> -->
    <div id="product-box">
      <div class="product-manage">
        <i></i>加料管理</div>
      <div class="product-wrap">
        <div class="property-btn">
          <el-button class="btn" type="danger" @click="addBtn()">新增商品</el-button>
          <div class="serch-product el-input el-input--small" style="width: 264px;">
            <input placeholder="请输入内容" size="small" type="text" rows="2" maxlength="20" class="el-input__inner" v-model="searchText" @keydown.13="fetchData">
            <el-button :plain="true" type="danger" class="btn serachKind" @click="fetchData">搜索</el-button>
          </div>
        </div>
        <el-table :data="tableData" max-height="802" style="width: 100%;">
          <el-table-column prop="name" label="" width="40">
            <template scope="scope">
              <div class="deal">
                <el-checkbox v-model="scope.row.isChecked" @change="getChooseState" :disabled="scope.row.stock_on === 1 && scope.row.stock === 0"></el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品" width="180">
            <template scope="scope">
              <div class="deal">
                <span>{{scope.row.name}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price_sell" label="价格" width="180">
            <template scope="scope">
              <span> &yen;{{ scope.row.price_sell / 100}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="180">
            <template scope="scope">
              <span> {{scope.row.stock_on === 2 ? '不设库存' : scope.row.stock}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="attr" label="已绑定菜品">
            <template scope="scope">
              <div class="deal">
                <el-button type="text" class="button see" @click="1">{{scope.row.product_num}}个菜品</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="do" label="操作" width="300">
            <template scope="scope">
              <div class="deal">
                <el-button type="text" class="button" :disabled="scope.row.stock_on === 1 && scope.row.stock === 0" @click="setSaleOut(scope.row.id)">沽清</el-button>
                <el-button type="text" class="button" @click="editItem(scope.row)">编辑</el-button>
                <el-button type="text" class="button" :disabled="scope.row.product_num !== 0" @click="delProduct(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="deal-box">
        <div class="do-bottom">
          <div class="sele-checked">
            <el-checkbox class="all-select" v-model="allChecked" @change="checkAll">全选</el-checkbox>
            <el-button :plain="true" type="danger" class="btn" style="display:none;">绑定</el-button>
            <el-button :plain="true" type="danger" class="btn" :disabled="!isClick" @click="batchSaleOut">沽清</el-button>
          </div>
          <div class="block">
            <el-button class="page-ensure" type="danger" @click="fetchData">确定</el-button>
            <el-pagination class="page-info" @current-change="handleCurrentChange" :current-page.sync="pagination.current_page" :page-size="pagination.per_page" layout="prev, pager, next, jumper" :total="pagination.total_count">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <AddFeed :sku-obj="skuObj" @hideAdd="hideAdd"></AddFeed>
    <Confirm-alert :conObj="confirmObj" @sure="sureOperation" @cancel="cancelOperation"></Confirm-alert>
  </div>
</template>
<script lang="ts">
import * as Vue from 'vue';
import Component from 'vue-class-component';
import ConfirmAlert from '../../alert/confirmAlert.vue';
import Menus from '../../Menus.vue';
import AddFeed from './addFeed.vue';
import { searchAppendage, delAppendage, setAppendageStatus, batchAppendageStatus } from '../../../service/product/feed';
@Component({
  props: {

  },
  components: {
    Menus,
    AddFeed,
    ConfirmAlert
  },
})
export default class Feed extends Vue {
  menuIndex: number = 1;
  menuSubIndex: number = 1.4;
  allChecked: boolean = false;
  isShowAdd: boolean = false;
  shopMsg: any = JSON.parse(window.localStorage.getItem('shopMsg') as any);
  tableData: Array<any> = [];
  searchText: string = '';
  skuObj: any = {
    isShowAdd: false,
    isEdit: false,
    sku: {},
    stockFlag: false,
    dailyFlag: false
  };
  pagination: any = { // 分页信息
    current_page: 1, // 当前页
    page_count: 1, // 页数
    per_page: 18, // 每页条数
    total_count: 1 // 总条数
  };
  pageNow: number = 0; // 保存当前页码，因分页组件和后端数据分别从0和1开始计数，所以需要区别开
  isClick: any = false; // 没有多选禁止批量操作
  confirmObj: any = { // 确认弹窗
    showConfirm: false, // 是否显示弹窗
    title: '', // 弹窗标题
    text: '', // 弹窗内容
    func: () => { } // 弹窗确认回调方法
  };
  $message: any;

  created() {
    this.fetchData()
  }

  // 二次确认弹窗
  showConfirm(title: any, text: any, callback: any) {
    this.confirmObj.title = title
    this.confirmObj.text = text
    this.confirmObj.func = callback
    this.confirmObj.showConfirm = true
  }

  // 确认弹窗确认按钮回调方法
  sureOperation() {
    this.confirmObj.func()
    this.cancelOperation()
  }

  // 确认弹窗取消按钮回调方法
  cancelOperation() {
    this.confirmObj.showConfirm = false
  }

  addBtn() {
    this.skuObj.isShowAdd = true
  }

  hideAdd() {
    this.resetData()
    this.fetchData()
  }

  handleCurrentChange(val: any) {
    // event.stopPropagation()
    this.pageNow = val - 1
    this.fetchData()
  }

  fetchData() {
    searchAppendage({
      name: this.searchText,
      show_product_num: 1,
      page: this.pageNow,
      page_size: this.pagination.per_page
    }).then((data: any) => {
      for (let item of data.data[0].list) {
        item.isChecked = false
      }
      this.tableData = data.data[0].list
      this.pagination = data.data[0].pagination
    })
  }

  editItem(item: any) {
    let temp = JSON.parse(JSON.stringify(item))
    temp.price_sell = parseFloat(temp.price_sell / 100 as any);
    this.skuObj = {
      isShowAdd: true,
      isEdit: true,
      sku: temp,
      stockFlag: temp.stock_on === 1 ? Boolean(1) : Boolean(0),
      dailyFlag: temp.stock_daily_on === 1 ? Boolean(1) : Boolean(0)
    }
  }

  resetData() {
    this.skuObj = {
      isShowAdd: false,
      isEdit: false,
      sku: {
        name: '',
        price_sell: '',
        stock: ''
      },
      stockFlag: false,
      dailyFlag: false
    }
  }

  // 全选操作
  checkAll() {
    if (this.allChecked) {
      for (let val of this.tableData) {
        if (!(val.stock_on === 1 && val.stock === 0)) {
          val.isChecked = true
        }
      }
      this.isClick = true
    } else {
      for (let val of this.tableData) {
        if (!(val.stock_on === 1 && val.stock === 0)) {
          val.isChecked = false
        }
      }
      this.isClick = false
    }
  }

  // 获取批量选择状态，如果选择数量大于零，则启用批量操作按钮，否则隐藏，如果多选框全部勾选则选中全选按钮
  getChooseState() {
    let len = this.tableData.filter(pro => {
      if (pro.isChecked) {
        return true
      }
    }).length
    this.isClick = len > 0 ? 1 : 0
    this.allChecked = len === this.tableData.length ? Boolean(1) : Boolean(0)
  }

  // 删除加料商品
  delProduct(item: any) {
    let _this = this
    this.showConfirm('确认删除', `删除后商品无法找回`, () => {
      delAppendage({
        id: item.id
      }).then((data: any) => {
        if (data.code === '0') {
          _this.$message({
            message: '商品删除成功',
            type: 'success'
          })
          _this.fetchData()
        }
      })
    })
  }

  // 加料商品沽清
  setSaleOut(id: any) {
    setAppendageStatus({
      id: id,
      op: 2
    }).then((data: any) => {
      if (data.code === '0') {
        this.$message({
          message: '商品沽清成功',
          type: 'success'
        })
        this.fetchData()
      }
    })
  }

  // 获取所有批量操作勾选的商品
  getAllChecked() {
    let idArr = []
    for (let val of this.tableData) {
      if (val.isChecked) {
        idArr.push(val.id)
      }
    }
    return idArr
  }

  // 批量开卖、沽清商品
  batchSaleOut(status: any) {
    let arr = this.getAllChecked()
    batchAppendageStatus({
      ids: arr,
      op: 2
    }).then((data: any) => {
      if (data.code === '0') {
        this.$message({
          message: `商品批量沽清成功`,
          type: 'success'
        })
        this.isClick = false
        this.fetchData()
      }
    })
  }
}
</script>
<style>
#app {
  height: 100vh;
}
</style>
<style lang="less" scoped>
.el-tooltip__popper.is-light {
  background: #f1f7fe !important;
}

.el-input--small .el-input__inner {
  margin-right: 10px;
  width: 190px;
}

.index {
  height: 100%;
}

button {
  font-family: SC!important;
  span {
    display: block;
  }
  text-align: left;
}

.is-disabled {
  color: rgb(217, 193, 191)!important;
}

#product-box {
  /*height: calc(~"100% - 68px");*/
  background: #f1f1f3;
  margin-left: 200px;
  padding-bottom: 1px;
}

.deal-box {
  position: relative;
  .do-bottom {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 68px;
    position: absolute;
    top: -100px;
    left: 0;
    .sele-checked {
      margin-top: 19px;
      margin-left: 37px;
    }
    .btn {
      border-radius: 5px;
      padding: 6px 14px;
      height: 29px;
    }
  }
  .all-select {
    margin-right: 20px;
  }
  .block {
    padding-top: 0;
  }
  .page-ensure {
    height: 29px;
    line-height: 9px;
    float: right;
    margin-right: 50px;
    margin-top: 18px;
  }
  .page-info {
    margin: 18px 124px 0 185px;
    input {
      width: 100px;
    }
  }
}

.product-wrap {
  /*height: calc(~"100% - 94px");*/
  height: 886px;
  padding: 0 20px 20px;
  margin: 12px;
  background: #fff;
  border-radius: 4px;
  .property-btn {
    margin-bottom: 15px;
    padding-top: 15px;
    display: flex;
    justify-content: space-between;
    .serch-product {
      display: flex;
    }
    .btn {
      border-radius: 5px;
      padding: 6px 14px;
      height: 29px;
    }
  }
  .deal {
    .button {
      color: #318aff;
      width: 50px;
    }
  }
}

.product-manage {
  height: 48px;
  text-align: left;
  background: #fff;
  padding-left: 17px;
  line-height: 48px;
  border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd;
  margin-top: 68px;
}

.product-manage i {
  border-left: 3px solid #fed034;
  padding-right: 10px;
}
</style>
