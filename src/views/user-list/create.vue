<template>
  <div class="create-box">
    <h2>新增用户</h2>

    <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="150px">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="ruleForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="role">
        <el-select v-model="ruleForm.role" placeholder="请选择用户角色">
          <el-option :label="item" :value="item" v-for="item in roleList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  import {createUser, getRoleGroupList} from "@/api/users";
  export default {
    name: "CreateUser",
    data() {
      return {
        ruleForm: {
          username: '',
          role: '',
          password: '',
          nickname: '',
        },
        roleList:'',

        rules: {
          username: [
            { required: true, message: '请输入用户账号', trigger: 'blur' },
          ],
          nickname: [
            { required: true, message: '请输入用户昵称', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
          ],
          role: [
            { required: true, message: '请选择用户身份', trigger: 'change' }
          ],
        }
      }
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      fetchUserGroupList(){
        console.log('获取数据')
        let that=this
        getRoleGroupList({}).then(res=>{
          that.roleList=res.data
        })
      },


      onSubmit(formName) {
        let that=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let {username,nickname,password,role}=that.ruleForm

            let formData = new FormData()
            formData.append('username', username)
            formData.append('nickname', nickname)
            formData.append('password', password)
            formData.append('rolename', role)

            createUser(formData).then(res=>{
              console.log(res,'res')
               this.$message({
                message: '添加成功',
                type: 'success',
              })
              setTimeout(()=>{
                that.$router.push({
                  path: '/user-list/list'
                })
              },1000)
            })
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },

    },
    mounted() {
      this.fetchUserGroupList()
    }
  }
</script>

<style scoped lang="scss">
  .create-box {
    padding: 20px;
    box-sizing: border-box;
    max-width: 50%;
  }
</style>
