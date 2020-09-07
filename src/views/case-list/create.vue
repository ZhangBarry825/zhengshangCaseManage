<template>
  <div class="create-box">
    <h2>新增案例</h2>

    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px">
      <el-form-item label="案例名称" prop="caseName">
        <el-input v-model="ruleForm.caseName"></el-input>
      </el-form-item>
      <el-form-item label="案例分组" prop="caseGroup">
        <el-select v-model="ruleForm.caseGroup" placeholder="请选择案例分组">
          <el-option :label="item" :value="item" v-for="item in groupList"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="功能描述" prop="functionDes">
        <el-input v-model="ruleForm.functionDes"></el-input>
      </el-form-item>
      <el-form-item label="项目语言" prop="language">
        <el-input v-model="ruleForm.language"></el-input>
      </el-form-item>
      <el-form-item label="项目报价" prop="price">
        <el-input v-model="ruleForm.price" type="number"
                  onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"></el-input>
      </el-form-item>

<!--      <el-form-item label="演示图片" prop="imageUrl">-->
<!--        <el-upload-->
<!--          ref="upload"-->
<!--          :limit="1"-->
<!--          action="#"-->
<!--          list-type="picture-card"-->
<!--          :http-request="uploadRequest"-->
<!--          :auto-upload="true">-->
<!--          <i slot="default" class="el-icon-plus"></i>-->
<!--          <div slot="file" slot-scope="{file}">-->
<!--            <img-->
<!--              class="el-upload-list__item-thumbnail"-->
<!--              :src="file.url" alt="">-->
<!--            <span class="el-upload-list__item-actions">-->
<!--          <span-->
<!--            class="el-upload-list__item-preview"-->
<!--            @click="handlePictureCardPreview(file)">-->
<!--            <i class="el-icon-zoom-in"></i>-->
<!--          </span>-->
<!--          <span-->
<!--            v-if="!disabled"-->
<!--            class="el-upload-list__item-delete"-->
<!--            @click="handleRemove(file)">-->
<!--            <i class="el-icon-delete"></i>-->
<!--          </span>-->
<!--      </span>-->
<!--          </div>-->
<!--        </el-upload>-->
<!--      </el-form-item>-->

      <el-form-item label="演示图片" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :http-request="uploadRequest">
          <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>



      <el-form-item label="案例网站地址" prop="caseIndexUrl">
        <el-input v-model="ruleForm.caseIndexUrl"></el-input>
      </el-form-item>
      <el-form-item label="案例后台地址" prop="caseBackgroundUrl">
        <el-input v-model="ruleForm.caseBackgroundUrl"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
  import {createCase, getCaseGroupList} from '@/api/case'
  import {uploadFile} from "@/api/user";

  export default {
    name: "CreateCase",
    data() {
      return {

        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,

        subImgUrl: '',
        ruleForm: {
          caseName: '',
          caseIndexUrl: '',
          caseGroup: '',
          caseBackgroundUrl: '',
          functionDes: '',
          language: '',
          price: '',
          imageUrl: '',
        },
        groupList: '',

        rules: {
          caseName: [
            {required: true, message: '请输入案例名称', trigger: 'blur'},
          ],
          caseGroup: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          caseIndexUrl: [
            {required: true, message: '请填写案例网站地址', trigger: 'blur'}
          ],
          caseBackgroundUrl: [
            {required: true, message: '请填写案例后台地址', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      uploadRequest(params) {
        let that = this
        const file = params.file,
          fileType = file.type,
          isImage = fileType.indexOf("image") != -1,
          isLt2M = file.size / 1024 / 1024 < 2;
        // 这里常规检验，看项目需求而定
        if (!isImage) {
          this.$message.error("只能上传图片格式png、jpg、gif!");
          return;
        }
        if (!isLt2M) {
          this.$message.error("只能上传图片大小小于2M");
          return;
        }
        // 根据后台需求数据格式
        const form = new FormData();
        // 文件对象
        form.append("file", file);
        uploadFile(form).then(res => {
          console.log(res, 123123)
          if (res.data || res.code == 200) {
            that.ruleForm.imageUrl = res.data
          }
        }).catch(() => {

        })
      },
      handleRemove(file) {
        this.ruleForm.imageUrl = ''
        this.$refs.upload.clearFiles();

      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },



      goBack() {
        this.$router.go(-1)
      },
      fetchCaseGroupList() {
        console.log('获取数据')
        let that = this
        getCaseGroupList({}).then(res => {
          that.groupList = res.data
        })
      },


      onSubmit(formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let {caseName, caseIndexUrl, caseGroup, caseBackgroundUrl, functionDes, language, price, imageUrl} = that.ruleForm

            let formData = new FormData()
            formData.append('caseName', caseName)
            formData.append('caseIndexUrl', caseIndexUrl)
            formData.append('caseGroup', caseGroup)
            formData.append('caseBackgroundUrl', caseBackgroundUrl)

            formData.append('functionDes', functionDes)
            formData.append('language', language)
            formData.append('price', price)
            formData.append('imageUrl', imageUrl)

            createCase(formData).then(res => {
              console.log(res, 'res')
              this.$message({
                message: '添加成功',
                type: 'success',
              })
              setTimeout(() => {
                that.$router.push({
                  path: '/case-list/list'
                })
              }, 1000)
            })
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },

    },
    mounted() {
      this.fetchCaseGroupList()
      this.subImgUrl = process.env.VUE_APP_BASE_API + '/image/up'

    }
  }
</script>

<style scoped lang="scss">
  .create-box {
    padding: 20px;
    box-sizing: border-box;
    max-width: 50%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    background-color: #d9d9d9;
    border-radius: 5px;
  }

</style>
