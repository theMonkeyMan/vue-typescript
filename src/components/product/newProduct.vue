<template>
    <div>
        <!--<Menus
          :shop-msg="shopMsg"
        ></Menus> -->
        <AddAttr :dialog-obj="dialogObj" @hideAdd="hideAdd" @addFinish="addFinish"></AddAttr>
        <ChooseFoods
          :is-choose-food="isChooseFood"
          :chooseArr = "chooseArr"
          @hideChoosea="hideChoose"
          @transferArr="getTransferArr"></ChooseFoods>
        <div class="productCenter">
            <div class="product-manage"><i></i>商品管理 > 新增商品</div>
            <div class="mark">
              <!--菜品分类-->
              <div class="classIfy">
                <p><span>* </span>选择分类：</p>
                <el-select v-model="tabData.classIfyValue" placeholder="请选择菜品分类" size="small" @change="changed()">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="text" @click="shwoNewClass">新增分类</el-button>
              </div>
              <p class="waring" v-show="prompt.classIfystate"><i class="el-icon-warning"></i>请选择菜品分类</p>

              <!--新增分类-->
              <div class="remark" v-show="status.newclassState">
                <div class="newclassIfy">
                    <div class="tips">
                      <span>新增分类：</span>
                      <i class="el-icon-close" @click="closeNewClass"></i>
                    </div>
                    <div class="newclass">
                        <p>分类名称：</p>
                        <el-input
                          size="small"
                          v-model="tabData.newClassValue"
                          placeholder="请输入分类名称，最多8个汉字">
                        </el-input>
                    </div>
                    <div class="classSubmit">
                        <el-button type="primary" @click="submitNewClass">确认</el-button>
                        <el-button @click="closeNewClass">取消</el-button>
                    </div>
                </div>
              </div>

              <!--菜品名称-->
              <div class="productName">
                  <p><span>* </span>菜品名称：</p>
                  <el-input
                    size="small"
                    placeholder="请输入菜品名称"
                    v-model="tabData.productName"
                    @change="changeProName"
                  >
                  </el-input>
              </div>
              <p class="waring" v-show="prompt.prodectNamstate"><i class="el-icon-warning"></i>请输入菜品名称，不超过20个字</p>

              <!--菜品价格-->
              <div v-show="toggle">
                <div class="productPrice" v-if="status.specState">
                  <div class="price">
                    <p><span>* </span>菜品价格：</p>
                    <el-input
                      size="small"
                      v-model="tabData.productPrice"
                      placeholder="最高9999.99"
                      @blur="verifyPrice(tabData.productPrice)"
                    >
                    </el-input>
                    <el-button  size="small" @click="addFood">+添加规格</el-button>
                  </div>
                  <p class="waring" v-show="prompt.priceState"><i class="el-icon-warning"></i>请输入正确的价格</p>
              </div>
              <!--规格管理-->
              <div class="specMen" v-else>
                  <div class="specMen-1">
                    <p>菜品规格：</p>
                    <div class="specSelect">
                      <el-select v-model="tabData.specValue"
                        @change="changeSpecTab()"
                        placeholder="请选择菜品规格"
                        size="small">
                        <el-option
                          v-for="item in specTabData"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                      <i class="el-icon-close" @click="closeSpec"></i>
                    </div>
                    <span @click="addBtn()">新增规格</span>
                  </div>
                  <!--规格表单-->
                  <div class="tab" v-show="status.specTabState">
                    <el-table
                      :data="specItem"
                      border
                      style="width: 100%">
                      <el-table-column
                        label="规格名称"
                        width="210">
                        <template scope="scope">
                          <span style="margin-left: 10px">{{ scope.row.item_name }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="价格(元)"
                        >
                        <template scope="scope">
                          <el-input
                            size="mini"
                            placeholder="0.00"
                            v-model="scope.row.price_sell"
                            >
                          </el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>

              <!--<div class="addFood">
                  <el-button  size="small">+添加菜品</el-button>
              </div>-->
              <!--旧数据的兼容处理表单-->
              <div class="oldTab" v-show="oldData">
                  <p class="oldName">多规格：</p>
                  <div class="oldSpecName">
                    <div class="closeOld">
                      <i class="el-icon-close" @click="clearOldData"></i>
                    </div>
                    <div class="specOne">
                        <p>{{oldOneSpecName}}：</p>
                        <div>
                            <el-tag 
                            v-for="(list, index) in oldOneSpec.items"
                            :key="list.name"
                            >{{list.name}}</el-tag>
                        </div>
                    </div>
                    <div class="specTwo">
                        <p>{{oldTwoSpecName}}：</p>
                        <div>
                            <el-tag
                            v-for="(list, index) in oldTwoSpec.items"
                            :key="list.name"
                            >{{list.name}}</el-tag>
                        </div>
                    </div>
                    <div class="specTab">
                        <div>
                          <p class="specNmae">规格名</p>
                          <p class="specPrice">价格</p>
                        </div> 
                        <div v-for="list in jointSpec" v-bind:key="list">
                          <p class="specNmae">{{list.name}}</p>
                          <p class="specPrice">{{list.price_sell}}</p>
                        </div>  
                    </div>
                  </div>
              </div>
              <!--菜品属性-->
              <div class="productProperty" v-if="status.propertyState">
                  <p>菜品属性：</p>
                  <el-button size="small" @click="shwoPro">+添加属性</el-button>
              </div>
              <!--属性管理-->
              <div class="repeatPro" v-else>
                  <div class="repeatPro-1" v-for="(list, index) in proArr" v-bind:key="list">
                      <div class="propertyMen" >
                        <div class="propertyMen-1">
                          <p>菜品属性：</p>
                          <div class="propertySelect">
                              <el-select v-model="list.name" placeholder="请选择" size="small" @change="changePro(list.name, index)">
                                <el-option
                                  v-for="item in proTabData"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.name">
                                </el-option>
                              </el-select>
                              <i class="el-icon-close" :index="index" @click="delatePro(index)"></i>
                          </div>
                        </div>
                        <div class="propertyMen-2" v-show="tabData.ProValue">
                            <div class="tag">
                              <el-tag
                                v-for="tag in list.items"
                                :key="tag.name"
                              >
                              {{tag}}
                              </el-tag>
                            </div>
                        </div>
                        <div class="setProperty">
                            <el-checkbox v-model="list.is_require" @change="test">属性必选</el-checkbox>
                            <el-checkbox v-model="list.is_multi">属性可多选</el-checkbox>
                        </div>
                      </div>
                  </div>
                  <div class="addPro">
                      <el-button size="small" @click="repeatPro">+添加属性</el-button>
                  </div>
              </div>
              <!--菜品库存-->
              <div class="stockFood">
                  <p>菜品库存：</p>
                  <div class="showStock">
                    <el-checkbox v-model="tabData.stock_daily_on">设置库存</el-checkbox>
                    <el-input
                      v-show="tabData.stock_daily_on"
                      v-model="tabData.stock"
                      size="mini"
                      placeholder="0-9999"
                      @blur="dummyReg(tabData.stock)"
                      >
                    </el-input>
                    <span v-show="!tabData.stock_daily_on">不设置库存时，则商品无库存上限</span>
                  </div>
                  <div class="dayStockState" v-show="tabData.stock_daily_on">
                      <el-checkbox v-model="status.dayStockState">每日更新库存</el-checkbox>
                      <el-tooltip class="item"
                        effect="light"
                        content="如设置库存为100，则每日营业时自动恢复为100。"
                        placement="right">
                        <i class="hint"></i>
                      </el-tooltip>
                  </div>
              </div>
              <p class="waring" v-show="prompt.stockState"><i class="el-icon-warning"></i>请输入正确的库存数量</p>
              <!--菜品描述-->
              <div class="productDis">
                  <p>菜品描述：</p>
                  <div>
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        :maxlength="50"
                        resize="none"
                        icon="edit"
                        v-model="info"
                        placeholder="菜品描述，长度不超过50个汉字">
                      </el-input>
                  </div>
              </div>

              <!--上传图片-->
              <div class="productItem3">
                  <div class="upImage">
                    <p>商品图片：</p>
                  </div>
                  <div class="productUpload">
                  <el-upload
                      class="avatar-uploader"
                      enctype="multipart/form-data"
                      :with-credentials = "true"
                      :action="imgUrl"
                      :show-file-list="false"
                      :auto-upload="true"
                      :on-success="handleAvatarSuccess"
                      :on-error="erroUpload"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="imageUrl" :src="imageUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <p v-if="imageUrl" class="changeImg">点击更换</p>
                    </el-upload>
                    <p class="discr">图片尺寸建议为640X640，支持jpg、png两种图片格式，大小不超过500k</p>
                  </div>
              </div>

              <!--直接上架————推荐商品-->
             <div class="operation">
                <p>直接上架：</p>
                <el-checkbox v-model="tabData.put_away">直接上架</el-checkbox>
                <div>
                  <el-checkbox v-model="tabData.pic_size" v-show="tabData.put_away">推荐商品</el-checkbox>
                </div>
              </div>

              <!--高级设置-->
              <div class="advancedSetup" @click="showChooseFood">
                <div>
                    <p>高级设置：</p>
                    <i class="el-icon-caret-bottom"></i>
                </div>
              </div>

              <!--高级设置__选加商品-->
              <div class="chooseFood" v-show="status.advancedSetup">
                  <div class="chooseAdd" v-show="status.appendageTab">
                      <p>选加商品：</p>
                      <!--选加商品表单-->
                      <div>
                        <div class="tab">
                          <el-table
                            :data="chooseArr"
                            style="width: 100%">
                            <el-table-column
                              label="规格名称"
                              width="115">
                              <template scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.name }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column
                              label="价格(元)"
                              width="115">
                              <template scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.price_sell }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column
                              label="库存"
                              width="115">
                              <template scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.stock }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column label="操作">
                              <template scope="scope">
                                <el-button type="text" @click="delateArr(scope)">删除</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                          <div class="append">
                            <el-checkbox
                              @change="changeRequire" 
                              v-model="tabData.is_require">可重复选择</el-checkbox>
                            <el-checkbox
                              @chenge="changeMulti" 
                              v-model="tabData.is_multi" 
                              v-show="tabData.is_require">固定选择数量</el-checkbox>
                            <el-input 
                              v-show="tabData.is_multi" 
                              size="small" 
                              placeholder="请输入加量商品数量" 
                              v-model="tabData.proNum"
                              @blur="repeatNum"></el-input>
                          </div>
                        </div>
                      </div>
                  </div>
                  <!--添加非单买商品-->
                  <div class="addSilme">
                      <p v-show="!status.appendageTab">选加商品：</p>
                      <p v-show="status.appendageTab" class=" placeholder"></p>
                      <el-button @click="addSimple">+添加非单买商品</el-button>
                      <el-tooltip class="item"
                          effect="light"
                          content="用户选主菜后可选择另加一些小菜、饮料等，价格另加。"
                          placement="right">
                          <i class="hint"></i>
                      </el-tooltip>
                  </div>
                  <!--虚拟销量-->
                  <div class="dummyNum">
                      <p>虚拟销量：</p>
                      <el-checkbox v-model="tabData.sales_dummy_on">显示虚拟销量</el-checkbox>
                      <el-input
                        v-show = "tabData.sales_dummy_on"
                        v-model="tabData.sales_dummy"
                        size="small"
                        placeholder="1 — 99999">
                      </el-input>
                      <el-tooltip class="item"
                        effect="light"
                        content="填写后用户看到的商品销量为：虚拟销量+实际销量。"
                        placement="right">
                        <i class="hint"></i>
                      </el-tooltip>
                  </div>
              </div>

              <!--保存商品-->
              <div class="saveFood">
                  <el-button type="primary" @click="successTab">完成</el-button>
                  <el-button class="next" @click="oneMoreTab" v-show = "editState">完成继续添加下一个</el-button>
              </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue';
import Component from 'vue-class-component';
  import Menus from '../Menus.vue';
  import Pic from '../pic/pic.vue';
  import AddAttr from './property/addAttr.vue';
  import ChooseFoods from './property/chooseFood.vue';
  import { searchProductSpec, searchProductAttr } from '../../service/product/property';
  import { fetchTypeList, createClassify, fetchDetail, createProduct, editProduct } from '../../service/product/product';
  @Component({
    props:{

    },
    components: {
      Menus,
      AddAttr,
      ChooseFoods,
      Pic
    },
  })
  export default class NewProduct extends Vue {
    typeList:Array<any>= []; // 分类列表
        sku:Array<any>= []; // 规格列表
        ext:any= {}; // 扩展数据
        ext_item:Array<any>= [];
        tags:Array<any>= []; // 属性关联数据
        isShowAdd:boolean= false; // 新增规格弹窗
        menu:string= '1';
        imgUrl:string= ''; // 图片上传的url
        imageUrl:string= ''; // 服务器返回的图片url
        proArr:Array<any>= []; // 属性数组
        chooseArr:Array<any>= []; // 选加商品数据
        appendage_id:Array<any>= []; // 选加商品id列表
        appendage:any= {}; // 选加商品对象
        info:string= ''; // 菜品描述
        category_id:string= ''; // 分类Id
        specTabData_id:string= ''; // 规格id
        specTabData_name:string= ''; // 规格名称
        status:any= { // 表单的各种状态
          specState: true, // 显示规格的状态
          propertyState: true, // 显示高级设置的表单
          advancedSetup: false,
          flag: true, // 高级设置表单切换状态
          dayStockState: false, // 每日库存
          specTabState: false, // 规格表单的状态
          newclassState: false, // 新增分类弹窗状态
          appendageTab: false
        };
        tabData:any= { // 表单数据管理
          imgUrl: '',
          productName: '', // 菜品名称
          classIfyValue: '', // 菜品分类的默认值
          specValue: '', // 菜品规格默认值
          ProValue: '', // 属性默认值
          newClassValue: '', // 新增分类的数据
          productPrice: '', // 价格
          sales_dummy: '', // 虚拟销量
          stock_on: 0, // 是否设置库存
          stock: '', // 商品库存
          sales_dummy_on: false, // 是否开启虚拟销量
          stock_daily_on: false, // 是否每日重置库存
          put_away: false, // 是否直接上架
          pic_size: false, // 推荐商品
          productId: '', // 商品Id
          proNum: '', // 选加商品数量
          is_require: false, // 是否必选 【1：是；2：否】
          is_multi: false, // 是否多选 【1：是；2：否】
          returnMsg: {} // 商品参数验证返回的数据
        };
        specTabData:Array<any>= []; // 规格表单数据
        specItem:Array<any>= []; // 规格关联的表单数据
        proTabData:Array<any>= []; // 属性列表数据
        proItem:Array<any>= []; // 属性列表关联数据
        heightTab:Array<any> []; // 高级表单数据
        prompt:any= { // 提示语状态管理
          classIfystate: false, // 分类提示语的状态
          prodectNamstate: false, // 菜品名称的提示语
          priceState: false, // 菜品价格提示语
          stockState: false, // 库存提示语状态
          chooseArrState: false // 选加商品表单状态
        }
        isChooseFood:boolean=false; // 选加商品组件状态
        dialogObj:any= {
          isShowAdd: false,
          itemObj: {
            items: []
          },
          type: '1',
          isEdit: false
        };
        editState:boolean= true; // 编辑时完成添加下一个按钮状态
        oldData:boolean= false; // 老数据，多规格表单的状态
        toggle:boolean= true; // 新旧数据切换
        oldOneSpec:Array<any>= []; // 老数据规格一
        oldTwoSpec:Array<any>= []; // 老数据规格二
        oldOneSpecName:string= ''; // 老数据规格一名称
        oldTwoSpecName:string= ''; // 老数据规格二名称
        jointSpec:Array<any>= []; // 老数据规格拼接展示
        productId:any;
        attrs:any;
        $message:any;

    created () {
      this.fetchType()
      this.getSpec()
      this.getAttr()
      this.productId = this.$route.query.id
      if (this.productId) {
        this.editProduct()
        this.editState = false
      }
      this.getUrl();
    }

      getUrl () {
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

      fetchType () {
        // 商品分类数据
        fetchTypeList({}).then((data:any) => {
          if (data.data) {
            this.typeList = data.data[0]
          }
        })
      }

      addFood () {
        // 添加规格
        this.status.specState = false
      }

      closeSpec () {
        // 关闭规格
        this.status.specState = true
      }

      // 新增规格/属性
      addBtn () {
        this.dialogObj.isShowAdd = true
      }

      hideAdd () {
        // 隐藏新增规格弹窗
        this.dataReset()
      }

      addSimple () {
        // 添加非单买商品
        this.isChooseFood = true
      }

      getTransferArr (msg:any) {
        // 选择非单买商品
        // this.chooseArr = msg
        this.chooseArr = JSON.parse(JSON.stringify(msg))
        if (this.chooseArr.length === 0) {
          this.prompt.chooseArrState = false
        } else {
          this.prompt.chooseArrState = true
        }
        console.log(1, msg)
        if (this.chooseArr.length === 0) {
          this.status.appendageTab = false
        } else {
          this.status.appendageTab = true
        }
      }

      delateArr (scope:any) {
        // 删除非单买商品
        this.chooseArr.splice(scope.$index, 1)
        if (this.chooseArr.length === 0) {
          [
            this.prompt.chooseArrState,
            this.status.appendageTab,
            this.tabData.is_require,
            this.tabData.is_multi,
            this.tabData.proNum
          ] = [false, false, false, false, '']
          // this.prompt.chooseArrState = false
          // this.status.appendageTab = false
          // this.tabData.is_require = false
          // this.tabData.is_multi = false
          // this.tabData.proNum = ''
        } else {
          this.prompt.chooseArrState = true
          this.status.appendageTab = true
        }
        // console.log(this.chooseArr)
      }

      addFinish () {
        // 新增/编辑完成
        this.dataReset()
        if (this.menu === '1') {
          this.getSpec()
        } else {
          this.getAttr()
        }
      }

      getSpec () {
        // 获取规格列表
        searchProductSpec({
          show_product_num: 1
        }).then((data:any) => {
          this.specTabData = data.data[0].list
          // console.log(data.data[0].list)
        })
      }

      getAttr () {
        // 获取属性列表
        searchProductAttr({
          show_product_num: 1
        }).then((data:any) => {
          this.proTabData = data.data[0].list
        })
      }

      // 新增规格数据初始化
      dataReset () {
        this.dialogObj.itemObj = {items: []}
        this.dialogObj.isShowAdd = false
      }

      shwoPro () {
        // 添加属性
        // console.log(this.proTabData)
        if (this.proTabData.length !== 0) {
          this.status.propertyState = false
          this.tabData.ProValue = this.proTabData[0].name
          this.tags = this.proTabData[0].items
          this.proArr.push({
            attr_id: this.proTabData[0].id,
            name: this.proTabData[0].name,
            items: this.proTabData[0].items,
            is_require: false,
            is_multi: false
          })
        } else {
          this.$message({
            message: '无可添加属性，请先前往属性及规格中添加属性'
          })
        }
      }

      test () {
        console.log(this.proArr)
      }

      repeatPro () {
        // 重复添加属性
        if (this.proArr.length < this.proTabData.length) {
          this.proArr.push({
            attr_id: this.proTabData[0].id,
            name: this.proTabData[0].name,
            items: this.proTabData[0].items,
            is_require: false,
            is_multi: false
          })
        } else {
          alert('已经没有可添加的属性')
        }
        // console.log(this.proArr)
      }

      delatePro (index:any) {
        // 删除属性
        this.proArr.splice(index, 1)
        if (this.proArr.length === 0) {
          this.status.propertyState = true
        }
      }

      changePro (value:any, index:any) {
        // 属性的表单的显示与隐藏
        // console.log(index)
        // for (let i = 0; i < this.proTabData)
        for (let list of this.proTabData) {
          if (value === list.name) {
            this.proArr[index].items = list.items
            this.proArr[index].attr_id = list.id
            this.proArr[index].name = list.name
          }
        }
      }

      changeSpecTab () {
        // 规格表单的显示与隐藏
        if (this.tabData.specValue !== '') {
          this.status.specTabState = true
        } else {
          this.status.specTabState = false
        }
        // console.log(this.tabData.specValue)
        // 规格关联数据
        // console.log(this.specTabData)
        for (let list of this.specTabData) {
          if (this.tabData.specValue === list.id) {
            this.specItem = list.items
            // console.log(list)
            this.specTabData_id = list.id
            this.specTabData_name = list.name
          }
        }
        for (let list of this.specItem) {
          list.price_sell = ''
        }
        // console.log(this.specItem)
      }

      hideChoose () {
        // 选加商品组件的状态控制
        this.isChooseFood = false
      }

      closeNewClass () {
        // 新增分类弹窗显示与隐藏
        this.status.newclassState = false
        this.tabData.newClassValue = ''
      }

      shwoNewClass () {
        // 显示添加新增分类页面
        this.status.newclassState = true
      }

      submitNewClass () {
        // 新增分类
        // 将新增的分类默认为选中状态
        this.tabData.classIfyValue = this.tabData.newClassValue
        if (this.tabData.newClassValue.length <= 8) {
          createClassify({
            name: this.tabData.newClassValue
          }).then((data:any) => {
            if (data.code === '0') {
              this.category_id = data.data[0].id
              this.fetchType()
              this.$message({
                message: '新增分类成功',
                type: 'success'
              })
              this.status.newclassState = false
            } else {
              this.$message({
                message: data.msg,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '分类名称不能超过8个汉字',
            type: 'error'
          })
        }
        this.tabData.newClassValue = ''
      }

      showChooseFood () {
        // 显示高级设置的表单
        if (this.status.flag) {
          this.status.advancedSetup = true
          this.status.flag = false
          if (this.proArr.length === 0) {
            this.prompt.chooseArrState = false
          } else {
            this.prompt.chooseArrState = true
          }
        } else {
          this.status.advancedSetup = false
          this.status.flag = true
        }
      }

      handleClose (tag:any) {
        // 删除属性中标签
        this.tags.splice(this.tags.indexOf(tag), 1)
      }

      handleAvatarSuccess (res:any, file:any) {
        // 图片上传成功后的回调
        this.imageUrl = res.data[0].url
      }

      beforeAvatarUpload (file:any) {
        // 图片上传之前的回调
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

      erroUpload (err:any, file:any, fileList:any) {
        // 图片上传失败的回调
        this.$message({
          message: '图片只支持JPG,PNG格式，并且大小不超过500k',
          type: 'error'
        })
        console.log(err)
      }

      changed () {
        // 分类验证
        this.prompt.classIfystate = false
        for (let list of this.typeList) {
          if (this.tabData.classIfyValue === list.id) {
            this.category_id = list.id
          }
        }
        // console.log(this.category_id)
      }

      changeProName () {
        // 菜品名称验证
        if (this.tabData.productName.length > 20) {
          this.prompt.prodectNamstate = true
        } else {
          this.prompt.prodectNamstate = false
        }
      }

      verifyPrice (price:any) {
        // 价格验证
        let patt1 = new RegExp('^(?!(0{1,4}(((\\.0{0,2})?))$))([1-9]{1}[0-9]{0,5}|0)(\\.[0-9]{1,2})?$')
        let specPrice = patt1.test(price)
        if (!specPrice) {
          this.prompt.priceState = true
          return false
        } else {
          this.prompt.priceState = false
          return true
        }
      }

      dummyReg () {
        // 库存和销量的验证
        let reg = new RegExp(/^[1-9][0-9]{0,4}$/)
        console.log(reg.test(this.tabData.stock))
        if (!reg.test(this.tabData.stock)) {
          this.prompt.stockState = true
          return false
        } else {
          this.prompt.stockState = false
          return true
        }
      }

      editData (data:any) {
        // 编辑商品时的数据处理
        console.log(data)
        // 通用参数处理
        if (data.product.sku_type === 2) {
          if (data.ext.property.length === 2) {
            this.oldData = true
            this.oldOneSpec = data.ext.property[0]
            this.oldTwoSpec = data.ext.property[1]
            this.oldOneSpecName = data.ext.property[0].name
            this.oldTwoSpecName = data.ext.property[1].name
            for (let list of data.sku) {
              this.jointSpec.push({
                name: list.property[0].item.name + list.property[1].item.name,
                price_sell: list.price_sell / 100
              })
            }
            console.log(this.jointSpec)
            this.toggle = false
          } else {
            this.status.specState = false
            this.status.specTabState = true
            this.tabData.specValue = data.sku[0].property[0].id
            for (let list of data.sku) {
              this.specItem.push({
                price_sell: list.price_sell / 100,
                item_id: list.property[0].item.id,
                item_name: list.property[0].item.name
              })
            }
          }
        } else {
          this.tabData.productPrice = data.sku[0].price_sell / 100
        }
        this.category_id = data.category.id
        this.tabData.classIfyValue = data.category.name
        this.tabData.productName = data.product.name
        this.info = data.product.intro
        this.imageUrl = data.product.pic
        this.specTabData_id = data.ext.property === null ? '' : data.ext.property[0].id
        this.specTabData_name = data.ext.property === null ? '' : data.ext.property[0].name
        // 上下架状态
        if (data.product.put_away === 1) {
          this.tabData.put_away = true
        } else {
          this.tabData.put_away = false
        }
        // 推荐状态
        if (data.product.pic_size === 1) {
          this.tabData.pic_size = true
        } else {
          this.tabData.pic_size = false
        }
        // 虚拟销量显示状态
        if (data.product.sales_display === 1) {
          this.tabData.sales_dummy_on = true
          this.tabData.sales_dummy = data.product.sales_dummy === 0 ? '' : data.product.sales_dummy
        } else {
          this.tabData.sales_dummy_on = false
        }
        // 属性参数处理
        if (data.attr) {
          for (let list of data.attr) {
            if (list.is_multi === 1) {
              list.is_multi = true
            } else {
              list.is_multi = false
            }
            if (list.is_require === 1) {
              list.is_require = true
            } else {
              list.is_require = false
            }
            // console.log(list)
          }
          this.proArr = data.attr
          this.status.propertyState = false
          this.tabData.ProValue = true
        }
        // console.log(this.proArr)
        // 库存处理
        if (data.product.stock_daily_on === 1) {
          this.tabData.stock_daily_on = true
          this.status.dayStockState = true
          this.tabData.stock = data.product.stock
        } else {
          this.tabData.stock_daily_on = false
          this.status.dayStockState = false
        }
        this.tabData.stock = data.product.stock === 0 ? '' : data.product.stock
        // 高级设置
        if (data.appendage.appendage) {
          this.status.advancedSetup = true
          this.status.appendageTab = true
          this.chooseArr = data.appendage.appendage
        }
        // 重复选择
        if (data.appendage.is_multi === 1) {
          this.tabData.is_multi = true
        } else {
          this.tabData.is_multi = false
        }
        // 必选
        if (data.appendage.is_require === 1) {
          this.tabData.is_require = true
        } else {
          this.tabData.is_require = false
        }
        // 重复选择数量
        this.tabData.proNum = data.appendage.num_min === 0 ? '' : data.appendage.num_min
      }

      editProduct () {
        // 编辑时获取编辑商品详情
        // console.log(this.productId)
        if (this.productId) {
          fetchDetail({
            id: this.productId
          }).then((data:any) => {
            if (data.code === '0') {
              this.editData(data.data[0])
            }
          })
        }
      }

      jointData () {
        // 拼接表单数据
        // 拼接规格数据sku
        // console.log(this.proArr)
        if (!this.status.specState) {
          for (let list of this.specItem) {
            this.sku.push({
              price_sell: Math.round(list.price_sell * 100) - 0,
              property: [{
                id: this.specTabData_id,
                name: this.specTabData_name,
                item: {
                  id: list.item_id,
                  name: list.item_name
                }
              }]
            })
          }
        } else {
          this.sku.push({
            price_sell: Math.round(this.tabData.productPrice * 100) - 0
          })
        }
        // 处理specItem中的数据
        for (let list of this.specItem) {
          this.ext_item.push({
            id: list.item_id,
            name: list.item_name
          })
        }
        // 拼接ext数据
        this.ext = {
          property: [{
            id: this.specTabData_id,
            name: this.specTabData_name,
            items: this.ext_item
          }]
        }
        // 属性数据拼接
        for (let list of this.chooseArr) {
          this.appendage_id.push(list.id)
        }
        // console.log(this.appendage_id)
        this.appendage = this.appendage_id.length === 0 ? {} : {
          ids: this.appendage_id,
          is_require: this.tabData.is_require === true ? 1 : 2,
          is_multi: this.tabData.is_multi === true ? 1 : 2,
          num: this.tabData.is_multi ? this.tabData.proNum - 0 : 0
        }
        // console.log(this.appendage)
        for (let list of this.proArr) {
          // list.is_multi = list.is_multi === true ? 1 : 2
          // list.is_require = list.is_require === true ? 1 : 2
          if (list.is_multi === true) {
            list.is_multi = 1
          } else {
            list.is_multi = 2
          }
          if (list.is_require === true) {
            list.is_require = 1
          } else {
            list.is_require = 2
          }
          console.log(list)
        }
        console.log(this.proArr)
        this.attrs = this.proArr
        let argument = {
          name: this.tabData.productName,
          category_id: this.category_id,
          pics: this.imageUrl ? [this.imageUrl] : [],
          infro: this.info,
          sales_dummy_on: this.tabData.sales_dummy_on === false ? 2 : 1,
          sales_dummy: this.tabData.sales_dummy - 0,
          stock: this.tabData.stock - 0,
          stock_daily_on: this.tabData.stock_daily_on === false ? 2 : 1,
          put_away: this.tabData.put_away === false ? 2 : 1,
          pic_size: this.tabData.pic_size === false ? 0 : 1,
          stock_on: this.tabData.stock_daily_on ? 1 : 2,
          sku_type: this.status.specState ? 1 : 2,
          attrs: this.proArr.length === 0 ? [] : this.attrs,
          appendage: this.appendage_id.length === 0 ? {} : this.appendage,
          sku: this.sku,
          ext: this.status.specState ? {} : this.ext,
          id: this.productId
        }
        return argument
      }
      
      changeRequire () {
        // 加料商品必选处理
        if (!this.tabData.is_require) {
          this.tabData.is_multi = false
          this.tabData.proNum = ''
        }
      }

      changeMulti () {
        // 加料商品选择数量设置处理
        if (!this.tabData.is_multi) {
          this.tabData.proNum = ''
        }
      }

      repeatNum () {
        // 高级设置，重复的加量商品数量验证
        let re = /^[1-9]+$/
        if (!re.test(this.tabData.proNum)) {
          this.tabData.proNum = ''
          this.$message({
            message: '加料商品的数量只能为整数'
          })
        }
      }

      verifyArgument () {
        // 发送请求之前的参数校验
        if (this.tabData.classIfyValue === '') {
          this.prompt.classIfystate = true
          this.tabData.returnMsg = {state: false, id: '请输入类名'}
          this.proArrS()
        } else if (this.tabData.productName === '') {
          this.prompt.prodectNamstate = true
          this.tabData.returnMsg = {state: false, id: '请输入菜品名称'}
          this.proArrS()
        } else if (!this.verifyPrice(this.tabData.productPrice) && this.status.specState) {
          this.tabData.returnMsg = {state: this.verifyPrice(this.tabData.productPrice), id: '请检查价格是否正确'}
          this.proArrS()
        } else if (!this.status.specState) {
          // alert(1)
          for (let list of this.sku) {
            if (!this.verifyPrice(list.price_sell)) {
              this.tabData.returnMsg = {state: false, id: '请检查价格是否正确'}
              this.proArrS()
            } else {
              this.tabData.returnMsg = {state: true}
              // this.proArrS()
            }
          }
          if (this.tabData.stock_daily_on) {
            this.tabData.returnMsg = {
            // state: this.dummyReg(this.tabData.stock),              
              state: this.dummyReg(),
               id: '请输入正确的库存数量'
               }
            // this.proArrS()
          }
        } else {
          this.tabData.returnMsg = {state: true}
        }
        if (this.tabData.stock_daily_on) {
          this.tabData.returnMsg = {
            // state: this.dummyReg(this.tabData.stock),
            state: this.dummyReg(),
             id: '请输入正确的库存数量'
             }
          // this.proArrS()
        }
        if (this.tabData.specValue === '' && !this.status.specState) {
          this.tabData.returnMsg = {state: false, id: '请选择规格分类'}
          // this.proArrS()
        }
      }

      successTab (falg:any) {
        // 完成当前表单
        let argument = this.jointData()
        this.verifyArgument()
        let pass = this.tabData.returnMsg.state
        if (pass) {
          if (!this.productId) {
            createProduct(argument).then((data:any) => {
              if (data.code === '0') {
                [this.sku, this.ext] = [[], {}]
                this.$message({
                  message: '添加商品成功',
                  type: 'success'
                })
                if (!falg.suc) {
                  this.$router.push({name: 'product'})
                }
                // this.initTab()
              } else {
                this.$message({
                  message: data.msg,
                  type: 'error'
                })
              }
            })
          } else {
            editProduct(argument).then((data:any) => {
              if (data.code === '0') {
                this.$message({
                  message: '编辑商品成功',
                  type: 'success'
                })
                if (!falg.suc) {
                  this.$router.push({name: 'product'})
                }
              } else {
                [this.sku, this.ext, this.ext_item, this.appendage_id] = [[], {}, [], []]
                this.$message({
                  message: '编辑商品失败',
                  type: 'error'
                })
              }
            })
          }
        } else {
          [this.sku, this.ext, this.ext_item, this.appendage_id] = [[], {}, [], []]
          // this.sku = []
          this.$message({
            message: this.tabData.returnMsg.id,
            type: 'error'
          })
        }
      }

      proArrS () {
        for (let list of this.proArr) {
          if (list.is_multi === 1) {
            list.is_multi = true
          } else {
            list.is_multi = false
          }
          if (list.is_require === 1) {
            list.is_require = true
          } else {
            list.is_require = false
          }
        }
      }

      oneMoreTab () {
        // 完成当前表单，并进行新增下一个菜品操作
        if (!this.productId) {
          this.successTab({suc: true})
          this.initTab()
        }
      }

      initTab () {
        // 表单初始化
        // 初始化表单状态
        [this.status, this.tabData, this.prompt, this.proArr, this.chooseArr, this.info, this.imageUrl] = [{
          specState: true,
          propertyState: true,
          advancedSetup: false,
          flag: true,
          stockState: false,
          dayStockState: false,
          specTabState: false,
          newclassState: false
        }, {
          imgUrl: '',
          productName: '',
          classIfyValue: '',
          specValue: '',
          ProValue: '',
          newClassValue: '',
          productPrice: ''
        }, {
          classIfystate: false,
          prodectNamstate: false,
          priceState: false
        }, [], [], '', '']
      }
      
      clearOldData () {
        // 老数据，多规格处理
        this.oldData = false
        this.toggle = true
        this.sku = []
        this.ext = {}
      }
  }
</script>
<style lang='less' scoped>
  .waring{
    margin-top:5px;
    margin-left:110px;
    font-size:14px;
    color:#f13c41;
    i{
      margin-right:5px;
    }
  }
  .remark{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 1000;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.3);
    display: flex;
    justify-content: center;
    align-items: center;
    .newclassIfy{
      width:385px;
      height:254px;
      background:#fff;
      border-radius: 10px;
      .tips{
        width:100%;
        height:40px;
        background:#f13e42;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          margin-left:20px;
          color:#fff;
        }
        .el-icon-close{
          margin-right:20px;
          color:#fff;
        }
      }
      .newclass{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top:60px;
        .el-input{
          width:200px;
        }
      }
      .classSubmit{
        display: flex;
        justify-content: center;
        margin-top:50px;
        .el-button{
          width:100px;
        }
      }
    }
  }
  .productCenter{
    background: #f1f1f3;
    margin-left: 200px;
    clear: both;
    color: #333;
    padding-bottom: 1px;
    padding-top: 68px;
    .product-manage{
      height: 48px;
      text-align: left;
      background: #fff;
      padding-left: 17px;
      line-height: 48px;
      border-bottom: 1px solid #ddd;
      border-left: 1px solid #ddd;
      i{
        border-left: 3px solid #fed034;
        padding-right:15px;
      }
    }
    .mark{
      margin: 12px;
      background: #fff;
      border-radius: 4px;
      padding-left:30px;
      padding-top:20px;
      padding-bottom:20px;
      .classIfy{
        display:flex;
        align-items: center;
        .el-select{
          margin-right:20px;
        }
        p{
          width:100px;
          text-align:right;
          margin-right:10px;
          span{
            color:#f13c41;
          }
        }
        .el-button{
          color:#7aabff;
        }
        .flush{
          font-size:13px;
          color:#7aabff;
          margin-left:10px;
          padding-left:10px;
          border-left:1px solid #7aabff;
        }
      }
      .oldTab{
        margin-top:20px;
        display:flex;
        .oldName{
          width:100px;
          text-align: right;
        }
        .oldSpecName{
          padding-bottom:15px;
          margin-left:10px;
          width:419px;
          border: 1px solid rgb(217, 193, 191);
          .closeOld{
            display:flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom:15px;
            background:#f1f0f2;
            height:40px;
            .el-icon-close{
              margin-right:10px;
              color:#999999;
            }
          }
          .specOne{
            display:flex;
            p{
              margin-left:20px;
              text-align: right;
              width:80px;
            }
            div{
              .el-tag{
                margin-left:10px;
              }
            }
          }
          .specTwo{
            display:flex;
            margin-top:15px;
            p{
              margin-left:20px;
              text-align: right;
              width:80px;
            }
            div{
              .el-tag{
                margin-left:10px;
              }
            }
          }
          .specTab{
              border-top: 1px solid rgb(217, 193, 191);
              margin-left:20px;
              width:372px;
              margin-top:15px;
              padding-bottom:15px;
            div{
              display:flex;
              align-items: center;
              justify-content: space-between;
              margin-top:10px;
              border-bottom: 1px solid rgb(217, 193, 191);
              .specNmae{
                margin-left:50px;
              }
              .specPrice{
                margin-right:50px;
              }
            }
          }
        }
      }
      .productName{
        display:flex;
        margin-top:20px;
        p{
          width:100px;
          text-align:right;
          margin-right:10px;
          span{
            color:#f13c41;
          }
        }
        .el-input{
          width:420px;
        }
      }
      .productPrice{
        margin-top:20px;
        .price{
          display:flex;
          p{
            width:100px;
            text-align:right;
            margin-right:10px;
            span{
              color:#f13c41;
            }
          }
          .el-input{
            width:420px;
          }
          .el-button{
            margin-left:20px;
          }
        }
      }
      .specMen{
        .specMen-1{
          display:flex;
          margin-top:20px;
          span{
            font-size:14px;
            color:#7aabff;
            cursor: pointer;
            line-height:40px;
          }
          p{
            width:100px;
            text-align:right;
            margin-right:10px;
            span{
              color:#f13c41;
            }
          }
          .specSelect{
            width:420px;
            background:#f1f0f2;
            height:40px;
            display:flex;
            align-items: center;
            justify-content: space-between;
            margin-right:20px;
            .el-select{
              margin-left:10px;
            }
            .el-icon-close{
              margin-right:10px;
              color:#999999;
            }
          }
        }
        .tab{
          margin-left:110px;
          width:420px;
          margin-top:10px;
        }
      }
      .addFood{
        margin-left:100px;
        margin-top:20px;
      }
      .productProperty{
        display:flex;
        margin-top:20px;
        p{
          width:100px;
          text-align:right;
          margin-right:10px;
        }
      }
      .repeatPro{
        .repeatPro-1{
          .propertyMen{
            .propertyMen-1{
              display:flex;
              margin-top:20px;
              p{
                width:100px;
                text-align:right;
                margin-right:10px;
              }
              .propertySelect{
                width:420px;
                background:#f1f0f2;
                height:40px;
                display:flex;
                align-items: center;
                justify-content: space-between;
                .el-select{
                  margin-left:10px;
                }
                .el-icon-close{
                  margin-right:10px;
                  color:#999999;
                }
              }
            }
            .propertyMen-2{
              width:420px;
              margin-left:110px;
              margin-top:10px;
              border:1px solid #dfdfdf;
              padding-top:10px;
              padding-bottom:20px;
              .tag{
                .el-tag{
                  margin-left:20px;
                  margin-top:10px;
                  padding-left:20px;
                  padding-right:20px;
                }
              }
            }
          }
        }
        .setProperty{
          margin-top:10px;
          margin-left:110px;
        }
        .addPro{
          display:flex;
          margin-top:20px;
          .el-button{
            margin-left:110px;
          }
        }
      }
      .stockFood{
        display:flex;
        margin-top:20px;
        align-items: center;
        p{
          width:100px;
          text-align:right;
          margin-right:10px;
        }
        .showStock{
          display:flex;
          align-items: center;
          margin-right:20px;
          .el-input{
            margin-left:10px;
          }
          span{
            font-size:12px;
            color:#999;
            margin-left:10px;
          }
        }
        .dayStockState{
          display:flex;
          .hint{
            margin-left:20px;
            display: inline-block;
            width:20px;
            height:20px;
            background-image:url("../../assets/images/hint.png");
            background-size:cover;
          }
        }
      }
      .productDis{
        display:flex;
        margin-top:20px;
        p{
          width:100px;
          text-align:right;
          margin-right:10px;
        }
        div{
          width:420px;
        }
      }
      .productItem3{
          margin-top:20px;
          display:flex;
          .upImage{
            width:100px;
            text-align:right;
            margin-right:10px;
          }
          .productUpload{
            .avatar-uploader{
              cursor: pointer;
              position: relative;
              overflow: hidden;
            }
            .discr{
              margin-left:-1px;
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
            .avatar-uploader-icon::after{
              content:"点击上传图片";
              font-size:12px;
              display:block;
              line-height: 0px;
              margin-top:-15px;
            }
            .avatar-uploader-icon:hover{
              border-color: #f13e42;
            }
            .avatar {
              width: 95px;
              height: 95px;
              display: block;
            }
            .changeImg{
              height:30px;
              font-size:14px;
              background:rgba(0,0,0,.5);
              position:absolute;
              margin-top:-30px;
              color:#fff;
              width:95px;
            }
            p{
              font-size:12px;
              color:#b8b8b8;
              margin-top:10px;
            }
          }
        }
      }
      .advancedSetup{
        div{
          display:flex;
          align-items:center;
          justify-content: space-between;
          margin-top:20px;
          height:40px;
          background:#f1f0f2;
          width:600px;
          p{
            width:100px;
            text-align:right;
            margin-right:10px;
          }
          .el-icon-caret-bottom{
            margin-right:10px;
          }
        }
      }
      .chooseFood{
        margin-top:20px;
        .chooseAdd{
          display:flex;
          p{
            width:100px;
            text-align:right;
            margin-right:10px;
          }
          div{
            width:460px;
            .el-table::before, .el-table::after{
              display: none;
            }
            .tab{
              border:1px solid rgb(236, 223, 223);
              .el-table{
                border:none;
                .el-table-column{
                  border:none;
                  text-align: center;
                }
              }
              .append{
                margin-top:15px;
                display:flex;
                align-items:center;
                margin-bottom:15px;
                margin-left:10px;
                .el-input{
                  width:150px;
                  margin-left:20px;
                }
              }
            }
          }
        }
        .addSilme{
          margin-top:20px;
          display:flex;
          align-items: center;
          .placeholder{
            margin-left:10px;
          }
          p{
            width:100px;
            text-align: right;
          }
        .hint{
            margin-left:20px;
            display: inline-block;
            width:20px;
            height:20px;
            background-image:url("../../assets/images/hint.png");
            background-size:cover;
          }
        }
        .dummyNum{
          display:flex;
          align-items: center;
          margin-top:20px;
          p{
            width:100px;
            text-align:right;
            margin-right:10px;
          }
          .el-input{
            width:110px;
            margin-left:30px;
          }
          .hint{
            margin-left:20px;
            display: inline-block;
            width:20px;
            height:20px;
            background-image:url("../../assets/images/hint.png");
            background-size:cover;
          }
        }
      }
      .operation{
        display:flex;
        align-items: center;
        margin-top:20px;
        p{
          width:100px;
          text-align:right;
          margin-right:10px;
        }
        div{
          .el-checkbox{
            margin-left:57px;
          }
        }
      }
      .saveFood{
        display:flex;
        align-items: center;
        margin-top:50px;
        margin-left:20px;
        margin-bottom:100px;
        .next{
          border-color: #f13c41;
          color:#f13c41;
          margin-left:30px;
        }
      }
  }
</style>
>>>>>>> develop
