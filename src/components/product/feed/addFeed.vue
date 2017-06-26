<template>
  <div class="editor" v-show="skuObj.isShowAdd">
    <div class="edi-box">
      <div class="edi-tit">
        <h4>新增加料商品</h4>
        <div class="close" @click="hideAdd()"></div>
      </div>
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item class="add-name" label="商品名称：">
          <el-input auto-complete="off" placeholder="如：加蛋、加珍珠等" :maxlength="5" v-model="skuObj.sku.name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格：" class="add-name">
          <el-input placeholder="0.00" v-model="skuObj.sku.price_sell"></el-input>
        </el-form-item>
        <el-form-item label="商品库存：" class="add-name">
          <el-checkbox class="all-select" v-model="skuObj.stockFlag">设置库存</el-checkbox>
          <span class="num-tip">不设置库存时商品则无库存上限</span>
          <div class="save-num" v-if="skuObj.stockFlag">
            <el-input v-model="skuObj.sku.stock" placeholder="最多99999"></el-input>
            <el-checkbox v-model="skuObj.dailyFlag">每日更新库存</el-checkbox>
            <el-tooltip class="item" effect="light" content="如设置库存为100，则每日营业时自动恢复为100" placement="right">
              <i class="ico-tip"></i>
            </el-tooltip>
          </div>
        </el-form-item>
        <div class="btn-wrap">
          <el-button class="btn" type="primary" @click="submit">确认</el-button>
          <el-button class="btn" type="primary" @click="hideAdd">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import * as Vue from 'vue';
import Component from 'vue-class-component';
import { createAppendage, editAppendage } from '../../../service/product/feed';
@Component({
  props:{
    skuObj:Object,
  }
})
export default class AddFeed extends Vue{
    skuObj:any;
    $message:any;
    hideAdd() {
      this.$emit('hideAdd')
    }
    submit() {
      if (!this.skuObj.sku.name) {
        return this.$message({
          message: `加料商品名称不可为空`,
          type: 'error'
        })
      }
      if (!/^(0(?!\.0{1,2}$)(\.[0-9]{1,2})?|[1-9][0-9]{0,3}(\.[0-9]{1,2})?)$/.test(this.skuObj.sku.price_sell)) {
        return this.$message({
          message: `商品价格为纯数字，区间为0-9999.99`,
          type: 'error'
        })
      }
      if (this.skuObj.stockFlag && !/^[+]?\d{1,5}$/.test(this.skuObj.sku.stock)) {
        return this.$message({
          message: `请正确输入库存，上限不超过99999`,
          type: 'error'
        })
      }
      if (!this.skuObj.isEdit) {
        createAppendage({
          name: this.skuObj.sku.name,
          price_sell: parseInt(parseFloat(this.skuObj.sku.price_sell * 100 as any).toFixed(0)),
          stock_on: this.skuObj.stockFlag ? 1 : 2,
          stock: parseInt(this.skuObj.sku.stock),
          stock_daily_on: this.skuObj.dailyFlag ? 1 : 2
        }).then((data:any) => {
          if (data.code === '0') {
            this.$emit('hideAdd')
            this.$message({
              message: `加料商品添加成功`,
              type: 'success'
            })
          }
        })
      } else {
        editAppendage({
          name: this.skuObj.sku.name,
          price_sell: parseInt(parseFloat(this.skuObj.sku.price_sell * 100 as any).toFixed(0)),
          stock_on: this.skuObj.stockFlag ? 1 : 2,
          stock: parseInt(this.skuObj.sku.stock),
          stock_daily_on: this.skuObj.dailyFlag ? 1 : 2,
          id: this.skuObj.sku.id
        }).then((data:any) => {
          if (data.code === '0') {
            this.$emit('hideAdd')
            this.$message({
              message: `加料商品修改成功`,
              type: 'success'
            })
          }
        })
      }
    }
}
</script>
<style lang="less" scoped>
.editor .edi-box .add-name {
  margin-left: 50px !important;
}

.el-input {
  width: 84%;
}

.editor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
  font-size: 15px;
  z-index: 1000;
  .edi-box {
    width: 660px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
    padding-bottom: 18px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    span {
      display: inline-block;
    }
    .add-name {
      width: 600px;
      margin-top: 10px;
      .save-num {
        display: flex;
        margin-top: 8px;
        .el-input {
          width: 20%;
          margin-right: 10px;
        }
      }
      .ico-tip {
        width: 20px;
        height: 20px;
        display: inline-block;
        background: url("../../../assets/images/hint.png") no-repeat center;
        background-size: cover;
        margin: 10px 0 0 10px;
      }
      .num-tip {
        color: #999;
        display: inline-block;
        margin-left: 20px;
      }
    }
    .btn-wrap {
      width: 400px;
      margin: 0 auto;
      text-align: center;
      .btn {
        width: 100px;
        height: 34px;
        line-height: 12px;
      }
    }
  }
  h4 {
    float: left;
    margin-left: 10px;
    font-weight: normal;
  }
  .edi-tit {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    background: #f13e42 !important;
    clear: both;
    font-size: 13px;
    font-weight: normal;
    margin-bottom: 18px;
  }
  .close {
    background: url("../../../assets/images/close.png") no-repeat right;
    width: 30px;
    height: 30px;
    float: right;
    margin-top: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
