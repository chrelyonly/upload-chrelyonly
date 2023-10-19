<script>
let this1;
export default {
  name: 'fileUpload',
  data(){
    return{
      form: {},
      loading: false,
      selectionList: [],
      data: [],
      option: {
        calcHeight: 30,
        tip: false,
        searchShow: false,
        searchMenuSpan: 6,
        border: true,
        addBtn: false,
        editBtn: false,
        index: true,
        viewBtn: false,
        delBtn: false,
        align: "center",
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "文件id",
            prop: "uid",
          },
          {
            label: "文件名",
            prop: "fileName",
          },
          {
            label: "大小",
            prop: "fileSize",
          },
          {
            label: "类型",
            prop: "fileType",
          },
          {
            label: "上传状态",
            prop: "uploadStatus",
            type: "select",
            value:"3",
            props: {
              label: "label",
              value: "value"
            },
            dicData: [
              {
                label: "上传中",
                value: "0",
              },
              {
                label: "上传成功",
                value: "1",
              },
              {
                label: "上传失败",
                value: "2",
              },
              {
                label: "待上传",
                value: "3",
              },
            ],
          },
          {
            label: "上传时间(上传后出现)",
            prop: "uploadData",
            overHidden: true,
          },
          {
            label: "文件链接(上传后出现)",
            prop: "url",
            type: 'upload',
            overHidden: true,
          },
          {
            label: "上传进度",
            prop: "percentage",
            dataType: "number",
            value: 0,
            hide: true,
          },
        ]
      },
      // 待上传文件列表(临时用)
      fileList: [],
      // 总计文件大小
      totalSize: 0,
    //   上传成功的文件
      uploadSuccess: []

    }
  },
  mounted() {
    this1 = this;
    //   从缓存中获取data
    let data = window.localStorage.getItem("data")
    if (data){
      this.data = JSON.parse(data)
      if (this.data?.length>0){
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i]?.uploadStatus === "1"){
            this.uploadSuccess.push(this.data[i])
          }
        }
        this.totalFunc()
      }
    }
  },
  watch: {
    fileList: function(val,old){
      //   循环添加到data
      for (let i = 0; i < val.length; i++) {
        // 判断文件类型
        let rawFile = val[i].raw
        if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
          this1.$message.error('只允许上传图片 jpg png 类型的图片!')
          // this1.fileList.splice(i, 1)
          return
        } else if (rawFile.size / 1024 / 1024 > 10) {
          this1.$message.error('每张文件大小需限制5MB!')
          // this1.fileList.splice(i, 1)
          return
        }
        // 否则添加到data
        let items = {
          uid: val[i].uid + "",
          fileName: val[i].name,
          fileSize: (val[i].size/1024).toFixed(2),
          fileType: val[i].raw.type,
          uploadStatus: '3',
          raw: val[i].raw
        };
        // 添加到第一个下标
        this1.data.unshift(items)
      }
      this1.totalFunc()

      if(this1.fileList.length > 0){
        //   置空文件列表
        this1.fileList = []

      }
    },
  },
  methods:{
    totalFunc(){
      //   循环统计大小和成功的数量
      let totalSize = 0;
      for (let i = 0; i < this.data.length; i++) {
        totalSize += (+this.data[i].fileSize)
      }
      this.totalSize = +(totalSize.toFixed(2))
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
      }
      done();
    },
    cellClick(row){
      this.$Clipboard({
        text: row.url
      }).then(() => {
        this.$message.success('复制链接成功')
      }).catch(() => {
        this.$message.error('复制链接失败')
      });
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    // 批量删除
    delSBtn(){
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择数据");
        return;
      }
      this.$confirm('删除后不可恢复(只删除记录,不删除资源)?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        for (let i = 0; i < this.selectionList.length; i++) {
          for (let j = 0; j < this.data.length; j++) {
            if (this.selectionList[i].uid === this.data[j].uid){
              this.data.splice(j,1)
            }
          }
        }
        this.totalFunc()
        window.localStorage.setItem("data",JSON.stringify(this.data))
      })
    },
    // 删除操作
    delBtn(row){
      this.$confirm('删除后不可恢复(只删除记录,不删除资源)?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].uid === row.uid){
            this.data.splice(i,1)
          }
        }
        this.totalFunc()
        window.localStorage.setItem("data",JSON.stringify(this.data))
      })
    },
    // 上传文件时模拟进度条
    autoPercentage(row){
      row.percentage = 0;
      let timer = setInterval(() => {
        // 加上随机数,模拟进度条
        row.percentage += Math.floor(Math.random()*20);
        if (row.percentage > 100) {
          row.percentage = 100;
          clearInterval(timer);
        }
      }, Math.floor(Math.random()*400));

    },
  //   提交按钮
    uploadBtn(){
      let this1 = this;
      this1.$confirm('是否确认上传文件(成功上传的不会再上传)?', '提示', {
        confirmButtonText: '开始上传',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        for (let i = 0; i < this1.data.length; i++) {
          if (this1.data[i].uploadStatus === "1"){
            continue
          }
          if (this1.data[i].raw instanceof File){
            this1.autoPercentage(this1.data[i])
            let params = {
              file: this1.data[i].raw,
              uid: this1.data[i].uid,
            }
            let headers = {
              "Content-Type": "multipart/form-data",
            }
            // 请在后端进行文件校验!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            this1.$https("/oss/endpoint/put-files","post",params,2,headers).then( res=>{
              setTimeout(()=>{
                for (let j = 0; j < this1.data.length; j++) {
                  if (res.data.code === 200){
                    // 上传成功设为1 已上传
                    if (this1.data[j].uid === res.data.data.uid){
                      this1.data[j].uploadStatus = "1"
                      this1.data[j].uploadData = new Date().Format("yyyy-MM-dd hh:mm:ss")
                      this1.data[j].url = res.data.data.fileRes.link
                      this1.data[j].percentage = 100
                      this1.uploadSuccess.push(this1.data[j])
                    }
                  }else{
                    // 上传失败设为2 上传失败
                    if (this1.data[j].uid === res.data.data.uid){
                      this1.data[j].uploadStatus = "2"
                      this1.data[j].percentage = 100
                      this1.data[j].uploadData = new Date().Format("yyyy-MM-dd hh:mm:ss")
                    }
                  }
                }
                //   将data存入缓存,存缓存后 file类型将丢失
                window.localStorage.setItem("data",JSON.stringify(this1.data))
              },1000)
            })
          }else {
            this1.$message.error("文件上传失败")
          }
        }

      })
    }
  }
}
</script>

<template>
  <basic-container class="file-upload-my">
    <el-upload
      style="text-align: center; margin: 0 auto"
      drag
      multiple
      :auto-upload="false"
      v-model:file-list="fileList"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖动文件或点击上传</div>
      <div class="el-upload__text">上传资源文件,每个文件允许上传大小为 5MB</div>
      <template #file="scope">
        {{ scope }}
      </template>
      <template #tip>
        <div class="el-upload__tip">
          <!--        置空文件列表,单独自定义 -->
        </div>
      </template>
    </el-upload>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :before-open="beforeOpen"
      v-model="form"
      ref="crud"
      @cell-click="cellClick"
      @selection-change="selectionChange"
    >
      <template #fileSize="scope">
        <el-tag type="warning">{{ scope.row.fileSize }}KB</el-tag>
      </template>
      <template #uploadStatus="scope">
        <div style="width: 100%;">
          <el-progress
            v-if="scope.row?.percentage && scope.row?.percentage !== 0 && scope.row?.percentage !== 100"
            :percentage="scope.row.percentage"
            striped-flow
            :indeterminate="true"
            :stroke-width="25" striped />
          <el-tag
            v-else-if="scope.row?.uploadStatus"
            :type="
            scope.row.uploadStatus === '1'
              ? 'success'
              : scope.row.uploadStatus === '2'
              ? 'danger'
              : scope.row.uploadStatus === '3'
              ? 'info'
              : 'primary'
          "
          >{{ scope.row.$uploadStatus }}</el-tag
          >
        </div>
      </template>
      <template #menu="scope">
        <el-button type="text" @click.stop="cellClick(scope.row)"
                   icon="el-icon-view" >
          复制链接
        </el-button>
        <el-button type="text" @click.stop="delBtn(scope.row)"
                   icon="el-icon-view" >
          删除
        </el-button>
      </template>
      <template #menu-left>
        <el-button type="success" @click="uploadBtn">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          开始上传
        </el-button>
        <el-button type="danger" @click="delSBtn" icon="el-icon-delete">
          批量删除
        </el-button>
      </template>
    </avue-crud>
    <div>
      <el-tag type="info" effect="dark" style="margin: 5px">文件数量: {{ data.length }}</el-tag>
      <el-tag type="info" effect="dark" style="margin: 5px">总大小: {{ totalSize }} KB</el-tag>
      <el-tag type="success" effect="dark" style="margin: 5px"
        >已上传数量: {{ uploadSuccess.length }}</el-tag
      >
    </div>
  </basic-container>
</template>

<style scoped>
:deep(.el-upload-dragger)  {
  width: 100% !important;
}
:deep(.el-progress__text)  {
  min-width: 0 !important;
}
</style>