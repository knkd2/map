import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import A01 from '@/views/owaspA01.vue';
import A02 from '@/views/owaspA02.vue';
import A03 from '@/views/owaspA03.vue';
// import A04 from '@/views/owaspA04.vue';
// import A05 from '@/views/owaspA05.vue';
// import A06 from '@/views/owaspA06.vue';
// import A07 from '@/views/owaspA07.vue';
// import A08 from '@/views/owaspA08.vue';
// import A09 from '@/views/owaspA09.vue';
// import A10 from '@/views/owaspA10.vue';

// 導入 GameMap.vue 組件
import GameMap from '@/components/GameMap.vue'; // 假設 GameMap.vue 放在 src/components/ 下

const routes = [
  { path: '/', redirect: '/home' }, // 將根路徑重定向到 /home
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/home', name: 'Home', component: Home }, // 可以將原本的根路徑改為 /home
  { path: '/A01', name: 'owaspA01', component: A01 }, // 使用正確的組件變數名稱
  { path: '/A02', name: 'owaspA02', component: A02 },
  { path: '/A03', name: 'owaspA03', component: A03 },
  /* { path: '/A04', name: 'owaspA04', component: A04 },
   { path: '/A05', name: 'owaspA05', component: A05 },
   { path: '/A06', name: 'owaspA06', component: A06 },
   { path: '/A07', name: 'owaspA07', component: A07 },
   { path: '/A08', name: 'owaspA08', component: A08 },
   { path: '/A09', name: 'owaspA09', component: A09 },
   { path: '/A10', name: 'owaspA10', component: A10 },*/

  // 添加 GameMap 的路由規則
  { path: '/game', name: 'GameMap', component: GameMap },
];

const router = createRouter({
  history: createWebHistory(),
  routes, // 使用簡寫
  scrollBehavior() {
    return { top: 0 }
  }
});

export default router;