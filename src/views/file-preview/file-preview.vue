<template>
  <basic-container class="file-preview-page cute-page">
    <!-- 显著提示 -->
    <el-alert
      title="⚠️ 所有上传图片将在 7 天后自动删除，请及时备份！"
      type="warning"
      show-icon
      closable
      class="cute-alert"
    />

    <div class="header-bar">
      <el-input
        v-model="search"
        placeholder="搜索图片名或链接"
        clearable
        style="width: 300px;"
        @input="filterImages"
        class="cute-input"
      >
        <el-button slot="append" icon="el-icon-search" @click="filterImages"></el-button>
      </el-input>
      <el-button @click="uploadFlag = !uploadFlag" type="success" class="cute-upload-btn">
        🍓 上传莓莓图片
      </el-button>
    </div>

    <el-skeleton v-if="loading" rows="5" animated class="cute-skeleton" />

    <div
      v-else
      class="image-scroll-container"
      ref="scrollContainer"
      @scroll="handleScroll"
    >
      <div v-if="displayGroups.length === 0">
        <el-empty description="暂无图片" class="cute-empty"></el-empty>
      </div>

      <div v-for="group in displayGroups" :key="group.date" class="group-section">
        <el-divider content-position="left" class="cute-divider">
          📅 {{ group.date }}
        </el-divider>

        <div class="image-grid">
          <div v-for="url in group.images" :key="url" class="image-card">
            <el-image
              :src="url"
              fit="cover"
              style="width: 150px; height: 150px; border-radius: 12px"
              :preview-src-list="group.images"
              preview-teleported
              lazy
              class="cute-image"
            />
            <div class="file-name">{{ url.split('/').pop() }}</div>
            <div class="image-actions">
              <el-button size="small" type="primary" icon="el-icon-document-copy" @click="copyUrl(url)">
                复制
              </el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteImage(url)">
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loadingMore" class="loading-more">
        <el-spinner type="circle" />
      </div>
      <div v-if="allLoaded" class="all-loaded">🍓 已加载全部图片 🍓</div>
    </div>

    <el-drawer size="70%" v-model="uploadFlag">
      <file-upload></file-upload>
    </el-drawer>
  </basic-container>
</template>

<script>
import FileUpload from '@/views/file-upload/file-upload.vue'

export default {
  components: { FileUpload },
  data() {
    return {
      loading: false,
      search: "",
      allGroups: [],
      filteredGroups: [],
      displayGroups: [],
      batchSize: 3,
      currentIndex: 0,
      loadingMore: false,
      allLoaded: false,
      uploadFlag: false,
    };
  },
  methods: {
    async fetchImages() {
      this.loading = true;
      try {
        const res = await this.$https("/oss/endpoint/test","get",{},1,{});
        if (res.data.code === 200) {
          this.allGroups = res.data.data.fileRes;
          this.filteredGroups = JSON.parse(JSON.stringify(this.allGroups));
          this.displayGroups = [];
          this.currentIndex = 0;
          this.allLoaded = false;
          this.loadMore();
        } else {
          this.$message.error("加载图片失败: " + res.data.msg);
        }
      } catch (e) {
        console.error(e);
        this.$message.error("获取图片失败");
      } finally {
        this.loading = false;
      }
    },
    filterImages() {
      if (!this.search) {
        this.filteredGroups = JSON.parse(JSON.stringify(this.allGroups));
      } else {
        const key = this.search.toLowerCase();
        this.filteredGroups = this.allGroups
          .map(group => ({
            ...group,
            images: group.images.filter(url => url.toLowerCase().includes(key))
          }))
          .filter(group => group.images.length > 0);
      }
      this.displayGroups = [];
      this.currentIndex = 0;
      this.allLoaded = false;
      this.loadMore();
    },
    loadMore() {
      if (this.allLoaded || this.loadingMore) return;
      this.loadingMore = true;

      setTimeout(() => {
        const nextBatch = this.filteredGroups.slice(this.currentIndex, this.currentIndex + this.batchSize);
        if (nextBatch.length > 0) {
          this.displayGroups.push(...nextBatch);
          this.currentIndex += nextBatch.length;
        }
        if (this.currentIndex >= this.filteredGroups.length) {
          this.allLoaded = true;
        }
        this.loadingMore = false;
      }, 300);
    },
    handleScroll() {
      const container = this.$refs.scrollContainer;
      if (!container) return;
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
        this.loadMore();
      }
    },
    copyUrl(url) {
      this.$copyText(url)
        .then(() => this.$message.success("已复制图片链接"))
        .catch(() => this.$message.error("复制失败"));
    },
    async deleteImage(url) {
      try {
        await this.$confirm("确定删除此图片吗？删除后不可恢复！", "警告", {
          confirmButtonText: "确认删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const res = await this.$https("/oss/endpoint/delete-by-url", "get", { url },1,{});
        if (res.data.code === 200) {
          this.$message.success("删除成功");
          this.fetchImages();
        } else {
          this.$message.error("删除失败: " + res.data.msg);
        }
      } catch {}
    }
  },
  mounted() {
    this.fetchImages();
  }
};
</script>

<style scoped>
/* 可爱莓莓风 */
.cute-page {
  background: linear-gradient(to bottom, #fff0f5, #ffe6f0);
  padding: 20px;
  border-radius: 12px;
  font-family: "Comic Sans MS", "Arial", sans-serif;
}

.cute-alert {
  background-color: #fff0f5;
  border-color: #ff85a2;
  color: #ff4d6d;
  font-weight: bold;
  border-radius: 12px;
}

.header-bar {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
}

.cute-input .el-input__inner {
  border-radius: 20px;
}

.cute-upload-btn {
  background-color: #ff5c7a;
  color: #fff;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  transition: all 0.3s;
}

.cute-upload-btn:hover {
  transform: translateY(-3px) scale(1.05);
}

.image-scroll-container {
  max-height: 80vh;
  overflow-y: auto;
}

.group-section {
  margin-bottom: 30px;
}

.cute-divider {
  color: #ff4d6d;
  font-weight: bold;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.image-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffe6f0;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(255, 133, 162, 0.3);
  transition: all 0.3s;
}

.image-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(255, 133, 162, 0.5);
}

.cute-image {
  border-radius: 12px;
}

.file-name {
  margin-top: 5px;
  max-width: 150px;
  word-break: break-all;
  text-align: center;
  font-size: 12px;
  color: #555;
}

.image-actions {
  margin-top: 5px;
  display: flex;
  gap: 5px;
}

.loading-more, .all-loaded {
  text-align: center;
  padding: 10px 0;
  color: #ff4d6d;
  font-weight: bold;
}
</style>
