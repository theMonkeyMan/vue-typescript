<template>
  <div class='index'>
    <!--<Menus
        :menu-index="menuIndex"
        :menu-sub-index="menuSubIndex"
        :shop-msg="shopMsg"
       ></Menus> -->
    <div id="product-box">
      <div class="product-manage">
        <i></i>属性管理</div>
      <div class="product-wrap">
        <el-tabs v-model="dialogObj.type" @tab-click="handleClick">
          <el-tab-pane label="商品规格" name="1"></el-tab-pane>
          <el-tab-pane label="商品属性" name="2"></el-tab-pane>
        </el-tabs>
        <div class="property-btn">
          <el-button class="btn" type="danger" @click="addBtn()">新增{{menuObj[dialogObj.type].name}}</el-button>
          <el-tooltip class="item" effect="light" :content="menuObj[dialogObj.type].content" placement="right">
            <i class="ico-tip"></i>
          </el-tooltip>
        </div>
        <el-table v-cloak :data="tableData" height="780" style="width: 100%;">
          <el-table-column prop="name" width="180" :label="'菜品' + menuObj[dialogObj.type].name">
          </el-table-column>
          <el-table-column :label="menuObj[dialogObj.type].name + '选项'">
            <template scope="scope">
              <div class="deal">
                <span class="nums" v-for="item in scope.row.items" v-bind:key="item" v-text="dialogObj.type === '1' ? item.item_name : item"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="product_num" label="已绑定菜品" width="180">
            <template scope="scope">
              <div class="deal">
                <el-button type="text" class="button see" @click="1">{{scope.row.product_num}}个菜品</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="do" width="180" label="操作">
            <template scope="scope">
              <div class="deal">
                <!--<el-button type="text" class="button see" @click="editItem(scope.row)">编辑</el-button> -->
                <el-button type="text" class="button see" @click="delItem(scope.row.id)" :disabled="scope.row.product_num !== 0">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <AddAttr :dialog-obj="dialogObj" @hideAdd="hideAdd" @addFinish="addFinish">
    </AddAttr>
    <Confirm-alert :conObj="confirmObj" @sure="sureOperation" @cancel="cancelOperation"></Confirm-alert>
  </div>
</template>
<script lang="ts">
import * as Vue from 'vue';
import Component from 'vue-class-component';
import ConfirmAlert from '../../alert/confirmAlert.vue';
import Menus from '../../Menus.vue';
import AddAttr from './addAttr.vue';
import { searchProductSpec, searchProductAttr, delProductAttr, delProductSpec } from '../../../service/product/property';
@Component({
  props: {

  },
  components: {
    Menus,
    AddAttr,
    ConfirmAlert
  },
})
export default class Property extends Vue {
  menuIndex: number = 1;
  menuSubIndex: number = 1.3;
  shopMsg: any = JSON.parse(window.localStorage.getItem('shopMsg') as any);
  dialogObj: any = {
    isShowAdd: false,
    itemObj: {
      items: []
    },
    type: '1',
    isEdit: false
  };
  tableData: Array<any> = []; // 表格数据
  menuObj: any = { // 根据tab切换table内容
    '1': {
      name: '规格', // 标题
      content: '商品规格，如份量：大份、小份；商家可根据自身情况自行添加。' // 内容
    },
    '2': {
      name: '属性',
      content: '商品属性，如口味：微辣、中辣；商家可根据自身情况自行添加。'
    }
  };
  confirmObj: any = { // 确认弹窗
    showConfirm: false, // 是否显示弹窗
    title: '', // 弹窗标题
    text: '', // 弹窗内容
    func: () => { } // 弹窗确认回调方法
  };
  $message: any;

  created() {
    // 页面初始化加载规格列表
    this.getSpec()
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

  // 菜单切换 1：规格 2：属性
  handleClick(tab: any, event: any) {
    if (this.dialogObj.type === '1') {
      this.getSpec()
    } else {
      this.getAttr()
    }
  }

  // 新增规格/属性
  addBtn() {
    this.dialogObj.isShowAdd = true
  }

  // 关闭弹窗
  hideAdd() {
    this.dataReset()
  }

  // 新增/编辑完成
  addFinish() {
    this.dataReset()
    if (this.dialogObj.type === '1') {
      this.getSpec()
    } else {
      this.getAttr()
    }
  }

  // 获取规格列表
  getSpec() {
    searchProductSpec({
      show_product_num: 1
    }).then((data: any) => {
      this.tableData = data.data[0].list
    })
  }

  // 获取属性列表
  getAttr() {
    searchProductAttr({
      show_product_num: 1
    }).then((data: any) => {
      this.tableData = data.data[0].list
    })
  }

  // 编辑规格/属性
  editItem(item: any) {
    this.dialogObj.isEdit = true
    // 深复制数组
    this.dialogObj.itemObj = JSON.parse(JSON.stringify(item))
    this.dialogObj.isShowAdd = true
  }

  // 数据初始化
  dataReset() {
    this.dialogObj.itemObj = { items: [] }
    this.dialogObj.isShowAdd = false
  }

  delItem(id: any) {
    // let _this = this
    this.showConfirm('确认删除', `删除${this.menuObj[this.dialogObj.type].name}后无法找回`, () => {
      if (this.dialogObj.type === '1') {
        delProductSpec({
          id: id
        }).then((data: any) => {
          if (data.code === '0') {
            this.$message({
              message: `规格删除成功`,
              type: 'success'
            })
            this.getSpec()
          }
        })
      } else {
        delProductAttr({
          id: id
        }).then(data => {
          this.$message({
            message: `属性删除成功`,
            type: 'success'
          })
          this.getAttr()
        })
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

.index {
  height: 100%;
}

button {
  span {
    display: block;
  }
}

.is-disabled {
  color: rgb(217, 193, 191)!important;
}

.el-table {
  max-height: 776px;
}

#product-box {
  /*height: calc(~"100% - 68px");*/
  height: 960px;
  background: #f1f1f3;
  margin-left: 200px;
}

.product-wrap {
  height: calc(~"100% - 94px");
  padding: 0 20px 20px;
  margin: 12px;
  background: #fff;
  border-radius: 4px;
  .property-btn {
    margin-bottom: 15px;
    .ico-tip {
      width: 20px;
      height: 20px;
      display: inline-block;
      background: url("../../../assets/images/hint.png") no-repeat center;
      background-size: cover;
      vertical-align: middle;
      margin-left: 20px;
    }
    .btn {
      border-radius: 5px;
      padding: 6px 14px;
      height: 29px;
    }
  }
  .deal {
    .see {
      color: #318aff;
    }
    .nums {
      min-width: 50px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      background: #f1f1f3;
      border: 1px solid #dfdfdf;
      display: inline-block;
      border-radius: 4px;
      margin: 2px;
      padding: 0 2px;
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
>>>>>>> develop
