<template>
  <div class="owasp-detail-page">
    <button class="menu-toggle-button" @click="toggleMenu">
      ☰ 
    </button>
    <div class="sidebar" :class="{ 'open': isMenuOpen }">
      <h2>OWASP Top 10</h2>
      <ul class="menu-list">
        <li ><router-link to="/A01">A01 Broken Access Control</router-link></li>
        <li class="active"><router-link to="/A02">A02 Cryptographic Failures</router-link></li>
        <li><router-link to="/A03">A03 Injection</router-link></li>
        <li ><router-link to="/A04">A04 Insecure Design</router-link></li>
        <li><router-link to="/A05">A05 Security Misconfiguration</router-link></li>
        <li><router-link to="/A06">A06 Vulnerable and Outdated Components</router-link></li>
        <li><router-link to="/A07">A07 Identification and Authentication Failures</router-link></li>
        <li><router-link to="/A08">A08 Software and Data Integrity Failures</router-link></li>
        <li><router-link to="/A09">A09 Security Logging and Monitoring Failures</router-link></li>
        <li><router-link to="/A10">A10 Server-Side Request Forgery (SSRF)</router-link></li>
      </ul>
    </div>
    <div class="main-content" :class="{ 'menu-open': isMenuOpen }">
      <div class="header">
        <h1 class="title-left">A02 Cryptographic Failures</h1>
      </div>
      <div class="content ">
        <section class="section">
          <h2>什麼是 Insecure Design</h2>
          <div class="left">
            <p>
              <strong>Insecure Design</strong> 是指應用程式在設計階段未考慮安全性，導致系統結構缺乏防禦能力。不安全的設計可能涵蓋錯誤的邏輯決策、缺乏對用戶安全行為的驗證流程等。
            </p>
          </div>
        </section>
        <div class="divider"></div>
      <section class="section">
          <h2>需求和資源管理</h2>
          <div class="mar">
          <ul class="styled-list left-list">
            <li>1. 依設計目標明確列出資安需求，包括存取控制需求、資料隱私、角色驗證與授權。</li>
            <li>2. 利用威脅建模找出設計上的風險與弱點。</li>
            <li>3. 採取預防性設計，如在設計階段導入安全需求。</li>
            <li>4. 利用開發框架或套件時，明確、謹慎地指定所需功能或模組。</li>
          </ul>
          </div>
      </section>


        <div class="divider"></div>
        <section class="section">
          <h2>如何預防</h2>
          <ol class="styled-list left-list">
            <li>1.系統開發前進行威脅建模，確保考慮各種攻擊設計。</li>
            <li>2.在設計過程中明確記錄與驗證安全需求。</li>
            <li>3.導入安全設計模式，如預設拒絕（deny by default）。</li>
            <li>4.落實開發標準流程，避免功能邏輯異常。</li>
            <li>5.教育訓練開發人員，建立安全設計的正確認知。</li>
            <li>6.進行設計審查與安全測試，及早發現問題。</li>
          </ol>
        </section>

        <div class="navigation-footer">
          <router-link to="/A01" class="nav-button prev-button">
            <img src="@/assets/arrow-left.png" alt="上一項" class="nav-arrow">
            A01 Broken Access Control
          </router-link>
          <router-link to="/A03" class="nav-button next-button">
            A03 Injection
            <img src="@/assets/arrow-right.png" alt="下一項" class="nav-arrow">
          </router-link>
        </div>
      </div>
    </div>

    <div class="fixed-nav-buttons">
      <button class="fixed-nav-icon back-icon" @click="$router.go(-1)">
        <img src="@/assets/arrow-up.png" alt="返回"> </button>
      <router-link to="/" class="fixed-nav-icon home-icon">
        <img src="@/assets/home.png" alt="回首頁">
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const isMenuOpen = ref(false);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    return {
      isMenuOpen,
      toggleMenu,
    };
  },
};
</script>

<style scoped>
.owasp-detail-page {
  display: flex;
  background-color: #eee;
  color: #3C3C3C;
  font-family: Arial, Helvetica, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  min-height: 100vh;
}

.menu-toggle-button {
  position: fixed; /* 固定在左上角 */
  top: 0px;
  left: 0px;
  background-color: #585858;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  z-index: 1001; /* 確保在側邊欄之上 */
  font-size: 16px; /* 調整文字大小 */
}

.sidebar {
  width: 200px;
  background-color: #ddd;
  padding: 20px;
  box-sizing: border-box;
  position: fixed; /* 固定位置 */
  top: 0;
  left: -200px; /* 初始時隱藏在左邊 */
  height: 100%;
  overflow-y: auto; /* 如果內容過長可以滾動 */
  z-index: 1000; /* 確保在主要內容之上 */
  transition: left 0.3s ease-in-out; /* 滑動動畫 */
}

.sidebar.open {
  left: 0; /* 按下按鈕後滑出 */
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  box-sizing: border-box;
  transition: margin-left 0.3s ease-in-out; /* 主要內容的 margin 動畫 */
  margin-left: 0; /* 初始時沒有左邊距 */
}

.main-content.menu-open {
  margin-left: 200px; /* 側邊欄滑出後增加左邊距 */
}

.sidebar h2 {
  font-size: 1.5em;
  margin-bottom: 15px;
  color: #585858;
}

.menu-list {
  list-style: none;
  padding: 0;
}

.menu-list li {
  margin-bottom: 10px;
}

.menu-list li a {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: #3C3C3C;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}

.menu-list li a:hover {
  background-color: #ccc;
}

.menu-list li.active a {
  background-color: #585858;
  color: #fff;
  font-weight: bold;
}

/* 其餘樣式保持不變 */
.divider {
  height: 2px;
  background-color: #ccc;
  margin: 40px 0;
}

.header {
  color: #585858;
  background-color: #ddd;
  margin-bottom: 30px;
  position: relative;
  text-align: left;
  width: 100%;
  margin-top: 0%;
}

.title-left {
  font-size: 3.5em;
  color: #3C3C3C;
  font-weight: 700;
  margin: 0;
  text-align: left;
  margin-top: 0%;
}

.align-right {
  text-align: right;
}


.section h2 {
  padding: 15px 40px;
  font-size: 2em;
  color: #3C3C3C;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  text-align: left;
}
.section-heading {
  font-size: 1.8em;
  font-weight: bold;
  color: #3C3C3C;
  text-align: left;
  margin-bottom: 20px;
}

.left-aligned-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  text-align: left;
  font-size: 1.2em;
  color: #000;
  line-height: 1.8;
}

.left-aligned-list li {
  margin-bottom: 12px;
}

.left {
  padding: 20px;
  margin: 4px 0 0;
  text-align: left;
  font-size: 1.5em;
  line-height: 1.8;
  max-width: 700px;
  margin-left: auto;
}


.left-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  text-align:left;
  font-size: 1.5em;
  list-style: none;
  margin-left: 800px;
  
}

.left-list li {
  margin-bottom: 12px;
}

.navigation-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 25px;
  border-top: 1px solid #EAEAEA;
}

.nav-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  text-decoration: none;
  color: #FFFFFF;
  background-color: #585858;
  border: none;
  border-radius: 20px;
  transition: background-color 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  min-width: 180px;
  text-align: center;
  flex-grow: 1;
  margin: 0 5px;
}

.nav-button:hover {
  background-color: #4A4A4A;
}

.nav-arrow {
  width: 1em;
  height: 1em;
}

.prev-button .nav-arrow {
  margin-right: 8px;
}

.next-button .nav-arrow {
  margin-left: 8px;
}

.fixed-nav-buttons {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
}

.fixed-nav-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background-color: #585858;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.fixed-nav-icon:hover {
  background-color: #4A4A4A;
}

.fixed-nav-icon img {
  width: 18px;
  height: 18px;
}
</style>