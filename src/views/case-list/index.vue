<template>
  <div class="content-box">
    <h2>案例列表</h2>
    <el-button-group style="padding: 5px 10px;box-sizing: border-box;display: flex;align-items: center">
      <el-button size="small" type="primary" icon="el-icon-edit" @click="createCase" v-if="checkPermission(['admin'])">
        新增
      </el-button>
      <el-button size="small" type="primary" icon="el-icon-delete" @click="deleteCase" style="border-top-right-radius: 4px;border-bottom-right-radius: 4px"
                 v-if="checkPermission(['admin'])">删除
      </el-button>
      <el-select style="margin-left: 30px" @change="changeGroup" v-model="nowGroupName" placeholder="按分组查询">
        <el-option
          v-for="item in groupList"
          :key="item.text"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
    </el-button-group>
    <el-table
      stripe
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        width="200"
        label="案例名">
        <template slot-scope="scope">{{ scope.row.caseName }}</template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="functionDes"
        show-overflow-tooltip
        label="功能描述">
      </el-table-column>

      <el-table-column
        prop="caseGroup"
        label="案例分组">
        <template slot-scope="scope">
          <el-tag type="primary" disable-transitions>{{scope.row.caseGroup}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="language"
        label="项目语言">
      </el-table-column>
      <el-table-column
        prop="price"
        label="项目报价">
      </el-table-column>
      <el-table-column
        label="演示图片">
        <template slot-scope="scope">
          <!--          {{ scope.row.imageUrl }}-->
          <img class="sampleImg" :src="scope.row.imageUrl" alt="" @click="showImage(scope.row.imageUrl)">
        </template>
      </el-table-column>
      <el-table-column
        prop="caseIndexUrl"
        label="网站路径"
        width="250"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="caseBackgroundUrl"
        label="后台路径"
        width="250"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="220" v-if="checkPermission(['admin'])" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    <div style="margin-top: 20px">-->
    <!--      <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>-->
    <!--      <el-button @click="toggleSelection()">取消选择</el-button>-->
    <!--    </div>-->

    <el-pagination
      class="pagination"
      background
      @current-change="changePage"
      :current-page="pageNum"
      layout="prev, pager, next"
      :total="totalNum">
    </el-pagination>

  </div>
</template>

<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {deleteCase, getCaseGroupList, getCaseList} from '@/api/case'

  export default {
    name: "CaseList",
    data() {
      return {
        nowGroupName:'',
        groupList: [],
        tableData: [],
        multipleSelection: [],
        loading: false,
        pageNum: 1,
        pageSize: 10,
        totalNum: 0
      }
    },
    methods: {
      changeGroup(){
        this.pageNum=1
        this.totalNum=0
        this.fetchData()
      },
      showImage(path) {
        this.$alert("<img src=" + path + " style='max-width:100%;max-height:100%'>", '', {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: 'clickShowImg',
          center: true,
        });
      },
      checkPermission,
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(index, row) {
        console.log(index, row);

        this.$router.push({
          name: 'UpdateCase',
          params: {
            id: row.id
          }
        })
      },
      handleDelete(index, row) {
        console.log(index, row);
        let that = this
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let formData = new FormData()
          formData.append('id', row.id)
          deleteCase(formData).then(res => {
            console.log(res, 'res')
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.changePage(that.pageNum, true)
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      deleteCase(data) {
        let that = this
        console.log(that.multipleSelection,123123)
        if(that.multipleSelection.length>0){
          let deleteId=[]
          for(let i=0;i<that.multipleSelection.length;i++){
            deleteId.push(that.multipleSelection[i].id)
            console.log(that.multipleSelection[i].id,123)
          }
          console.log(deleteId,555)
          that.$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let formData = new FormData()
            formData.append('id', deleteId)
            deleteCase(formData).then(res => {
              console.log(res, 'res')
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              that.changePage(that.pageNum, true,that.multipleSelection.length)
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }

      },
      changePage(currentPage, isDelete = false, deleteNum = 1) {
        if (isDelete) {
          let num = this.totalNum % this.pageSize
          console.log(this.totalNum, 'this.totalNum')
          console.log(this.pageSize, 'this.pageSize')
          console.log(num, 'num')
          if (num > deleteNum) {
            this.pageNum = currentPage
          } else {
            if (currentPage > 1) {
              this.pageNum = currentPage - 1
            } else {
              this.pageNum = currentPage
            }
          }
        } else {
          this.pageNum = currentPage
        }
        this.fetchData()
      },
      fetchData() {
        let that = this
        this.loading = true
        let data = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
        if(this.nowGroupName!==''){
          data.caseGroup=this.nowGroupName
        }

        getCaseList(data).then(res => {
          console.log(res.data)
          if (res.data != null) {
            that.tableData = res.data.list
            that.totalNum = res.data.total
            that.loading = false
          } else {
            that.tableData = []
            that.totalNum = 0
            that.loading = false
          }

        })
      },
      createCase() {
        this.$router.push({
          path: '/case-list/create'
        })
      },

      fetchCaseGroupList() {
        console.log('获取数据')
        let that = this
        getCaseGroupList({}).then(res => {
          let newList = []
          newList.push({
            text:'全部',
            value:''
          })
          for (let i = 0; i < res.data.length; i++) {
            newList.push({
              text: res.data[i],
              value: res.data[i]
            })
          }
          that.groupList = newList
          console.log('newList', newList)
        })
      },
    },
    created() {
      this.fetchData()
      this.fetchCaseGroupList()
    }
  }
</script>

<style scoped lang="scss">
  .content-box {
    padding: 20px;
    box-sizing: border-box;

    .pagination {
      margin: 20px 0;
    }

    .sampleImg {
      width: 50px;
      height: 50px;
      cursor: pointer;
    }
  }
</style>
