<script setup>
import { ref, onMounted, reactive } from 'vue'; // 匯入 reactive
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const user = ref(null);
const router = useRouter();
const items = ref([
  // ... (你的項目資料，可以添加中文 desc)
  { id: 1, title: 'A01: Broken Access Control', desc: '權限控制失敗：應用程式未能正確限制使用者的行為，導致未經授權的存取或操作。可能導致敏感資訊的洩露、數據的修改或刪除等。' },
  { id: 2, title: 'A02: Cryptographic Failures', desc: '加密機制失效：與加密相關的失敗，例如使用弱演算法、未加密傳輸敏感資料等。' },
  { id: 3, title: 'A03: Injection', desc: '注入攻擊：例如 SQL、NoSQL、OS、LDAP Injection 等，攻擊者可插入惡意資料，欺騙解釋器執行非預期命令或存取資料。' },
  { id: 4, title: 'A04: Insecure Design', desc: '不安全設計：設計階段就存在的安全缺陷，缺少或無效的控制設計，需要進行威脅建模、安全設計模式和原則。' },
  { id: 5, title: 'A05: Security Misconfiguration', desc: '安全設定錯誤：如使用預設帳密、暴露錯誤訊息、雲端服務設定不當等。' },
  { id: 6, title: 'A06: Vulnerable and Outdated Components', desc: '使用危險或過舊的元件：使用已知有漏洞的函式庫、框架或其他軟體元件。' },
  { id: 7, title: 'A07: Identification and Authentication Failures', desc: '認證及驗證機制失效：身份驗證和會話管理功能實作不當，可能導致密碼、金鑰或會話令牌被盜用。' },
  { id: 8, title: 'A08: Software and Data Integrity Failures', desc: '軟體及資料完整性失效：程式碼與基礎架構未能防止完整性被破壞，例如軟體更新、敏感資料和 CI/CD 管道中的不安全的反序列化或完整性檢查缺失。' },
  { id: 9, title: 'A09: Security Logging and Monitoring Failures', desc: '安全記錄及監控失效：日誌記錄與監控不足，導致難以及時發現、調查和應對安全事件。' },
  { id: 10, title: 'A10: Server-Side Request Forgery', desc: '伺服器端請求偽造 (SSRF)：允許攻擊者誘導伺服器端應用程式向非預期的位置發送請求。' },
]);

// --- 卡片翻轉狀態管理 ---
const flippedStates = reactive({}); // 使用 reactive 追蹤物件屬性變化

// 初始化每張卡片的翻轉狀態
onMounted(() => {
  items.value.forEach(item => {
    flippedStates[item.id] = false; // 初始狀態：未翻轉
  });

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
  if (top10EntriesRef.value) {
    top10EntriesRef.value.style.cursor = 'grab'; // 設定初始拖曳鼠標樣式
  }
});

// --- 切換翻轉狀態的函數 ---
const toggleFlip = (id) => {
  // 只有在非拖曳狀態下才翻轉
  if (!isDragging.value && !ignoreClick.value) {
     flippedStates[id] = !flippedStates[id];
  }
};

// --- 拖曳邏輯 (稍微修改以防止拖曳時翻轉) ---
const top10EntriesRef = ref(null);
const isDragging = ref(false); // 是否正在拖曳
const startX = ref(0); // 拖曳起始 X 座標
const scrollLeft = ref(0); // 容器原始滾動位置
const ignoreClick = ref(false); // 拖曳後忽略單擊事件的標誌
let dragMoved = false; // 追蹤拖曳過程中滑鼠是否實際移動

const startDrag = (event) => {
  // 如果需要，可以防止在卡片內的按鈕或連結上觸發拖曳
  // if (event.target.closest('button, a')) return;

  isDragging.value = true;
  dragMoved = false; // 重置移動追蹤器
  startX.value = event.pageX - top10EntriesRef.value.offsetLeft;
  scrollLeft.value = top10EntriesRef.value.scrollLeft;
  top10EntriesRef.value.style.cursor = 'grabbing'; // 設定拖曳中鼠標樣式
  top10EntriesRef.value.style.userSelect = 'none'; // 拖曳時禁止選取文字
};

const onDrag = (event) => {
  if (!isDragging.value) return;
  event.preventDefault();
  dragMoved = true; // 標記發生了拖曳
  const currentX = event.pageX - top10EntriesRef.value.offsetLeft;
  const walk = (currentX - startX.value) * 1.5; // 可以調整此乘數來改變滾動速度
  top10EntriesRef.value.scrollLeft = scrollLeft.value - walk;
};

const stopDrag = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (top10EntriesRef.value) {
    top10EntriesRef.value.style.cursor = 'grab'; // 恢復拖曳鼠標樣式
    top10EntriesRef.value.style.userSelect = 'auto'; // 恢復文字選取
  }
  // 如果發生了拖曳，設定標誌以忽略隨後的 click 事件
  ignoreClick.value = dragMoved;
  // 短暫延遲後重置 ignoreClick 標誌，允許下一次點擊
  setTimeout(() => {
    ignoreClick.value = false;
  }, 50); // 小延遲以確保 click 事件被忽略
};


const logout = async () => {
  try {
    await signOut(auth);
    router.push('/');
  } catch (error) {
    console.error('登出失敗:', error);
  }
};
</script>

<template>
  <div class="owasp-home">
    <div v-if="user" class="user-info">
      已登入
      <button @click="logout" class="logout-button">登出</button>
    </div>
    <router-link v-else to="/login" class="login-link">登入</router-link>
    <div class="nav-marquee-container">
      <nav class="nav-marquee-content">
        <ul>
          <li v-for="i in 15" :key="'original-' + i"></li>
          <li v-for="i in 15" :key="'copy-' + i"></li>
        </ul>
      </nav>
    </div>
    <div class="header">
      <h1>資安教育網站</h1>
      <div class="marquee-container">
        <div class="marquee-content">
          最新資安資訊！保護您的數位生活，從了解 OWASP Top 10 開始！網站定期更新，敬請關注！
        </div>
      </div>
      <div class="nav-marquee-container">
        <nav class="nav-marquee-content">
          <ul>
            <li v-for="i in 15" :key="'original-' + i"></li>
            <li v-for="i in 15" :key="'copy-' + i"></li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="divider"></div>

    <section class="info-card">
        <div class="info-header">安全三要素 <strong>CIA</strong></div>
        <div class="info-body">
          <div class="info-left">
            <p>CIA 資訊安全三要素是常見的模型，</p>
            <p>構成安全系統開發的基礎。</p><p>它們是用來尋找弱點和找出建立解決方案的方法。</p>
          </div>
          <div class="info-right">
            <div class="cia-item">
              <h2><strong><span class="underline">C</span>onfidentiality　機密性</strong>
              </h2>
              <p>僅授權的使用者才能存取資料，保護資訊不被未經授權者揭露或取得。</p>
            </div>
            <div class="cia-item">
              <h2><strong><span class="underline">I</span>ntegrity　完整性</strong></h2>
              <p>確保資料未經授權不得修改，且修改必須透過授權機制進行。</p>
            </div>
            <div class="cia-item">
              <h2><strong><span class="underline">A</span>vailability　可用性</strong></h2>
              <p>確保合法使用者在需要時能夠存取系統與資訊，防止資源被拒絕使用。</p>
            </div>
          </div>
        </div>
    </section>
    <div class="divider"></div>
      <div class="concept-group">
      <div class="info-header">雜湊 <strong>Hash Function</strong></div>
        <div class="info-body">
          <div class="info-left">
            <p>雜湊是一種對資料的處離方式</p>
          </div>
          <div class="right">
            <p><strong>特性：</strong></p>
            <ul>
              <li><strong>單向性：</strong> 無法從雜湊值推回原始訊息。</li>
              <li><strong>不可逆：</strong> 雜湊值無法還原原始輸入。</li>
              <li><strong>抗碰撞性：</strong> 難以找到兩筆資料產生相同雜湊值。</li>
            </ul>
            <div class="divider"></div>
            <p><strong>常見的雜湊演算法：</strong></p>
            <ul class="hash-list">
              <li>SHA-0</li>
              <li>SHA-1（不安全）</li>
              <li>SHA-256</li>
              <li>RIPEMD-160</li>
              <li>MD-5（不安全）</li>
            </ul>
          </div>
        </div>
    </div>

    <div class="divider"></div>
      <div class="owasp-game-container">
        <section class="owasp-top10">
          <h2>OWASP TOP10</h2>
          <div
            ref="top10EntriesRef"
            class="top10-entries"
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
            @click.capture="ignoreClick && $event.stopPropagation()"
            >>
            <div
              v-for="item in items"
              :key="item.id"
              class="entry-container"
              :class="{ 'is-flipped': flippedStates[item.id] }"
              @click="toggleFlip(item.id)"
            >
              <div class="entry-flipper">
                <div class="entry entry-front">
                  <span>{{ item.id.toString().padStart(2, '0') }}</span>
                  <p class="title">{{ item.title }}</p>
                </div>
                <div class="entry entry-back">
                  <p class="desc">{{ item.desc }}</p>
                  <router-link
                    :to="`/A${String(item.id).padStart(2, '0')}`"
                    class="learn-more-button"
                    @click.stop>
                    了解更多
                  </router-link>

                </div>
              </div>
            </div>
            </div>
        </section>

        <div class="game-section-container">
          <h3>小遊戲</h3>
          <img src="@/assets/small-game.png" alt="小遊戲截圖" class="small-game-image">
          <router-link to="/game" class="save-button">打開</router-link>
        </div>
      </div>

    <section class="about-us">
      <h2>關於我們</h2>
        <p>Lorem ipsum dolor sit amet consectetur. Nullam dolor est aliquam in tortor fames in neque consectetur.</p>
    </section>
  </div>
</template>

<style scoped>
/* ... (保留所有現有樣式) ... */

/* --- 為翻轉卡片新增/修改樣式 --- */

.top10-entries {
  /* 添加 perspective 以產生 3D 效果 */
  perspective: 1000px;
   /* 確保有足夠的 padding 使卡片不接觸邊緣 */
  padding-left: 20px;
  padding-right: 20px;
}

/* 每張卡片的容器，處理 perspective 和翻轉狀態 */
.entry-container {
  width: 300px; /* 匹配原始 entry 寬度 */
  height: 250px; /* 匹配原始 entry 高度 */
  flex-shrink: 0; /* 防止卡片在 flex 容器中縮小 */
  cursor: pointer; /* 指示可點擊 */
  position: relative; /* 為絕對定位的子元素提供基準 */
}

/* 實際進行翻轉的元素 */
.entry-flipper {
  width: 100%;
  height: 100%;
  transition: transform 0.6s; /* 翻轉動畫 */
  transform-style: preserve-3d; /* 保留 3D 轉換 */
  position: relative;
}

/* 當容器有 .is-flipped class 時，應用翻轉旋轉 */
.entry-container.is-flipped .entry-flipper {
  transform: rotateY(180deg);
}

/* 正面和背面的基礎樣式 */
.entry-front,
.entry-back {
  position: absolute; /* 在容器內重疊 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden; /* 隱藏背面 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  border-radius: 5px; /* 保留圓角 */
  padding: 15px; /* 保留內距 */
  box-sizing: border-box; /* 將 padding 包含在寬高內 */
  overflow: hidden; /* 隱藏溢出的內容 */
}

/* 正面特定樣式 (基於您原始的 .entry) */
.entry-front {
  background-color: #888; /* 原始背景色 */
  color: #fff; /* 原始文字顏色 */
  font-size: 1.4em;
  text-align: center;
  z-index: 2; /* 確保正面初始在上面 */
   transform: rotateY(0deg); /* 明確面向前方 */
}

.entry-front span {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 8px;
}

.entry-front .title {
  font-size: 1em;
  margin: 0;
  word-break: break-word; /* 長標題換行 */
}


/* 背面特定樣式 (匹配您圖片中的樣式) */
.entry-back {
  background-color: #e0e0e0; /* 類似圖片的淺灰色背景 */
  color: #333; /* 深色文字 */
  transform: rotateY(180deg); /* 初始翻轉過去 */
  justify-content: space-between; /* 在文字和按鈕之間留空間 */
  align-items: flex-start; /* 文字左對齊 */
  text-align: left;
  font-size: 1.5em; /* 調整描述文字大小 */
  line-height: 1.4;
  
}

.entry-back .desc {
  margin: 0 0 10px 0; /* 描述下方留空間 */
  flex-grow: 1; /* 讓描述佔用可用空間 */
  overflow-y: auto; /* 如果描述過長，允許滾動 */
  
}

/* 背面「了解更多」按鈕樣式 */
.learn-more-button {
  display: inline-block; /* 行內塊元素 */
  padding: 6px 12px; /* 內距 */
  background-color: #fff; /* 按鈕白色背景 */
  color: #555; /* 按鈕深色文字 */
  border: 1px solid #ccc; /* 邊框 */
  border-radius: 4px; /* 圓角 */
  text-decoration: none; /* 去除連結底線 */
  align-self: flex-end; /* 將按鈕置於右下角 */
  margin-top: auto; /* 將按鈕推到底部 */
  transition: background-color 0.2s ease, border-color 0.2s ease; /* 過渡效果 */
}

.learn-more-button:hover {
  background-color: #f6f5fbaf; /* 滑鼠懸停背景色 */
  border-color: #bbb; /* 滑鼠懸停邊框色 */
}




/* 防止在容器本身應用 hover 縮放效果 */
.entry-container:hover {
    transform: none; /* 禁用容器上的縮放 */
}

/* --- 保留其餘現有的 CSS --- */
.divider {
  height: 2px;
  background-color: #ccc;
  margin: 40px 0;
}

body {
  font-family: "Noto Sans TC", sans-serif;
  background: #f5f5f5;
  margin: 0;
  padding: 20px;
}

.info-header{
  text-align: left;
  font-size: 3em;
}

.info-body {
  display: flex;
  gap: 32px;
}

.info-left {
  padding: 20px;
  flex: 1;
  text-align: left;
}

.info-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  text-align:left;
  font-size: 1.5em;
}

.cia-item p {
  margin: 4px 0 0;
}
.underline {
  text-decoration: underline;
}
.concept-group {
  text-align: left;
}

.content-group h3 {
  font-weight: bold;
  font-size: 3em;
}

.highlight {
  font-style: italic;
}

.right{
  flex: 1;
  gap: 20px;
  font-size: 1.5em;
}

.hash-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  list-style: none;
  padding-left: 0;
}
.hash-list li {
  min-width: 120px;
}

.owasp-game-container {
  background-color: rgba(0, 0, 0, 0.555);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.owasp-top10 {
  text-align: left;
  margin-bottom: 20px;
}

.owasp-top10 h2 {
  color: #eee;
  margin-bottom: 15px;
  text-align: center;
  font-size: 3em;

}

.top10-entries {
  display: flex;
  gap: 10px;
  overflow-x: auto; /* 允許水平滾動 */
  padding-bottom: 10px; /* 底部留空間給滾動條或陰影 */
  -webkit-overflow-scrolling: touch; /* iOS 滾動優化 */
  width: 100%;
  box-sizing: border-box;
  /* padding-left: 20px; */ /* 上面已處理 */
  /* padding-right: 20px; */ /* 上面已處理 */
  cursor: grab; /* 初始鼠標為抓取手勢 */
  /* user-select: none; */ /* 拖曳時動態應用 */
  scrollbar-width: none;
}


/* 小遊戲區塊 */
.game-section-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  text-align: center;
  color: #eee;
}

.game-section-container h3 {
  color: #eee;
  margin-bottom: 10px;
  font-size: 3em;
}

.small-game-image {
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}

.save-button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1em;
  color: #fff;
  background-color: #284ca7; /* 儲存按鈕背景色 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.save-button:hover {
  background-color: #218838; /* 儲存按鈕滑鼠懸停背景色 */
}

/* 通用佈局, 登入/登出等 */
.owasp-home {
  position: relative;
  padding: 20px;
  text-align: center;
  font-family: sans-serif; /* 可以考慮換回 "Noto Sans TC" */
  color: #333;
}

.login-link, .user-info {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  font-size: 1rem;
}

.login-link {
  color: #007bff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  border-radius: 5px;
  background-color: white;
}

.login-link:hover {
  text-decoration: underline;
  background-color: #f0f8ff;
}

.user-info {
  color: green;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-button:hover {
  background-color: #c82333;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 標題靠左 */
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 10em; /* 標題字體大小 */
  color:#555;
}

.marquee-container {
  width: 100%;
  overflow: hidden;
  background-color: #f0f0f0; /* 跑馬燈背景色 */
  padding: 10px 0;
  margin-bottom: 10px;
}

.marquee-content {
  white-space: nowrap; /* 不換行 */
  padding-left: 100%; /* 從右邊開始 */
  animation: marquee 20s linear infinite; /* 動畫效果 */
  color: #333;
  font-size: 5em; /* 跑馬燈文字大小 */
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%); /* 移動到左邊消失 */
  }
}

.nav-marquee-container {
  width: 100%;
  overflow: hidden;
  margin-bottom: 20px;
}

.nav-marquee-content {
  animation: navMarquee 30s linear infinite; /* 導航塊動畫 */
}

.nav-marquee-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex; /* 橫向排列 */
  width: fit-content; /* 寬度由內容決定 */
  /* transform: translateX(0%); */ /* 動畫會處理 transform */
}

.nav-marquee-content ul li {
  background-color: #ddd; /* 導航塊背景色 */
  width: 80px; /* 導航塊寬度 */
  height: 20px; /* 導航塊高度 */
  margin-right: 10px; /* 導航塊間距 */
  border-radius: 3px; /* 導航塊圓角 */
  flex-shrink: 0; /* 防止縮小 */
}

@keyframes navMarquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%); /* 因為有兩倍的 li，所以移動 50% 實現無限循環 */
  }
}

/* 關於我們區塊 */
.about-us {
  background-color: #eee;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  text-align: left;
}

.about-us h2 {
  margin-top: 0;
  color: #555;
  font-size: 2.5em;
}

.about-us p {
  font-size: 2em;
  line-height: 1.6;
  color: #333;
}

</style>