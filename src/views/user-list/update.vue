<template>
  <div class="update-box">
    <h2>用户信息修改</h2>

    <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="150px">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nikeName">
        <el-input v-model="ruleForm.nikeName"></el-input>
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
        <el-button type="primary" @click="onSubmit('ruleForm')">立即修改</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {createCase, getCase, getCaseGroupList, updateCase} from '@/api/case'
  import {getRoleGroupList, getUser, updateUser} from "@/api/users";
  export default {
    name: "UpdateUser",
    data() {
      return {
        ruleForm: {
          id:0,
          username: '',
          role: '',
          password: '',
          nikeName: '',
        },
        roleList:'',

        rules: {
          username: [
            { required: true, message: '请输入用户账号', trigger: 'blur' },
          ],
          nikeName: [
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
      fetchCase(){
        console.log('获取数据')
        let that=this
        getUser({
          id:this.ruleForm.id
        }).then(res=>{
          that.ruleForm=res.data
        })
      },

      onSubmit(formName) {
        let that=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let {id,username,nikeName,password,role}=that.ruleForm

            let formData = new FormData()
            formData.append('id', id)
            formData.append('username', username)
            formData.append('nikeName', nikeName)
            formData.append('password', password)
            formData.append('rolename', role)

            updateUser(formData).then(res=>{
              console.log(res,'res')
              this.$message({
                message: '修改成功',
                type: 'success',
              })
              setTimeout(()=>{
                that.$router.push({
                  path: '/user-list/list'
                })
              },1000)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

    },
    mounted() {
      this.fetchUserGroupList()
      this.ruleForm.id=this.$route.params.id
      this.fetchCase()
    }
  }
</script>

<style scoped lang="scss">
  .update-box {
    padding: 20px;
    box-sizing: border-box;
    max-width: 50%;
  }
</style>
