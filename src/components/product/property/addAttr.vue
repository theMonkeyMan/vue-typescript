<template>
  <div class="editor" v-show="dialogObj.isShowAdd">
    <div class="edi-box">
      <div class="edi-tit">
        <h4>新增/编辑{{menuObj[dialogObj.type].name}}</h4>
        <div class="close" @click="hideAdd()"></div>
      </div>
      <p class="tips" v-show="isShowTips">
        <span v-text="menuObj[dialogObj.type].content"></span>
        <el-button class="closes" type="text" @click="closeTip()">关闭</el-button>
      </p>
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item class="add-name" :label="menuObj[dialogObj.type].name + '名称：'">
          <el-input :placeholder="menuObj[dialogObj.type].hint" v-model="dialogObj.itemObj.name" :maxlength="5"></el-input>
        </el-form-item>
        <el-form-item :label="menuObj[dialogObj.type].name + '选项：'" class="add-name">
          <div class="el-form-item__content">
            <div class="el-input">
              <input placeholder="输入后回车键确认" type="text" rows="2" v-model="itemText" :maxlength="5" class="el-input__inner" @keydown.13="addItem()">
            </div>
            <div class="tag"></div>
          </div>
          <div class="tag">
            <el-tag class="tag-margin" v-for="item in dialogObj.itemObj.items" type="gray" :closable="(dialogObj.isEdit && item && item.item_id) ? false : true" @close="handleClose(item)" :key="dialogObj.type === '1' ? item.item_name : item">{{dialogObj.type === '1' ? item.item_name : item}}</el-tag>
          </div>
        </el-form-item>
        <div class="btn-wrap">
          <el-button class="btn" type="primary" @click="submit()">确认</el-button>
          <el-button class="btn" type="primary" @click="hideAdd()">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import * as Vue from 'vue';
import Component from 'vue-class-component';
import { addProductSpec, addProductAttr, editProductSpec, editProductAttr } from '../../../service/product/property';
@Component({
  props: {
    dialogObj: Object,
  }
})
export default class AddAttr extends Vue {
  isShowTips: boolean = true;
  itemText: string = '';
  menuObj: any = {
    '1': {
      name: '规格',
      content: '商品规格如 分量 ：大份、中份、小份；规格不同价格可不同。',
      hint: '如：规格、分量'
    },
    '2': {
      name: '属性',
      content: '商品属性，如口味：微辣、中辣；',
      hint: '如：辣度、加料'
    }
  };
  dialogObj: any;
  $message: any;

  hideAdd() {
    this.dataReset()
    this.$emit('hideAdd')
  }

  handleClose(item: any) {
    this.dialogObj.itemObj.items.splice(this.dialogObj.itemObj.items.indexOf(item), 1)
  }
  closeTip() {
    this.isShowTips = false
  }
  addItem() {
    if (!this.itemText) {
      return this.$message({
        message: `规格内容不能为空`,
        type: 'error'
      })
    }
    if (this.dialogObj.itemObj.items.length >= 6) {
      this.itemText = ''
      return this.$message({
        message: `属性内容不能超过6个`,
        type: 'error'
      })
    }
    if (this.dialogObj.type === '1') {
      let len = this.dialogObj.itemObj.items.filter((item: any) => {
        if (item.item_name === this.itemText) {
          return 1
        }
      }).length
      if (len > 0) {
        this.itemText = ''
        return this.$message({
          message: `规格内容不能重名`,
          type: 'error'
        })
      }
      this.dialogObj.itemObj.items.push({
        item_name: this.itemText
      })
    } else {
      if (this.dialogObj.itemObj.items.indexOf(this.itemText) !== -1) {
        this.itemText = ''
        return this.$message({
          message: `属性内容不能重名`,
          type: 'error'
        })
      }
      this.dialogObj.itemObj.items.push(this.itemText)
    }
    this.itemText = ''
  }

  submit() {
    if (this.dialogObj.type === '2' && !this.dialogObj.itemObj.name) {
      return this.$message({
        message: `属性名称不能为空`,
        type: 'error'
      })
    }
    if (!this.dialogObj.itemObj.items.length) {
      return this.$message({
        message: `${this.menuObj[this.dialogObj.type].name}内容不能为空`,
        type: 'error'
      })
    }
    if (this.dialogObj.type === '1') {
      if (!this.dialogObj.isEdit) {
        addProductSpec({
          name: this.dialogObj.itemObj.name === '' ? '规格' : this.dialogObj.itemObj.name,
          items: this.dialogObj.itemObj.items
        }).then((data: any) => {
          if (data.code === '0') {
            this.dataReset()
            this.$emit('addFinish')
            this.$message({
              message: `规格添加成功`,
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
        editProductSpec({
          id: this.dialogObj.itemObj.id,
          name: this.dialogObj.itemObj.name === '' ? '规格' : this.dialogObj.itemObj.name,
          items: this.dialogObj.itemObj.items
        }).then((data: any) => {
          if (data.code === '0') {
            this.dataReset()
            this.$emit('addFinish')
            this.$message({
              message: `规格编辑成功`,
              type: 'success'
            })
          } else {
            this.$message({
              message: data.msg,
              type: 'error'
            })
          }
        })
      }
    } else {
      if (!this.dialogObj.isEdit) {
        console.log(this.dialogObj)
        addProductAttr({
          name: this.dialogObj.itemObj.name,
          items: this.dialogObj.itemObj.items
        }).then((data: any) => {
          if (data.code === '0') {
            this.dataReset()
            this.$emit('addFinish')
            this.$message({
              message: `属性添加成功`,
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
        editProductAttr({
          id: this.dialogObj.itemObj.id,
          name: this.dialogObj.itemObj.name,
          items: this.dialogObj.itemObj.items
        }).then((data: any) => {
          if (data.code === '0') {
            this.dataReset()
            this.$emit('addFinish')
            this.$message({
              message: `属性编辑成功`,
              type: 'success'
            })
          } else {
            this.$message({
              message: data.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }

  dataReset() {
    this.itemText = ''
  }
}
</script>
<style lang="less" scoped>
.demo-ruleForm {
  margin-top: 20px;
}

.tag-margin {
  margin-right: 5px;
}

.editor .edi-box .add-name[data-v-50b00c28] {
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
    .tips {
      display: flex;
      justify-content: space-between;
      margin: 14px;
      border: 1px solid #ffd821;
      background: #fffdf1;
      line-height: 28px;
      height: 28px;
      padding: 0 12px;
      font-size: 14px;
      span {
        display: inline-block;
      }
      .closes {
        color: #3588ff;
        line-height: 0;
      }
    }
    .add-name {
      width: 600px;
      margin-top: 10px;
    }
    .tag {
      width: 80%;
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
    .repeat-select {
      margin-left: 25px;
    }
    .add-btn {
      height: 30px;
      line-height: 10px;
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
