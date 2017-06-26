<template>
  <div style="height: 100%;">
    <!-- <Menus
        :menu-index="menuIndex"
        :menu-sub-index="menuSubIndex"
        :shop-msg="shopMsg"
        ></Menus> -->
    <Confirm-alert :conObj="confirmObj" @sure="sureOperation" @cancel="cancelOperation"></Confirm-alert>
    <MultUpload :is-show-load="isShowLoad" @hideLoad="hideUpLoad"></MultUpload>
    <Pic :is-pics="showpics" @hidePicModel="hidePic" :is-product="productMsg"></Pic>
    <div id="product-box">
      <div class="product-manage">
        <i></i>商品管理</div>
      <div class="product-wrap">
        <div class="sale-line">
          <div class="product-status">
            <el-tabs v-model="activeKinds" @tab-click="handleClick">
              <el-tab-pane label="出售中" name="1"></el-tab-pane>
              <el-tab-pane label="已售罄" name="2"></el-tab-pane>
              <el-tab-pane label="已下架" name="3"></el-tab-pane>
            </el-tabs>
            <el-button :plain="true" type="danger" class="btn uploadBtn" @click="upload()">批量导入</el-button>
          </div>
        </div>
        <div class="deal-wrap">
          <ul class="product-kinds">
            <li v-for="(type, index) in typeList" v-bind:key="index" :class="{'activeKinds': type.is_default === 1}" @click="changeType(type)">
              <span v-text="type.name"></span>
            </li>
          </ul>
          <div class="product-kinds-detail">
            <div class="select-info">
              <router-link to="/newProduct">
                <el-button class="btn" type="danger" :type-list="typeList" :skuObj="skuObj" :flag="flag">新增商品</el-button>
              </router-link>
              <div class="serch-product el-input el-input--small" style="width: 190px;">
                <input placeholder="请输入内容" size="small" type="text" rows="2" maxlength="20" class="el-input__inner" v-model="searchText" @keydown.13="search">
                <el-button :plain="true" type="danger" class="btn serachKind" @click="search">搜索</el-button>
              </div>
            </div>
            <ul class="list-info">
              <li v-for="(product, index) in productList" v-bind:key="index">
                <div class="li-wrap">
                  <div class="pic-info">
                    <el-checkbox v-model="product.isChecked" class="select-kinds" @change="getChooseState"></el-checkbox>
                    <p class="img-box" @mouseover="changePicsOver(index)" @mouseout="changePicsMove()">
                      <img :src="product.pic || defaultPic" class="lazy">
                      <span class="good" v-show="product.pic_size === 1">推荐</span>
                      <span class="changePic" v-show="idx === index" @click="showPics(product)">更换图片</span>
                    </p>
                    <div class="kinds-info">
                      <h4 v-text="product.name"></h4>
                      <div class="price">
                        <span>&yen;
                          <i v-text="product.show_price"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="deal">
                    <el-button type="text" class="button" v-show="activeKinds === '1'" @click="putOut(product.id, 2)">沽清</el-button>
                    <el-button type="text" class="button" v-show="activeKinds === '2'" @click="putOut(product.id, 1)">开卖</el-button>
                    <el-button type="text" class="button" v-show="activeKinds === '3'" @click="putAway(product.id, 1)">上架</el-button>
                    <el-button type="text" class="button" v-show="activeKinds !== '3'" @click="putAway(product.id, 2)">下架</el-button>
                    <el-button type="text" class="button" v-show="activeKinds === '3'" @click="delProd(product.id)">删除</el-button>
                    <router-link :to="{path:'/newProduct',query:{id:product.id}}">
                      <el-button type="text" class="button">编辑</el-button>
                    </router-link>
                    <el-button type="text" class="button" v-show="activeKinds === '1' && product.pic_size === 0" @click="setRecommend(product.id, 1)">&nbsp;&nbsp;&nbsp;&nbsp;推荐&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button type="text" class="button" v-show="activeKinds === '1' && product.pic_size === 1" @click="setRecommend(product.id, 2)">取消推荐</el-button>
                  </div>
                </div>
              </li>
            </ul>
            <div class="pages" v-show="productList.length">
              <div class="sele-checked">
                <el-checkbox class="all-select" v-model="allChecked" @change="checkAll">全选</el-checkbox>
                <el-button :plain="true" type="danger" class="btn" :disabled="!isClick" v-show="activeKinds === '1'" @click="batchPutOut(2)">沽清</el-button>
                <el-button :plain="true" type="danger" class="btn" :disabled="!isClick" v-show="activeKinds === '2'" @click="batchPutOut(1)">开卖</el-button>
                <el-button :plain="true" type="danger" class="btn" :disabled="!isClick" v-show="activeKinds === '3'" @click="batchPutAway(1)">上架</el-button>
                <el-button :plain="true" type="danger" class="btn" :disabled="!isClick" v-show="activeKinds !== '3'" @click="batchPutAway(2)">下架</el-button>
                <el-button :plain="true" type="danger" class="btn" :disabled="!isClick" v-show="activeKinds === '3'" @click="batchDel()">删除</el-button>
                <!--<el-button :plain="true" type="danger" class="btn" :disabled="!isClick">改分类</el-button> -->
              </div>
              <div class="block">
                <el-button class="page-ensure" type="danger" @click="pageSearch">确定</el-button>
                <el-pagination class="page-info" @current-change="handleCurrentChange" :current-page.sync="pagination.current_page" :page-size="pagination.per_page" layout="prev, pager, next, jumper" :total="pagination.total_count">
                </el-pagination>
              </div>
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
import Menus from '../Menus.vue';
import ConfirmAlert from '../alert/confirmAlert.vue';
import MultUpload from '../alert/multUpload.vue';
import Pic from '../pic/pic.vue';
import { fetchProductList, fetchTypeList, fetchStockStatus, fetchPutAway, fetchRecommend, delProduct, fetchDetail, batchPutAway, batchDelProduct, batchStockStatus } from '../../service/product/product';
@Component({
  components: {
    Menus,
    ConfirmAlert,
    MultUpload,
    Pic
  },
  watch: {
    showAdd: function (this: any, val, oldVal) {
      if (val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.removeAttribute('style')
      }
    }
  }
})
export default class Product extends Vue {
  flag: number = 1;// 1.新增2.编辑
  showAdd: boolean = false;
  isShowLoad: boolean = false;
  showpics: boolean = false;// 图库
  productMsg: any = {};// 商品信息
  changeOver: boolean = false;
  changeMove: boolean = true;
  idx: string = '';
  maxs: number = 20;
  menuIndex: number = 2;
  activeKinds: string = '1';
  allChecked: boolean = false;// 是否全选
  currentPage: number = 1;
  typeList: Array<any> = [];// 商品分类列表
  propTypeList: Array<any> = [];
  params: any = {// 商品列表参数
    status: 1,// 商品状态，传0表示所有（1：出售中；2：已售罄；3：已下架）
    category_id: '',// 商品分类数据(1 返回“本店招牌”的数据，不填返回所有分类的数据)
    with_cate: 2,// 是否返回商品分类列表（1：是；2：否）
    name: '',// 商品名称
    page: 0,// 页数
    page_size: 10// 每页条数
  };
  pagination: any = {// 分页信息
    current_page: 1,// 当前页
    page_count: 1,// 页数
    per_page: 10,// 每页条数
    total_count: 1// 总条数
  };
  confirmObj: any = {// 确认弹窗
    showConfirm: false,// 是否显示弹窗
    title: '',// 弹窗标题
    text: '',// 弹窗内容
    func: () => { }// 弹窗确认回调方法
  };
  productList: Array<any> = [];// 商品列表
  isClick: any = false;// 没有多选禁止批量操作
  shopMsg: any = JSON.parse(window.localStorage.getItem('shopMsg') as any) || '';
  skuObj: any = {};// 编辑商品传递商品sku
  searchText: string = '';// 搜索
  defaultPic: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAYAAACKAxD9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Nzg5MURBMzYwQUM0MTFFNzkwQTI4RDg2MjMxNzVGQUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0M4RUNENzQwQUM0MTFFNzkwQTI4RDg2MjMxNzVGQUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3ODkxREEzNDBBQzQxMUU3OTBBMjhEODYyMzE3NUZBQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3ODkxREEzNTBBQzQxMUU3OTBBMjhEODYyMzE3NUZBQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrLmaUgAAAmgSURBVHja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';
  $message: any;
  created() {
    // 用户信息不存在强制跳回登录
    if (!this.shopMsg) {
      history.replaceState(null, '', '/')
      location.reload()
    }
    // 初始化加载数据
    this.fetchType()
  }
  // 隐藏上传弹窗
  hideUpLoad() {
    this.isShowLoad = false
    this.fetchData()
    this.fetchType()
  }
  // 显示上传弹窗
  upload() {
    this.isShowLoad = true
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
  // 获取批量选择状态，如果选择数量大于零，则启用批量操作按钮，否则隐藏，如果多选框全部勾选则选中全选按钮
  getChooseState() {
    let len = this.productList.filter(pro => {
      if (pro.isChecked) {
        return true
      }
    }).length
    this.isClick = len > 0 ? 1 : 0
    this.allChecked = len === this.productList.length ? Boolean(1) : Boolean(0)
  }
  // 编辑商品信息
  editProd(id: any) {
    fetchDetail({
      id: id
    }).then((data: any) => {
      this.flag = 2
      this.skuObj = data.data
    })
  }
  // 获取商品信息
  fetchData() {
    if (this.allChecked) {
      this.allChecked = false
    }
    fetchProductList(this.params)
      .then((data: any) => {
        if (data.code === '0') {
          if (!data.data[0].list && this.params.page !== 0) {
            this.params.page -= 1
            return this.fetchData()
          }
          if (data.data[0].list) {
            for (let item of data.data[0].list) {
              item.isChecked = false
              item.show_price = Math.min(...item.show_price) / 100
            }
          }
          this.productList = data.data[0].list || []
          this.pagination = data.data[0].pagination
        }
      })
  }
  // 获取所有批量操作勾选的商品
  getAllChecked() {
    let idArr = []
    for (let val of this.productList) {
      if (val.isChecked) {
        idArr.push(val.id)
      }
    }
    return idArr
  }
  // 获取分类列表
  fetchType() {
    fetchTypeList({})
      .then((data: any) => {
        if (data.data) {
          data.data[0][0].is_default = 2
          data.data[0].unshift({ id: '', is_default: 1, name: '全部' })
          this.typeList = data.data[0]
          this.fetchData()
        }
      })
  }
  // 批量删除
  batchDel() {
    let arr = this.getAllChecked()
    let _this = this
    this.showConfirm('确认删除', `已选中${arr.length}个商品、删除后将无法找回`, () => {
      batchDelProduct({
        ids: arr
      }).then((data: any) => {
        if (data.code === '0') {
          _this.$message({
            message: '商品批量删除成功',
            type: 'success'
          })
          _this.isClick = false
          _this.fetchData()
        }
      })
    })
  }
  // 全选操作
  checkAll() {
    if (this.allChecked) {
      for (let val of this.productList) {
        val.isChecked = true
      }
      this.isClick = true
    } else {
      for (let val of this.productList) {
        val.isChecked = false
      }
      this.isClick = false
    }
  }
  // 删除商品
  delProd(id: any) {
    let _this = this
    this.showConfirm('确认删除', '已选中1个商品、删除后将无法找回', () => {
      delProduct({
        id: id
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
  // 搜索商品
  search() {
    for (let i of this.typeList) {
      i.is_default = 2
    }
    this.typeList[0].is_default = 1
    this.params.name = this.searchText
    this.params.category_id = ''
    this.fetchData()
  }
  // 分页查询商品
  pageSearch() {
    this.params.page = (document.getElementsByClassName('el-pagination__editor') as any)[0].value - 1
    this.fetchData()
  }

  handleClick(tab: any, event: any) {
    this.params.status = this.activeKinds
    this.fetchData()
  }

  handleCurrentChange(val: any) {
    // event.stopPropagation()
    this.params.page = val - 1
    this.fetchData()
  }
  // 改变查询分类
  changeType(item: any) {
    for (let i of this.typeList) {
      i.is_default = 2
    }
    item.is_default = 1
    this.params.category_id = item.id
    this.fetchData()
  }
  // 新增商品
  addProd() {
    this.flag = 1
    this.skuObj = {}
  }
  // 开卖、沽清商品
  putOut(id: any, status: any) {
    fetchStockStatus({
      id: id,
      status: status
    }).then((data: any) => {
      if (data.code === '0') {
        this.$message({
          message: `商品${status === 1 ? '开卖' : '沽清'}成功`,
          type: 'success'
        })
        this.fetchData()
      }
    })
  }
  // 批量开卖、沽清商品
  batchPutOut(status: any) {
    let arr = this.getAllChecked()
    let _this = this
    this.showConfirm(`确认${status === 1 ? '开卖' : '沽清'}`, `已选中${arr.length}个商品、${status === 1 ? '开卖后客户可以进行购买' : '沽清后客户将无法购买'}`, () => {
      batchStockStatus({
        ids: arr,
        op: status
      }).then((data: any) => {
        if (data.code === '0') {
          _this.$message({
            message: `商品批量${status === 1 ? '开卖' : '沽清'}成功`,
            type: 'success'
          })
          _this.isClick = false
          _this.fetchData()
        }
      })
    })
  }
  // 上架、下架商品
  putAway(id: any, status: any) {
    fetchPutAway({
      id: id,
      status: status
    }).then((data: any) => {
      if (data.code === '0') {
        this.$message({
          message: `商品${status === 1 ? '上架' : '下架'}成功`,
          type: 'success'
        })
        this.fetchData()
      }
    })
  }
  // 批量上架，下架商品
  batchPutAway(status: any) {
    let arr = this.getAllChecked()
    let _this = this
    this.showConfirm(`确认${status === 1 ? '上架' : '下架'}`, `已选中${arr.length}个商品、${status === 1 ? '上架后客户可以查看并购买' : '下架后客户将无法查看并购买'}`, () => {
      batchPutAway({
        ids: arr,
        op: status
      }).then((data: any) => {
        if (data.code === '0') {
          _this.$message({
            message: `商品批量${status === 1 ? '上架' : '下架'}成功`,
            type: 'success'
          })
          _this.isClick = false
          _this.fetchData()
        }
      })
    })
  }
  // 推荐商品
  setRecommend(id: any, status: any) {
    fetchRecommend({
      id: id,
      op: status
    }).then((data: any) => {
      if (data.code === '0') {
        this.$message({
          message: `商品${status === 1 ? '推荐' : '取消推荐'}成功`,
          type: 'success'
        })
        this.fetchData()
      }
    })
  }
  // 二次确认弹窗
  showConfirm(title: any, text: any, callback: any) {
    this.confirmObj.title = title
    this.confirmObj.text = text
    this.confirmObj.func = callback
    this.confirmObj.showConfirm = true
  }
  // 修改商品图片
  showPics(product: any) {
    this.showpics = true
    this.productMsg = product
  }

  hidePic() {
    this.showpics = false
    this.fetchData()
  }

  changePicsOver(index: any) {
    this.idx = index
  }

  changePicsMove(index: any) {
    this.idx = ''
  }
}
</script>
<style lang="less" scoped>
input[type="number"] {
  -moz-appearance: textfield;
}

button {
  span {
    display: block;
  }
}

.page-info input {
  width: 100px;
}

#product-box {
  background: #f1f1f3;
  overflow: hidden;
  margin-left: 200px;
  clear: both;
  color: #333;
}

.product-wrap {
  margin: 12px;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  .sale-line {
    line-height: 61px;
  }
}

.product-status {
  position: relative;
  height: 60px;
  top: 0;
  left: 0;
  padding-left: 70px;
  border-bottom: 1px solid #ddd;
  .uploadBtn {
    position: absolute;
    right: 60px;
    top: 16px;
  }
  .el-tabs__item {
    padding: 0 30px!important;
  }
}

.product-kinds {
  width: 186px;
  padding: 0px 20px 10px 0;
  overflow: hidden;
  background: #fff;
  overflow-y: auto;
  max-height: 100vh;
}

.product-kinds li {
  text-align: left !important;
  padding-left: 20px;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  min-width: 152px;
  cursor: pointer;
  height: 50px;
  display: flex;
  align-items: center;
}

.product-kinds li span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
}

.product-kinds li:active {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-left: 4px solid #f13e42;
  color: #f13e42;
  width: 162px;
}

.activeKinds {
  border-top: 1px solid #ddd !important;
  border-bottom: 1px solid #ddd !important;
  border-left: 3px solid #f13e42;
  color: #f13e42;
  width: 162px;
}


.product-kinds-detail {
  display: inline-block;
  width: 100%;
  border-left: 1px solid #ddd;
  min-height: 780px;
  text-align: left;
}

.all-select {
  margin-right: 20px;
}

.btn {
  border-radius: 5px;
  padding: 6px 14px;
  height: 29px;
}

.serch-product {
  display: inline-block;
  float: right;
  position: relative;
  right: 94px;
  top: 0;
}

.serachKind {
  width: 60px;
  float: right;
  position: absolute;
  top: 0;
  right: -70px;
}


.list-info li {
  padding: 12px 36px 6px 36px;
  width: 100%;
  border-bottom: 1px solid #ddd;
}

.list-info li:first-child {
  border-top: 1px solid #ddd;
}

.list-info li:hover {
  background: #f9f9f9;
}

.select-info {
  margin: 14px 36px;
}

.list-info li p {
  display: inline-block;
  margin-left: 10px;
}

.img-box {
  width: 74px;
  height: 74px;
  position: relative;
}

.img-box img {
  width: 100%;
  height: 100%;
}

.good {
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(241, 62, 66, 0.5);
  width: 51px;
  width: 100%;
  text-align: center;
  color: #fff;
}

.kinds-info {
  display: inline-block;
  position: relative;
  top: -10px;
  left: 10px;
  h4 {
    color: #333;
    font-weight: normal;
  }
}

.price {
  margin-top: 17px;
  color: #f13e42;
  font-weight: bold;
}

.price i {
  font-style: normal;
}

.select-kinds {
  position: relative;
  top: -26px;
}

.deal {
  line-height: 80px;
  color: #4a90ff;
}

.deal .button {
  margin-left: 32px;
  color: #3489ff;
}

.pages {
  height: 68px;
  text-align: right;
  position: relative;
  overflow: hidden;
}

.block {
  padding-top: 0;
}

.page-ensure {
  height: 29px;
  line-height: 9px;
  float: right;
  margin-right: 50px;
}

.page-info {
  margin: 18px 124px 0 185px;
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

.sele-checked {
  float: left;
  margin-top: 19px;
  margin-left: 37px;
}

.deal-wrap {
  display: flex;
}

.li-wrap {
  display: flex;
  justify-content: space-between;
  padding-right: 90px;
}

.changePic {
  position: absolute;
  cursor: pointer;
  width: 100%;
  height: 100%;
  bottom: 0;
  color: #fff;
  line-height: 74px;
  text-align: center;
  font-size: 15px;
  background: rgba(0, 0, 0, .6);
}

.hehe {
  display: none;
}

@media screen and (max-width: 1250px) {
  #product-box {
    width: 1045px;
  }
}
</style>