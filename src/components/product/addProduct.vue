<template>
  <div>
    <Menus :menu-index="menuIndex" :shop-msg="shopMsg"></Menus>
    <div class="mark">
      <div class="title">
        <span>新增商品</span>
      </div>
      <div class="addProduct" v-show="true">
        <!--<div class="tips">
                <div class="tipsContent">
                  <p>{{shopMsgg}}</p>
                  <i class="el-icon-close" @click="hideModal"></i>
                </div>
              </div>-->
        <div class="productCon">
          <div class="productItem1">
            <p>
              <span>* </span>选择分类：</p>
            <div class="productSel">
              <el-select v-model="classifyValue" placeholder="请选择" size="small" @change="changed()">
                <el-option v-for="(item, index) in typeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <p class="waring" v-show="tabState.classifyValue">
              <i class="el-icon-warning"></i>请选择分类</p>
          </div>
          <div class="productItem2">
            <p>
              <span>* </span>商品名称：</p>
            <el-input placeholder="请输入商品名称，长度不超过20个汉字" size="small" v-model="productName" @blur="changeProName"></el-input>
          </div>
          <p class="proName" v-show="tabState.proName">
            <i class="el-icon-warning"></i>商品名称最多支持20个汉字</p>
          <div class="productItem3">
            <div class="upImage">
              <p>商品图片：</p>
            </div>
            <div class="productUpload">
              <el-upload class="avatar-uploader" enctype="multipart/form-data" :with-credentials="true" :action="imgUrl" :show-file-list="false" :auto-upload="true" :on-success="handleAvatarSuccess" :on-error="erroUpload" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <p v-if="imageUrl" class="changeImg">点击更换</p>
              </el-upload>
              <p class="discr">图片尺寸建议为640X640，支持jpg、png两种图片格式，大小不超过500k</p>
            </div>
          </div>
          <div class="productItem4">
            <p>
              <span>* </span>商品规格：</p>
            <div class="productSiz">
              <el-radio-group v-model="radio2" @change="hand">
                <el-radio :disabled="flag == 1 ? false : items.label!=radio2" v-for="items in redioLabe" :key="items" :label="items.label">{{items.value}}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="productnoSize" v-show="noSize">
            <p>
              <span>* </span>价格：</p>
            <el-input size="small" v-model="price" placeholder="0.01 — 9999.99" @blur="changePrice">
            </el-input>
            <span class="yuan">元</span>
          </div>
          <p class="priceWring" v-show="tabState.priceState">
            <i class="el-icon-warning"></i>请输入正确的价格</p>
          <div class="productOneSize" v-show="proSize">
            <p>
              <span>* </span>规格一：</p>
            <div class="productSear">
              <el-input size="small" placeholder="支持同时输入多个条件，使用逗号隔开" v-model="sizeValue">
              </el-input>
            </div>
            <el-button size="small" @click="addProduct()">添加</el-button>
          </div>
          <div class="productManySize" v-show="manySize">
            <div class="size1">
              <p>
                <span>* </span>规格一：</p>
              <div class="productSear">
                <el-input size="small" placeholder="规格一，支持同时输入多个条件，使用逗号隔开" v-model="sizeValue1">
                </el-input>
              </div>
            </div>
            <div class="size2">
              <p>
                <span>* </span>规格二：</p>
              <div class="productSear">
                <el-input size="small" placeholder="规格二，支持同时输入多个条件，使用逗号隔开" v-model="sizeValue2">
                </el-input>
              </div>
              <el-button size="small" @click="addProduct()">添加</el-button>
            </div>
          </div>
          <div class="productManyPin" v-show="manyPin">
            <div class="foosItem">
              <p>
                <span>* </span>拼盘菜品：</p>
              <div class="productSear">
                <el-tag :key="tag" v-for="tag in dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)">
                  {{tag.name}}
                </el-tag>
                <el-input v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" :maxlength='5' @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加菜品</el-button>
              </div>
            </div>
            <div class="repeat">
              <p>重复选择：
                <el-switch v-model="repeatSelect" on-text="" off-text="">
                </el-switch>
              </p>
            </div>
            <div class="pinpan">
              <p>
                <span>* </span>拼盘：</p>
              <el-select v-model="pinValue" placeholder="请选择" size="small" @change="changePart()">
                <el-option v-for="item2 in pinNum" :key="item2.value" :value="item2.value" :label="item2.value">
                </el-option>
              </el-select>
            </div>
            <div class="pinpanPrice">
              <p>
                <span>* </span>价格：</p>
              <el-input size="small" placeholder="请输入拼盘价格" v-model="parPrice">
              </el-input>
            </div>
          </div>
          <div class="productTab" v-show="tab">
            <table class="gridtable">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>名称</th>
                  <th>价格
                    <b class="jiage">（元）</b>
                  </th>
                </tr>
                <tr v-for="(list, index) in sku" v-bind:key="index">
                  <td>{{index+1}}</td>
                  <td>{{list.property.length > 1 ? list.property[0].item.name+list.property[1].item.name : list.property[0].item.name}}</td>
                  <td>
                    <input type="text" v-model="list.price_sell" placeholder="0.00" @blur="changeSpecPrice(list.price_sell)">
                  </td>
                </tr>
              </thead>
            </table>
          </div>
          <p class="priceWring" v-show="tabState.waringp">
            <i class="el-icon-warning"></i>价格区间：0.01-9999.99</p>
          <div class="productDis">
            <p>菜品描述：</p>
            <div>
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :maxlength="50" resize="none" icon="edit" v-model="intro" placeholder="菜品描述，长度不超过50个汉字">
              </el-input>
            </div>
          </div>
          <div class="productCtr">
            <div class="dummy">
              <p>虚拟销量：
                <el-switch v-model="dummySelect" on-text="" off-text="">
                </el-switch>
              </p>
              <el-input placeholder="1 — 99999" size="mini" v-model="dummy" v-show="dummySelect" @blur="dummyReg"></el-input>
              <i class="el-icon-warning" v-show="dummySelect"></i>
              <p class="dummyP" v-show="dummySelect" :class="{'wiringP':tabState.warningP}">{{tabState.reminder}}</p>
            </div>
            <div v-show="putaway">
              <p>直接上架：
                <el-switch v-model="groundingSelect" on-text="" off-text="">
                </el-switch>
              </p>
              <div class="tuijian">
                <p>推荐商品：
                  <el-switch v-model="recommendSelect" on-text="" off-text="">
                  </el-switch>
                </p>
              </div>
            </div>
          </div>
          <div class="productSub">
            <el-button type="primary" @click="VType(radio2)">确认</el-button>
            <el-button class="off" @click="hideModal">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Menus from '../Menus.vue';
import { createSpec, createSimple, createPart, editSimple, editSpec, editPart } from '../../service/product/product';
@Component({
  props: {
    isClose: Object,
    typeList: Object,
    skuObj: Object,
    flag: Object
  },
  watch: {
    isClose: function (this: any, oldVal, newVal) {
      if (!newVal) {
        this.editdp()
        if (this.flag === 2) {
          this.putaway = false
          this.shopMsgg = '商品编辑'
        } else {
          this.putaway = true
          this.shopMsgg = '新增商品'
          this.recommendSelect = false
          this.dummySelect = false
          this.groundingSelect = true
        }
      }
    },
    radio2: function (this: any, oldVal, newVal) {
      [this.tabState.proName,
      this.tabState.skuState,
      this.tabState.priceState
      ] = [false, false, false]
      if (!this.skuObj.length) {
        this.sku = []
      }
    }
  },
  components: {
    Menus
  },
})
export default class AddProduct extends Vue {
  redioLabe: Array<any> = [{
    label: 1,
    value: '无规格'
  }, {
    label: 2,
    value: '单规格'
  }, {
    label: 3,
    value: '多规格'
  }, {
    label: 4,
    value: '拼盘'
  }];
  pinNum: Array<any> = [{
    label: 2,
    value: '2拼'
  }, {
    label: 3,
    value: '3拼'
  }, {
    label: 4,
    value: '4拼'
  }, {
    label: 5,
    value: '5拼'
  }, {
    label: 6,
    value: '6拼'
  }, {
    label: 7,
    value: '7拼'
  }, {
    label: 8,
    value: '8拼'
  }, {
    label: 9,
    value: '9拼'
  }];
  dynamicTags: Array<any>;
  inputVisible: boolean = false;
  inputValue: string = '';
  sku: Array<any> = [];
  classifyValue: string = '';
  dialogImageUrl: string = '';
  dialogVisible: boolean = false;
  radio2: number = 1;
  value3: boolean = false;
  close: boolean = true;
  tab: boolean = false;
  sizeValue: string = '';
  sizeValue1: string = '';
  sizeValue2: string = '';
  sizeValue3: string = '';
  repeatSelect: boolean = false;
  dummySelect: boolean = false;
  groundingSelect: boolean = true;
  recommendSelect: boolean = false;
  productName: string = '';
  intro: string = '';
  sales_display: any = '';
  put_away: any = '';
  dummy: any = '';
  price: any = '';
  proSize: boolean = false;
  noSize: boolean = true;
  manySize: boolean = false;
  manyPin: boolean = false;
  pinValue: string = '2拼';
  dis: boolean = false;
  imageUrl: string = '';
  price1: string = '';
  ext: any = {};
  category_id: number = 0;
  price_sell: any = '';
  part: Array<any> = [];
  parPrice: any = '';
  part_repeatable: number = 2;
  part_num: number = 2;
  pic_size: number = 0;
  errMsg: string = '';
  errState: boolean = false;
  edited: boolean = true;
  productId: string = '';
  sesstionId: number = 123;
  tabState: any = {
    proName: false,
    skuState: false,
    priceState: false,
    editState: true,
    reminder: '虚拟销量是销量的初始值',
    warningP: false,
    pinTabState: false,
    classifyValue: false,
    waringp: false
  };
  putaway: boolean = true;
  shopMsgg: string = '';
  imgUrl: string = '';
  skuObj: any;
  flag: any;
  typeList: any;
  $message: any;

  created() {
    this.getUrl()
  }

  getUrl() {
    let [baseUrl, urls, protocol] = ['http://10.100.100.78:9090', location.href.toLowerCase(), 'http://']
    if (location.protocol === 'https:') {
      protocol = 'https://'
    }
    if (urls.match(/mch.testopt.snsshop.net/) && (urls.match(/mch.testopt.snsshop.net/) as any)[0] === 'mch.testopt.snsshop.net') {
      baseUrl = protocol + 'mchapi.testopt.snsshop.net'
    }
    if (urls.match(/mch.elebuy.me/) && (urls.match(/mch.elebuy.me/) as any)[0] === 'mch.elebuy.me') {
      baseUrl = protocol + 'mchapi.elebuy.me'
    }
    this.imgUrl = baseUrl + '/product/upload-image'
  }

  editdp() {
    this.putaway = false
    this.edited = false
    if (JSON.stringify(this.skuObj) !== '{}') {
      // 通用参数
      this.put_away = this.skuObj[0].product.put_away
      if (this.put_away === 2) {
        this.groundingSelect = false
      } else {
        this.groundingSelect = true
      }
      this.pic_size = this.skuObj[0].product.pic_size
      if (this.pic_size === 0) {
        this.recommendSelect = false
      } else {
        this.recommendSelect = true
      }
      if (this.skuObj[0].product.sales_display === 1) {
        this.dummySelect = true
      } else {
        this.dummySelect = false
      }
      this.classifyValue = this.skuObj[0].category.name
      this.imageUrl = this.skuObj[0].product.pic
      this.productName = this.skuObj[0].product.name
      this.intro = this.skuObj[0].product.intro
      this.category_id = this.skuObj[0].category.id
      this.productId = this.skuObj[0].product.id
      if (this.skuObj[0].product.sales_dummy === 0) {
        this.dummy = ''
      } else {
        this.dummy = this.skuObj[0].product.sales_dummy
      }
      // 无规格处理
      if (this.skuObj[0].product.sku_type === 1) {
        this.radio2 = 1
        this.price = this.skuObj[0].sku[0].price_sell / 100
        this.intro = this.skuObj[0].product.intro
      } else if (this.skuObj[0].product.sku_type === 2) {
        // 商品编辑时的价格处理
        for (let i = 0; i < this.skuObj[0].sku.length; i++) {
          this.skuObj[0].sku[i].price_sell = this.skuObj[0].sku[i].price_sell / 100
        }
        this.sku = this.skuObj[0].sku
        this.ext = this.skuObj[0].ext
        // 单规格
        if (this.skuObj[0].ext.property.length === 1) {
          this.radio2 = 2
          let temp = ''
          for (let i = 0; i < this.skuObj[0].ext.property[0].items.length; i++) {
            temp = temp + this.skuObj[0].ext.property[0].items[i].name + ','
          }
          this.sizeValue = temp.substring(0, temp.length - 1)
        } else {
          // 多规格
          this.radio2 = 3
          let temp1 = ''
          for (let i = 0; i < this.skuObj[0].ext.property[0].items.length; i++) {
            temp1 = temp1 + this.skuObj[0].ext.property[0].items[i].name + ','
          }
          let temp2 = ''
          for (let i = 0; i < this.skuObj[0].ext.property[1].items.length; i++) {
            temp2 = temp2 + this.skuObj[0].ext.property[1].items[i].name + ','
          }
          this.tab = true
          this.sizeValue1 = temp1
          this.sizeValue2 = temp2
        }
      } else if (this.skuObj[0].product.sku_type === 3) {
        // 多拼
        this.radio2 = 4
        this.dynamicTags = this.skuObj[0].part
        this.pinValue = this.skuObj[0].sku[0].part_num + '拼'
        this.parPrice = this.skuObj[0].sku[0].price_sell / 100
        this.dummy = this.skuObj[0].product.sales_dummy
        this.part = this.skuObj[0].part
        if (this.skuObj[0].sku[0].part_repeatable === 1) {
          this.repeatSelect = true
        } else {
          this.repeatSelect = false
        }
      }
    }
  }

  clearMsg() {
    this.classifyValue = '';
  }

  fetchData(radio2: any) {
    // 虚拟销量
    if (this.dummySelect === true) {
      this.sales_display = 1
    } else {
      this.sales_display = 2
    }
    // 上下架状态
    if (this.groundingSelect === true) {
      this.put_away = 1
    } else {
      this.put_away = 2
    }
    // 是否重复
    if (this.repeatSelect === true) {
      this.part_repeatable = 1
    } else {
      this.part_repeatable = 2
    }
    // 是否推荐
    if (this.recommendSelect === true) {
      this.pic_size = 1
    } else {
      this.pic_size = 0
    }
    // 有规格产品的参数
    let pros = JSON.parse(JSON.stringify(this.sku))
    let argument = {
      id: this.productId,
      name: this.productName,
      category_id: this.category_id,
      pics: [this.imageUrl],
      intro: this.intro,
      sales_display: this.sales_display,
      sales_dummy: (this.dummy - 0),
      put_away: this.put_away,
      pic_size: this.pic_size,
      sku: pros,
      ext: this.ext
    }
    // 发送创建请求时，对产品价格进行处理
    for (let i = 0; i < argument.sku.length; i++) {
      argument.sku[i].price_sell = Math.round(argument.sku[i].price_sell * 100) - 0
    }
    // 无规格产品的参数
    let argument1 = {
      id: this.productId,
      name: this.productName,
      category_id: this.category_id,
      pics: [this.imageUrl],
      intro: this.intro,
      sales_display: this.sales_display,
      sales_dummy: (this.dummy - 0),
      put_away: this.put_away,
      pic_size: this.pic_size,
      sku: [
        {
          price_sell: Math.round(this.price * 100)
        }
      ]
    }
    // 多拼产品参数
    let argument2 = {
      id: this.productId,
      name: this.productName,
      category_id: this.category_id,
      pics: [this.imageUrl],
      intro: this.intro,
      sales_display: this.sales_display,
      sales_dummy: (this.dummy - 0),
      put_away: this.put_away,
      pic_size: this.pic_size,
      sku: [
        {
          price_sell: Math.round(this.parPrice * 100) - 0,
          part_repeatable: this.part_repeatable,
          part_num: this.part_num,
          remark: ''
        }
      ],
      part: this.dynamicTags
    }
    if (!this.skuObj.length) {
      // 新增商品时状态初始化
      this.stateInit()
      if (radio2 === 2) {
        let creatSpec = this.editSpecPrice(argument.sku)
        let repeatS = this.specRepeat(argument.sku)
        if (creatSpec) {
          if (repeatS.repeatS) {
            createSpec(argument).then((data: any) => {
              if (data.code === '0') {
                this.hideModal()
                this.$message({
                  message: '商品添加成功',
                  type: 'success'
                })
                this.fetchData({});
              } else {
                this.$message({
                  message: data.msg,
                  type: 'error'
                })
              }
            })
          } else {
            this.$message({
              message: '商品规格名（' + repeatS.name + '）重复了',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: '请检查规格价格',
            type: 'error'
          })
        }
      } else if (radio2 === 3) {
        // 价格验证
        let creatSpec = this.editSpecPrice(argument.sku)
        // 规格重复验证
        let repeatS = this.specRepeat(argument.sku)
        if (creatSpec) {
          if (repeatS.repeatS) {
            createSpec(argument).then((data: any) => {
              if (data.code === '0') {
                this.hideModal()
                this.$message({
                  message: '商品添加成功',
                  type: 'success'
                })
                this.fetchData({});
              } else {
                this.$message({
                  message: '商品规格名不能重复或价格不能为空',
                  type: 'error'
                })
              }
            })
          } else {
            this.$message({
              message: '商品规格名（' + repeatS.name + '）重复了',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: '请检查规格价格',
            type: 'error'
          })
        }
      } else if (radio2 === 1) {
        let creatSimple = this.editSpecPrice(argument1.sku)
        if (creatSimple) {
          createSimple(argument1).then((data: any) => {
            if (data.code === '0') {
              this.hideModal()
              this.$message({
                message: '商品添加成功',
                type: 'success'
              })
              this.fetchData({});
            }
          })
        } else {
          this.$message({
            message: '请检查价格',
            type: 'error'
          })
        }
      } else if (radio2 === 4) {
        let partPrice = this.editPartPrice(this.parPrice)
        if (partPrice) {
          if (this.dynamicTags.length !== 0) {
            createPart(argument2).then((data: any) => {
              if (data.code === '0') {
                this.hideModal()
                this.$message({
                  message: '商品添加成功',
                  type: 'success'
                })
                this.fetchData({});
              } else {
                this.$message({
                  message: data.msg,
                  type: 'error'
                })
              }
            })
          } else {
            this.$message({
              message: '请添加菜品',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: '请检查产品价格',
            type: 'error'
          })
        }
      }
    } else {
      // 编辑
      this.tabState.editState = true
      if (this.radio2 === 1) {
        let creatSimple = this.editSpecPrice(argument1.sku)
        if (creatSimple) {
          editSimple(argument1).then((data: any) => {
            if (data.code === '0') {
              this.hideModal()
              this.tab = false
              this.$message({
                message: '商品编辑成功',
                type: 'success'
              })
            }
          })
        } else {
          this.$message({
            message: '请检查价格是否正确',
            type: 'error'
          })
        }
      } else if (this.radio2 === 2) {
        this.changePrice()
        let creatSpec = this.editSpecPrice(argument.sku)
        let repeatS = this.specRepeat(argument.sku)
        if (creatSpec) {
          if (repeatS.repeatS) {
            editSpec(argument).then((data: any) => {
              if (data.code === '0') {
                this.hideModal()
                this.tab = false
                this.$message({
                  message: '商品编辑成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: data.msg,
                  type: 'error'
                })
              }
            })
          } else {
            this.$message({
              message: '商品规格名（' + repeatS.name + '）重复了',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: '请检查规格价格',
            type: 'error'
          })
        }
      } else if (this.radio2 === 3) {
        let editSpecPrice = this.editSpecPrice(this.skuObj[0].sku)
        let repeatS = this.specRepeat(argument.sku)
        if (editSpecPrice) {
          if (repeatS.repeatS) {
            editSpec(argument).then((data: any) => {
              if (data.code === '0') {
                this.hideModal()
                this.tab = false
                this.$message({
                  message: '商品编辑成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '商品编辑失败',
                  type: 'error'
                })
              }
            })
          } else {
            this.$message({
              message: '商品规格名（' + repeatS.name + '）重复了',
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: '商品编辑失败',
            type: 'error'
          })
        }
      } else if (this.radio2 === 4) {
        let partPrice = this.editPartPrice(this.parPrice)
        if (partPrice) {
          editPart(argument2).then((data: any) => {
            if (data.code === '0') {
              this.hideModal()
              this.tab = false
              this.$message({
                message: '商品编辑成功',
                type: 'success'
              })
            } else {
              this.tab = false
              this.$message({
                message: data.msg,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '请检查商品价格',
            type: 'error'
          })
        }
      }
    }
  }

  hideModal() {
    this.$emit('hideModal')
    this.clearData()
  }

  handleAvatarSuccess(res: any, file: any) {
    this.imageUrl = res.data[0].url
  }

  erroUpload(err: any, file: any, fileList: any) {
    this.$message({
      message: '图片只支持JPG,PNG格式，并且大小不超过500k',
      type: 'error'
    })
    console.log(err)
  }

  beforeAvatarUpload(file: any) {
    const isJPG = file.type === 'image/png' || 'image/jpeg' || 'image/gif'
    const isLt2M = file.size / 1024 < 500
    if (!isJPG) {
      this.$message.error('图片只能是 PNG或JPG格式!')
    }
    if (!isLt2M) {
      this.$message.error('图片大小不能超过 500k!')
    }
    return isJPG && isLt2M
  }

  addProduct() {
    if (this.sizeValue === '') {
      if (this.sizeValue1 === '' || this.sizeValue2 === '') {
        this.tab = false
        if (this.sizeValue3 === '') {
          this.$message({
            message: '规格不能为空',
            type: 'error'
          })
          this.errMsg = '产品规格不能为空'
        } else {
          [this.tab, this.part, this.sku] = [false, [], []]
          for (let list of this.dynamicTags) {
            if (list !== '' && list !== ' ' && list.length < 11) {
              this.part.push({
                name: list
              })
            } else {
              this.$message({
                message: '菜名不超过10个汉字,请检查规格字数',
                type: 'error'
              })
            }
          }
        }
      } else {
        // 多规格数据结构处理
        this.sku = []
        this.ext = {}
        let str1 = this.sizeValue1.trim().split(/[,，]/)
        let str2 = this.sizeValue2.trim().split(/[,，]/)
        let tempStr1 = []
        let tempStr2 = []
        for (let list of str1) {
          if (list !== '') {
            tempStr1.push(list)
          }
        }
        for (let list of str2) {
          if (list !== '') {
            tempStr2.push(list)
          }
        }
        let extItems1 = []
        let extItems2 = []
        for (let i = 0; i < tempStr2.length; i++) {
          if (tempStr2[i] !== '' && tempStr2[i] !== ' ') {
            extItems2.push({
              name: tempStr2[i]
            })
          }
        }
        if (tempStr1.length < 7 && tempStr2.length < 7) {
          for (let i = 0; i < tempStr1.length; i++) {
            let temp = {}
            if (tempStr1[i] !== '' && tempStr1[i] !== ' ') {
              extItems1.push({
                name: tempStr1[i]
              })
              for (let j = 0; j < tempStr2.length; j++) {
                if (tempStr2[j] !== '' && tempStr2[j] !== ' ') {
                  temp = {
                    price_sell: this.price_sell - 0,
                    property: [
                      {
                        name: '规格一',
                        item: {
                          name: tempStr1[i]
                        }
                      },
                      {
                        name: '规格二',
                        item: {
                          name: tempStr2[j]
                        }
                      }
                    ]
                  }
                  // 拼接好sku中的数据
                  this.sku.push(temp)
                }
              }
            }
          }
          this.ext = {
            property: [
              {
                name: '规格一',
                items: extItems1
              },
              {
                name: '规格二',
                items: extItems2
              }
            ]
          }
          this.tab = true
        } else {
          this.$message({
            message: '规格不能超过6个',
            type: 'error'
          })
          this.tab = false
        }
      }
    } else {
      // 单规格数据结构处理处理
      if (this.flag === 1) {
        this.sku = []
      }
      this.ext = {}
      this.sku = []
      let str = this.sizeValue.trim().split(/[,，]/)
      let tempStr = []
      for (let list of str) {
        if (list !== '') {
          tempStr.push(list)
        }
      }
      // 单规格ext字段中items的数据结构
      let extItems = []
      if (tempStr.length < 7) {
        for (let i = 0; i < tempStr.length; i++) {
          if (tempStr[i] !== '' && tempStr[i] !== ' ' && tempStr[i].length < 11) {
            // 拼接单规格sku的数据结构
            let temp = {
              price_sell: this.price_sell - 0,
              property: [
                {
                  name: '规格一',
                  item: {
                    name: tempStr[i]
                  }
                }
              ]
            }
            // 将拼接好的sku数据添加到单规格product中
            this.sku.push(temp)
            // 将拼接好的数据添加到单规格extItems中
            extItems.push({
              name: tempStr[i]
            })
            this.tab = true
          } else {
            this.$message({
              message: '规格名不超过10个汉字中间使用逗号隔开,请检查规格字数',
              type: 'error'
            })
            this.tab = false
          }
        }
      } else {
        this.$message({
          message: '规格不能超过6个',
          type: 'error'
        })
        this.tab = false
      }
      // this.sizeValue = ''
      // 拼接好的单规格的ext的数据结构
      this.ext = {
        property: [
          {
            name: '规格一',
            items: extItems
          }
        ]
      }
    }
    // 价格处理
  }

  removePin(index: any) {
    // 拼盘菜品删除操作
    this.part.splice(index, 1)
  };

  hand(value: any) {
    if (value === 1) {
      [this.proSize, this.noSize, this.tab, this.manySize, this.manyPin] = [false, true, false, false, false]
    } else if (value === 2) {
      [this.proSize, this.noSize, this.manySize, this.manyPin] = [true, false, false, false]
      if (this.sku.length === 0 || this.sizeValue === '') {
        this.tab = false
      } else {
        this.tab = true
      }
    } else if (value === 3) {
      [this.proSize, this.noSize, this.manySize, this.manyPin] = [false, false, true, false]
      this.sizeValue = ''
      if (this.sku.length === 0) {
        this.tab = false
        this.sizeValue1 = ''
        this.sizeValue2 = ''
      }
    } else {
      [this.proSize, this.noSize, this.manySize, this.manyPin, this.sku] = [false, false, false, true, []]
      if (this.sku.length === 0) {
        this.tab = false
      }
      if (this.part.length === 0 && this.radio2 !== 1) {
        this.tabState.priceState = false
      }
    }
  }

  changed() {
    this.tabState.classifyValue = false
    for (let item of this.typeList) {
      if (this.classifyValue === item.id) {
        this.category_id = item.id
      }
    }
  }

  errChange() {
    this.errState = false
  }

  changePart() {
    // 新增商品
    // 选择拼盘处理
    for (let item of this.pinNum) {
      if (this.pinValue === item.value) {
        this.part_num = item.label
      }
    }
  }

  clearData() {
    // 初始化表单
    [
      this.productName,
      this.classifyValue,
      this.imageUrl,
      this.radio2,
      this.parPrice,
      this.price_sell,
      this.dummy,
      this.intro,
      this.sizeValue,
      this.sizeValue1,
      this.sizeValue2,
      this.sizeValue3,
      this.pinValue,
      this.sku,
      this.ext,
      this.price,
      this.tabState.priceState,
      this.tabState.proName,
      this.part,
      this.putaway,
      this.dynamicTags,
      this.repeatSelect
    ] = ['', '', '', 1, '', '', '', '', '', '', '', '', '2拼', [], {}, '', false, false, [], true, [], false]
  }

  VType(radio2: any) {
    // 新增产品规格校验
    if (this.sku.length === 0 && radio2 !== 1 && radio2 !== 4) {
      this.tabState.skuState = false
    } else {
      this.tabState.skuState = true
    }
    if (this.radio2 !== 1) {
      this.tabState.priceState = false
    }
    if (this.productName.length && this.tabState.skuState && this.classifyValue && this.dummy <= 99999) {
      if (!this.tabState.priceState) {
        if (!this.tabState.warningP || !this.dummySelect) {
          if (!this.dummySelect) {
            this.fetchData(radio2)
          } else {
            if (this.dummy !== 0 && this.dummy !== '') {
              this.fetchData(radio2)
            } else {
              this.$message({
                message: '请检查虚拟销量是否正确填写',
                type: 'error'
              })
            }
          }
        } else {
          this.$message({
            message: '请检查虚拟销量是否正确填写',
            type: 'error'
          })
        }
      } else {
        this.$message({
          message: '请检查价格是否正确填写',
          type: 'error'
        })
      }
    } else {
      this.$message({
        message: '请检查所有字段是否填写正确',
        type: 'error'
      })
      this.changeProName()
      this.changePrice()
    }
  }

  changeProName() {
    // 新增产品名称验证
    if (this.productName.length > 20 || this.productName.length <= 0) {
      this.tabState.proName = true
    } else {
      this.tabState.proName = false
    }
    if (this.classifyValue) {
      this.tabState.classifyValue = false
    } else {
      this.tabState.classifyValue = true
    }
  }

  changePrice() {
    // 无规格价格验证
    let patt1 = new RegExp('^(?!(0{1,4}(((\\.0{0,2})?))$))([1-9]{1}[0-9]{0,5}|0)(\\.[0-9]{1,2})?$')
    if (patt1.test((this.price - 0) as any) || this.radio2 !== 1) {
      this.tabState.priceState = false
    } else {
      this.tabState.priceState = true
    }
  }

  changeSpecPrice(price: any) {
    // 多规格价格修改验证
    let patt1 = new RegExp('^(?!(0{1,4}(((\\.0{0,2})?))$))([1-9]{1}[0-9]{0,5}|0)(\\.[0-9]{1,2})?$')
    let specPrice = patt1.test(price)
    if (!specPrice) {
      this.$message({
        message: '请正确输入价格',
        type: 'error'
      })
    }
  }

  editPartPrice(price: any) {
    // 拼盘价格校验
    let patt1 = new RegExp('^(?!(0{1,4}(((\\.0{0,2})?))$))([1-9]{1}[0-9]{0,5}|0)(\\.[0-9]{1,2})?$')
    let partPrice = patt1.test(price)
    if (!partPrice) {
      return false
    } else {
      return true
    }
  }

  stateInit() {
    // 状态初始化
    [this.dummySelect, this.groundingSelect, this.recommendSelect, this.dummySelect] = [false, true, false, false]
    // 状态校验
    if (!this.groundingSelect) {
      this.recommendSelect = false
    }
  }

  editSpecPrice(skuPrice: any) {
    let patt1 = new RegExp('^(?!(0{1,4}(((\\.0{0,2})?))$))([1-9]{1}[0-9]{0,5}|0)(\\.[0-9]{1,2})?$')
    for (let list of skuPrice) {
      if (!patt1.test(list.price_sell)) {
        return false
      } else {
        return true
      }
    }
  }

  dummyReg() {
    let reg = new RegExp(/^[1-9][0-9]{0,4}$/)
    if (!reg.test(this.dummy) && this.dummy !== '') {
      this.tabState.warningP = true
      this.tabState.reminder = '请输入1-99999之间的整数'
    } else {
      this.tabState.warningP = false
      this.tabState.reminder = '虚拟销量是销量的初始值'
    }
  }

  handleClose(tag: any) {
    this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
  }

  showInput(this: any) {
    this.inputVisible = true
    this.$nextTick(() => {
      this.$refs.saveTagInput.$refs.input.focus()
    })
  }

  handleInputConfirm() {
    let inputValue = this.inputValue
    if (inputValue) {
      this.dynamicTags.push({
        name: inputValue
      })
    }
    this.inputVisible = false
    this.inputValue = ''
  }

  specRepeat(sku: any) {
    // 规格重复验证
    let arr = []
    for (let list of sku) {
      if (list.property.length === 1) {
        arr.push(list.property[0].item.name)
      } else {
        arr.push(list.property[0].item.name + '' + list.property[1].item.name)
      }
    }
    let re = arr.join(',') + ','
    for (let list of arr) {
      if (re.replace(list + ',', '').indexOf(list + ',') > -1) {
        return {
          name: list,
          repeatS: false
        }
      }
    }
    return {
      name: '',
      repeatS: true
    }
  }
}
</script>
<style lang='less' scoped>
input,
textarea {
  font-family: SC!important;
}

.yuan {
  color: #b8b8b8;
  margin-left: 5px;
  font-size: 12px;
}

.wiringP {
  color: #f13e42 !important;
}

.priceWring {
  margin-left: 103px;
  font-size: 12px;
  margin-top: 5px;
  color: #f13e42;
  .el-icon-warning {
    margin-right: 5px;
  }
}

span {
  color: #f13e42;
}

.proName {
  font-size: 12px;
  margin-left: 103px;
  color: #f13e42;
  .el-icon-warning {
    margin-right: 5px;
  }
}

.el-tag {
  background-color: #fff;
  border: 1px solid #f13e42;
  margin-right: 10px;
}

.mark {
  background: #f1f1f3;
  height: calc(100% - 68px);
  margin-left: 200px;
  .title {
    height: 48px;
    text-align: left;
    background: #fff;
    padding-left: 17px;
    line-height: 48px;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
    span {
      border-left: 3px solid #fed034;
      padding-left: 10px;
      color: #000;
    }
  }
}

.addProduct {
  background: #fff;
  margin: 12px;
  height: calc(100% - 94px);
  padding: 0 20px 20px;
  border-radius: 4px;
  .tips {
    background: #f13e42;
    width: 100%;
    height: 50px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .tipsContent {
      margin: auto 20px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      i {
        cursor: pointer
      }
    }
  }
  .productCon {
    padding-top: 10px;
    margin-left: 40px;
    height: calc(100% - 70px);
    .productItem1 {
      height: 40px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      .waring {
        font-size: 12px;
        color: #f13e42;
        margin-left: 10px;
        i {
          margin-right: 5px;
        }
      }
    }
    .productItem2 {
      height: 40px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      width: 490px;
      p {
        width: 127px;
      }
      .el-input {
        margin-left: 3px;
      }
      i {
        margin-left: 12px;
        font-size: 18px;
        color: rgb(0, 182, 66);
      }
    }
    .productItem3 {
      margin-top: 15px;
      display: flex;
      .upImage {
        margin-left: 10px;
      }
      .productUpload {
        margin-left: 14px;
        .avatar-uploader {
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .discr {
          margin-left: -1px;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #20a0ff;
        }
        .avatar-uploader-icon {
          border: 1px dashed #d9d9d9;
          font-size: 28px;
          color: #8c939d;
          width: 95px;
          height: 95px;
          line-height: 95px;
          text-align: center;
        }
        .avatar-uploader-icon::after {
          content: "点击上传图片";
          font-size: 12px;
          display: block;
          line-height: 0px;
          margin-top: -15px;
        }
        .avatar-uploader-icon:hover {
          border-color: #f13e42;
        }
        .avatar {
          width: 95px;
          height: 95px;
          display: block;
        }
        .changeImg {
          height: 30px;
          font-size: 14px;
          background: rgba(0, 0, 0, .5);
          position: absolute;
          margin-top: -30px;
          color: #fff;
          width: 95px;
        }
        p {
          font-size: 12px;
          color: #b8b8b8;
          margin-top: 10px;
        }
      }
    }
    .productItem4 {
      display: flex;
      margin-top: 20px;
      .productSiz {
        margin-left: 12px;
        .el-radio-group {
          label {
            width: 80px;
          }
        }
      }
    }
    .productOneSize {
      margin-top: 20px;
      display: flex;
      align-items: center;
      p {
        width: 91px;
        text-align: right;
      }
      .productSear {
        margin-left: 12px;
        .el-input {
          width: 360px;
        }
      }
      .el-button {
        margin-left: 12px;
        border-color: #f13e42;
        color: #f13e42;
      }
    }
    .productnoSize {
      display: flex;
      align-items: center;
      margin-top: 20px;
      .el-input {
        width: 360px;
        margin-left: 13px;
      }
      p {
        width: 91px;
        text-align: right;
      }
    }
    .productManySize {
      margin-top: 20px;
      .size1 {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        p {
          width: 91px;
          text-align: right;
        }
        .productSear {
          margin-left: 12px;
          width: 360px;
          .el-input {
            width: 100%;
          }
        }
        .el-button {
          margin-left: 12px;
          border-color: #f13e42;
          color: #f13e42;
        }
      }
      .size2 {
        display: flex;
        align-items: center;
        p {
          width: 91px;
          text-align: right;
        }
        .productSear {
          margin-left: 12px;
          width: 360px;
          .el-input {
            width: 100%;
          }
        }
        .el-button {
          margin-left: 12px;
          border-color: #f13e42;
          color: #f13e42;
        }
      }
    }
    .productManyPin {
      .foosItem {
        margin-top: 20px;
        display: flex;
        p {
          width: 92px;
        }
        .productSear {
          width: 400px;
          margin-left: 12px;
          .el-input {
            width: 70px;
          }
        }
      }
      .repeat {
        margin-top: 20px;
        display: flex;
        align-items: center;
        margin-left: 11px;
        .el-switch {
          margin-left: 12px;
        }
      }
      .pintab {
        margin-left: 103px;
        width: 358px;
        max-height: 100px;
        overflow: auto;
        border: 1px solid #dfdfdf;
        table {
          width: 100%;
          font-size: 11px;
          color: #333333;
          border-collapse: collapse;
          th {
            height: 30px;
            width: 90px;
            background-color: #f1f0f2;
            span {
              color: #b8b8b8 !important;
            }
          }
          tr {
            height: 30px;
            border-bottom: 1px solid #dfdfdf;
          }
          td {
            text-align: center;
            background-color: #ffffff;
          }
        }
      }
      .pinpan {
        margin-top: 20px;
        display: flex;
        align-items: center;
        p {
          width: 91px;
          text-align: right;
        }
        .el-select {
          margin-left: 12px;
        }
      }
      .pinpanPrice {
        margin-top: 20px;
        display: flex;
        p {
          width: 91px;
          text-align: right;
        }
        .el-input {
          width: 360px;
          margin-left: 12px;
        }
      }
      .remark {
        margin-top: 20px;
        display: flex;
        p {
          width: 91px;
          text-align: right;
        }
        span {
          margin-left: 9px;
          color: #b8b8b8;
        }
      }
    }
    .productTab {
      margin-left: 103px;
      width: 358px;
      border: 1px solid #dfdfdf;
      .gridtable {
        width: 100%;
        font-size: 11px;
        color: #333333;
        border-collapse: collapse;
        th {
          height: 30px;
          width: 90px;
          background-color: #f1f0f2;
          input {
            width: 50px;
            margin-left: 10px;
            font-size: 10px;
          }
        }
        tr {
          height: 30px;
          border-bottom: 1px solid #dfdfdf;
          input {
            border: 1px solid #dfdfdf;
            text-align: center;
          }
        }
        td {
          text-align: center;
          background-color: #ffffff;
          input {
            width: 50px;
            font-size: 10px;
          }
        }
      }
    }
    .productDis {
      display: flex;
      margin-top: 20px;
      margin-left: 11px;
      div {
        width: 360px;
        margin-left: 6px;
        .el-textarea {
          textarea {
            font-family: SC!important;
          }
        }
      }
    }
    .productCtr {
      margin-top: 10px;
      margin-left: 12px;
      .el-switch {
        margin-left: 7px;
      }
      .dummy {
        display: flex;
        align-items: center;
        .el-input {
          width: 150px;
          margin-top: 20px;
          margin-left: 12px;
        }
        .el-switch {
          margin-left: 7px;
        }
        .el-icon-warning {
          font-size: 12px;
          color: #f13c41;
          margin-left: 12px;
          margin-top: 24px;
          margin-right: 6px;
        }
        .dummyP {
          color: #b8b8b8;
          font-size: 12px;
        }
      }
      p {
        margin-top: 20px;
      }
    }
    .tuijian {
      .el-switch {
        margin-left: 7px;
      }
    }
    .productSub {
      text-align: center;
      margin-top: 15px;
      margin-bottom: 20px;
      .off {
        color: #f13e42;
        border: 1px solid #f13e42;
      }
    }
    .productSel {
      margin-left: 12px;
      .el-select {
        height: 30px;
        .el-option {
          height: 30px;
        }
      }
    }
  }
}
</style>
