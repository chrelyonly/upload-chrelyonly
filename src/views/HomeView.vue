<template>
  <main class="home-page">
    <!-- 背景可爱图案 -->
    <div class="background-stars"></div>

    <div class="content-container">
      <h1 class="title">欢迎来到莓莓图床 🍓🌸</h1>
      <p class="subtitle">上传和预览你的图片，享受可爱与便利！</p>

      <div class="button-group">
        <router-link to="/file-upload" class="cute-button upload-btn">
          <el-icon><upload-filled /></el-icon>
          上传图片
        </router-link>

        <router-link to="/file-preview" class="cute-button preview-btn">
          <el-icon><picture-filled /></el-icon>
          预览图片
        </router-link>
      </div>

      <div class="footer-text">
        💡 小提示：图片将在 7 天后自动删除，请及时备份！
      </div>
    </div>

    <!-- 萌萌飘浮小元素 -->
    <div class="floating-stars">
      <span v-for="n in 10" :key="n" class="star">⭐</span>
    </div>
  </main>
</template>

<script>
export default {
  name: "HomePage"
};
</script>

<style scoped>
.home-page {
  position: relative;
  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #ffe6f0, #fff5f7);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: "Comic Sans MS", "Arial", sans-serif;
}

.background-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#fff 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
  z-index: 0;
}

.content-container {
  position: relative;
  text-align: center;
  z-index: 2;
}

.title {
  font-size: 3em;
  color: #ff69b4;
  margin-bottom: 10px;
  animation: bounce 1.5s infinite;
}

.subtitle {
  font-size: 1.2em;
  color: #ff85c0;
  margin-bottom: 30px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.cute-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffb6c1;
  color: #fff;
  padding: 15px 25px;
  border-radius: 20px;
  font-size: 1.2em;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 5px 10px rgba(255, 182, 193, 0.5);
}

.cute-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 15px rgba(255, 182, 193, 0.7);
}

.upload-btn {
  background-color: #ff85c0;
}

.preview-btn {
  background-color: #ff69b4;
}

.footer-text {
  font-size: 1em;
  color: #ff4081;
  margin-top: 20px;
}

.floating-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.floating-stars .star {
  position: absolute;
  font-size: 1.5em;
  animation: floatStar 5s linear infinite;
}

.floating-stars .star:nth-child(odd) {
  animation-duration: 6s;
  font-size: 2em;
}

@keyframes floatStar {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-20vh) translateX(50px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>
