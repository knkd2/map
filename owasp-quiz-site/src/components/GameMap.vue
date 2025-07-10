<template>
  <div class="game-wrapper">
    <div id="game-container" ref="gameContainerRef"></div>

    <div class="ui-overlay">
      <div class="top-ui">
        <div class="resource">
          <div class="resource-icon tech-icon"></div>
          <span>科技點: <span id="tech-points">{{ gameState.techPoints }}</span></span>
        </div>
        <div class="resource">
          <div class="resource-icon cia-icon"></div>
          <span>CIA防禦值: <span id="cia-defense">{{ gameState.ciaDefense }}</span></span>
        </div>
      </div>

      <div class="bottom-ui" @click="toggleNPC">
        <div style="font-weight: bold; margin-bottom: 5px;">📡 資安助手</div>
        <div style="font-size: 12px;">點擊查看選項</div>
      </div>

      <div class="controls">
        <div><strong>控制說明:</strong></div>
        <div>↑↓←→ 移動角色</div>
        <div>Enter 檢視區域</div>
        <div>滑鼠拖動 移動視野</div>
      </div>

      <div class="info-panel" id="info-panel" :style="{ display: showInfoPanel ? 'block' : 'none' }">
        <button class="close-btn" @click="closeInfoPanel">×</button>
        <h3 id="info-title" v-html="infoPanelContent.title"></h3>
        <p id="info-description" v-html="infoPanelContent.description"></p>
        <div id="info-actions" v-html="infoPanelContent.actions"></div>
      </div>

      <button class="main-menu-btn" @click="goToMainMenu">返回主選單</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; // 引入 useRouter
import * as PIXI from 'pixi.js';

const router = useRouter(); // 初始化 useRouter

// Vue Refs for DOM elements
const gameContainerRef = ref(null);

// Reactive game state
const gameState = reactive({
  techPoints: 100,
  ciaDefense: 30,
  castleLevel: 1,
  playerX: 0,
  playerY: 0,
  cameraX: 0,
  cameraY: 0
});

// UI state
const showInfoPanel = ref(false);
const infoPanelContent = reactive({
  title: '',
  description: '',
  actions: ''
});

// PIXI variables
let app = null;
let worldContainer = null;
let mapContainer = null;
let playerContainer = null;
let playerSprite = null; 

// Game constants
const TILE_SIZE = 64;
const MAP_SIZE = 21; // 21x21 格子
const CENTER = Math.floor(MAP_SIZE / 2); // 中心格子的索引

// Keyboard state
const keys = reactive({});

// Mouse dragging state
let isDragging = false;
let dragStart = { x: 0, y: 0 }; 

// Interval variable
let techInterval = null;

// --- Functions for UI and game logic ---

// Show area info (from tile click or Enter key)
const showAreaInfo = (x, y, distance) => {
  let areaName, areaDesc, areaActions = '';

  if (distance === 0) {
    areaName = '城堡核心';
    areaDesc = `等級 ${gameState.castleLevel} 城堡<br>產出: ${gameState.castleLevel * 10} 科技點/秒`;
    areaActions = '<button onclick="window.upgradeCastle()">升級城堡</button>';
  } else if (distance === 1) {
    areaName = 'CIA 防禦城牆';
    areaDesc = 'Confidentiality, Integrity, Availability<br>資安三大核心防線';
    areaActions = '<button onclick="window.reinforceWall()">強化城牆</button>';
  } else if (distance === 2) {
    areaName = '建築區域';
    areaDesc = '可建造軍事或科技建築<br>提供防禦力或科技點產出';
    areaActions = '<button onclick="window.buildStructure()">建造建築</button>';
  } else if (distance === 6) {
    areaName = 'OWASP 防禦城牆';
    areaDesc = 'OWASP Top 10 資安威脅防線<br>抵禦外部攻擊';
    areaActions = '<button onclick="window.repairOwasp()">修復城牆</button>';
  } else if (distance > 6) {
    areaName = '未知領域';
    areaDesc = '充滿資源與危險的區域<br>需要回答問題來開發';
    areaActions = '<button onclick="window.exploreArea()">探索區域</button>';
  } else {
    areaName = '安全區域';
    areaDesc = '受到保護的區域';
  }

  infoPanelContent.title = areaName;
  infoPanelContent.description = areaDesc;
  infoPanelContent.actions = areaActions;
  showInfoPanel.value = true;

  // IMPORTANT: Attach functions to window for onclick to work from v-html
  window.upgradeCastle = upgradeCastle;
  window.reinforceWall = reinforceWall;
  window.buildStructure = buildStructure;
  window.repairOwasp = repairOwasp;
  window.exploreArea = exploreArea;
};

// Close info panel
const closeInfoPanel = () => {
  showInfoPanel.value = false;
};

// Game action functions
const upgradeCastle = () => {
  if (gameState.techPoints >= gameState.castleLevel * 100) {
    gameState.techPoints -= gameState.castleLevel * 100;
    gameState.castleLevel++;
    alert(`城堡升級至等級 ${gameState.castleLevel}！`);
  } else {
    alert('科技點不足！');
  }
  closeInfoPanel();
};

const reinforceWall = () => {
  if (gameState.techPoints >= 50) {
    gameState.techPoints -= 50;
    gameState.ciaDefense += 10;
    alert('CIA城牆強化成功！');
  } else {
    alert('科技點不足！');
  }
  closeInfoPanel();
};

const buildStructure = () => {
  alert('建築系統開發中...');
  closeInfoPanel();
};

const repairOwasp = () => {
  alert('OWASP城牆修復系統開發中...');
  closeInfoPanel();
};

const exploreArea = () => {
  alert('探索系統開發中...\n將來會有問答題目！');
  closeInfoPanel();
};

const toggleNPC = () => {
  alert('NPC功能開發中...\n將包含:\n• 小地圖\n• 成就系統\n• 背包\n• 事件記錄\n• 答題記錄');
};

// 新增的導航到主選單的方法
const goToMainMenu = () => {
  // 導航前先清理 PixiJS 資源，確保組件完全卸載
  if (app) {
    app.destroy(true); // destroy(true) 將會移除 canvas 從 DOM
    app = null;
  }
  if (techInterval) {
    clearInterval(techInterval);
    techInterval = null;
  }
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('resize', handleResize);
  
  // 導航到主選單路由
  router.push({ name: 'Home' }); // 假設你的主選單路由名稱是 'MainMenu'
};


// --- PixiJS related functions ---

// Create map tiles
const createMap = () => {
  mapContainer.removeChildren(); // 每次創建地圖時，先清空現有的子元素

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const tile = new PIXI.Graphics(); 

      const tileX = (x - CENTER) * TILE_SIZE;
      const tileY = (y - CENTER) * TILE_SIZE;

      const distanceFromCenter = Math.max(Math.abs(x - CENTER), Math.abs(y - CENTER));

      let fillColor;
      let strokeColor = null;
      let strokeWidth = 0;
      let childTextContent = null; 

      if (distanceFromCenter === 0) {
        fillColor = 0xf1c40f; 
        strokeColor = 0xe67e22;
        strokeWidth = 3;
        childTextContent = '🏰'; 
      } else if (distanceFromCenter === 1) {
        fillColor = 0x27ae60; 
        strokeColor = 0x1e8449; 
        strokeWidth = 4;
        childTextContent = 'CIA';
      } else if (distanceFromCenter === 2) {
        fillColor = 0x27ae60; 
        childTextContent = '🏗️';
      } else if (distanceFromCenter === 6) {
        fillColor = 0x3498db; 
        strokeColor = 0x2980b9; 
        strokeWidth = 3;
        childTextContent = 'OWASP';
      } else if (distanceFromCenter > 6) {
        fillColor = 0x34495e; 
        childTextContent = '?';
      } else { 
        fillColor = 0x3498db;
      }

      tile.rect(0, 0, TILE_SIZE, TILE_SIZE); 
      const alpha = (distanceFromCenter > 2 && distanceFromCenter <= 6) ? 0.8 : (distanceFromCenter > 6 ? 0.6 : 1);
      tile.fill({ color: fillColor, alpha: alpha });
      
      if (strokeColor) {
        tile.setStrokeStyle({ width: strokeWidth, color: strokeColor });
      }

      tile.x = tileX;
      tile.y = tileY;
      tile.eventMode = 'static'; 
      tile.cursor = 'pointer'; 

      tile.on('pointerdown', (event) => {
        event.stopPropagation(); 
        showAreaInfo(x, y, distanceFromCenter);
      });

      mapContainer.addChild(tile); 

      if (childTextContent) {
          const textStyle = {
              fontSize: 16, 
              fill: 0xffffff, 
              fontWeight: 'normal',
              align: 'center'
          };

          if (childTextContent === '🏰') {
              textStyle.fontSize = 32;
              textStyle.fill = 0x8b4513; 
          } else if (childTextContent === 'CIA') {
              textStyle.fontSize = 12;
              textStyle.fill = 0xffffff;
              textStyle.fontWeight = 'bold';
          } else if (childTextContent === '🏗️') {
              textStyle.fontSize = 20;
          } else if (childTextContent === 'OWASP') {
              textStyle.fontSize = 10;
              textStyle.fill = 0xffffff;
              textStyle.fontWeight = 'bold';
          } else if (childTextContent === '?') {
              textStyle.fontSize = 24;
              textStyle.fill = 0x95a5a6;
          }

          const childText = new PIXI.Text({
            text: childTextContent,
            style: textStyle
          });
          childText.anchor.set(0.5); 
          childText.x = tileX + TILE_SIZE / 2; 
          childText.y = tileY + TILE_SIZE / 2;
          mapContainer.addChild(childText); 
      }
    }
  }
};

// Create player sprite
const createPlayer = () => {
  const playerGraphic = new PIXI.Graphics(); 
  playerGraphic.circle(0, 0, 15); 
  playerGraphic.fill(0xe74c3c); 

  const playerIcon = new PIXI.Text({
      text: '👤', 
      style: {
          fontSize: 20
      }
  });
  playerIcon.anchor.set(0.5); 

  const playerContainerWrapper = new PIXI.Container();
  playerContainerWrapper.addChild(playerGraphic);
  playerContainerWrapper.addChild(playerIcon);

  playerContainer.addChild(playerContainerWrapper); 
  return playerContainerWrapper; 
};

// Game loop (每一幀都會運行)
const gameLoop = () => {
  const speed = 3;

  if (keys['ArrowUp'] || keys['KeyW']) {
    gameState.playerY -= speed;
  }
  if (keys['ArrowDown'] || keys['KeyS']) {
    gameState.playerY += speed;
  }
  if (keys['ArrowLeft'] || keys['KeyA']) {
    gameState.playerX -= speed;
  }
  if (keys['ArrowRight'] || keys['KeyD']) {
    gameState.playerX += speed;
  }

  playerSprite.x = gameState.playerX;
  playerSprite.y = gameState.playerY;

  const targetX = -gameState.playerX + app.screen.width / 2;
  const targetY = -gameState.playerY + app.screen.height / 2;

  worldContainer.x += (targetX - worldContainer.x) * 0.1;
  worldContainer.y += (targetY - worldContainer.y) * 0.1;
};


// Keyboard and Resize Handlers
const handleKeyDown = (e) => {
  keys[e.code] = true;
};

const handleKeyUp = (e) => {
  keys[e.code] = false;

  if (e.code === 'Enter') {
    const currentTileX = Math.round(gameState.playerX / TILE_SIZE);
    const currentTileY = Math.round(gameState.playerY / TILE_SIZE);
    
    const distance = Math.max(Math.abs(currentTileX), Math.abs(currentTileY));
    
    showAreaInfo(currentTileX + CENTER, currentTileY + CENTER, distance);
  }
};

const handleResize = () => {
  if (app && app.renderer) {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    worldContainer.x = -playerSprite.x + app.screen.width / 2;
    worldContainer.y = -playerSprite.y + app.screen.height / 2;
  }
};

// --- Lifecycle hooks ---
onMounted(async () => {
  app = new PIXI.Application();
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1a252f, 
    antialias: true 
  });
  console.log("PixiJS Application initialized.");

  if (gameContainerRef.value) {
    gameContainerRef.value.appendChild(app.canvas);
    console.log("PixiJS canvas appended to game-container.");
  } else {
    console.error("gameContainerRef.value is null. Cannot append PixiJS canvas. Ensure the div with ref='gameContainerRef' is present.");
    return;
  }

  worldContainer = new PIXI.Container();
  mapContainer = new PIXI.Container();
  playerContainer = new PIXI.Container();

  worldContainer.addChild(mapContainer);
  worldContainer.addChild(playerContainer);
  app.stage.addChild(worldContainer);

  createMap();
  playerSprite = createPlayer(); 
  
  worldContainer.x = -playerSprite.x + app.screen.width / 2;
  worldContainer.y = -playerSprite.y + app.screen.height / 2;

  worldContainer.eventMode = 'static'; 
  worldContainer.cursor = 'grab'; 

  worldContainer
    .on('pointerdown', (e) => {
      if (e.button === 0) {
        isDragging = true;
        dragStart.x = e.data.global.x - worldContainer.x; 
        dragStart.y = e.data.global.y - worldContainer.y;
        worldContainer.cursor = 'grabbing'; 
      }
    })
    .on('pointermove', (e) => {
      if (isDragging) {
        worldContainer.x = e.data.global.x - dragStart.x;
        worldContainer.y = e.data.global.y - dragStart.y;
      }
    })
    .on('pointerup', () => {
      isDragging = false;
      worldContainer.cursor = 'grab';
    })
    .on('pointerupoutside', () => {
      isDragging = false;
      worldContainer.cursor = 'grab';
    });

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('resize', handleResize);

  app.ticker.add(gameLoop);

  techInterval = setInterval(() => {
    gameState.techPoints += gameState.castleLevel * 10;
  }, 1000);

});

onUnmounted(() => {
  // 為了防止重複代碼和確保完整清理，將 cleanup 邏輯放在一個獨立的函數中
  // 並在 goToMainMenu 和 onUnmounted 都調用它
  performCleanup();
});

// 在組件外部或頂部定義一個清理函數，以避免重複代碼
const performCleanup = () => {
    if (worldContainer) {
        worldContainer.off('pointerdown');
        worldContainer.off('pointermove');
        worldContainer.off('pointerup');
        worldContainer.off('pointerupoutside');
    }
    
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('resize', handleResize);

    if (techInterval) {
        clearInterval(techInterval);
        techInterval = null;
    }

    if (app) {
        app.destroy(true); 
        app = null;
    }

    delete window.upgradeCastle;
    delete window.reinforceWall;
    delete window.buildStructure;
    delete window.repairOwasp;
    delete window.exploreArea;

    console.log("GameMap component unmounted and PixiJS app destroyed.");
};

</script>

<style scoped>
/* 基礎樣式，確保頁面無邊距和溢出隱藏 */
body {
  margin: 0;
  padding: 0;
  background: #2c3e50; 
  font-family: 'Arial', sans-serif;
  overflow: hidden; 
}

/* 遊戲容器的父級，確保它佔滿整個視窗 */
.game-wrapper {
  position: relative; 
  width: 100vw;
  height: 100vh;
  overflow: hidden; 
}

/* PixiJS canvas 將會被添加到這個 div 中，所以這個 div 需要有尺寸 */
#game-container {
  width: 100%;
  height: 100%;
  position: absolute; 
  top: 0;
  left: 0;
}

/* 讓 PixiJS 自動創建的 canvas 元素填滿 #game-container */
#game-container > canvas {
  display: block; 
  width: 100%; 
  height: 100%; 
}

/* UI Overlay 樣式 */
.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; 
  z-index: 1000; 
}

/* 確保這些 UI 元素可以被點擊互動 */
.top-ui, .bottom-ui, .controls, .info-panel, .main-menu-btn {
  pointer-events: auto; 
}

.top-ui {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  display: flex;
  gap: 30px;
  font-size: 18px;
  font-weight: bold;
}

.resource {
  display: flex;
  align-items: center;
  gap: 8px;
}

.resource-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.tech-icon { background: #3498db; }
.cia-icon { background: #e74c3c; }

.bottom-ui {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.bottom-ui:hover {
  background: rgba(0, 0, 0, 0.9);
}

.controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 14px;
}

.info-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 15px;
  max-width: 400px;
  text-align: center;
  z-index: 1001; 
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

/* 新增的「返回主選單」按鈕樣式 */
.main-menu-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #34495e; /* 深灰色背景 */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.main-menu-btn:hover {
  background: #2c3e50; /* 滑鼠懸停時顏色變深 */
}
</style>