<script setup>

name = 'fileUpload'
const beforeAvatarUpload  = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' || rawFile.type !== 'image/png') {
    this.$message.error('只允许上传图片 jpg png 类型的图片!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    this.$message.error('每张文件大小需限制2M!')
    return false
  }
  return true
}
</script>

<template>
  <basic-container>
    <el-upload
      style="text-align: center;margin:0 auto"
      class="upload-demo"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
      :auto-upload="false"
      :before-upload="beforeAvatarUpload"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #file>
        <div class="el-upload__tip" slot="file">
          <!--        置空文件列表,单独自定义 -->
        </div>
      </template>
      <template #tip>
        <div class="el-upload__tip">
          上传资源文件,每个文件允许上传大小为 10MB
        </div>
      </template>
    </el-upload>
  </basic-container>
</template>

<style>
.el-upload-dragger{
  width: 100% !important;
}
</style>