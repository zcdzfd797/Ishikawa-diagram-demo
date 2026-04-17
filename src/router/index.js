import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const menuRoutes = [
  {
    path: "/fishbone/official-basic",
    name: "official-basic",
    component: () => import("@/views/fishbone/OfficialBasicFishbone.vue"),
    meta: {
      title: "官方基础鱼骨布局",
      accent: "#2f76c7",
    },
  },
  {
    path: "/fishbone/test-basic-draggable",
    name: "test-basic-draggable",
    component: () => import("@/views/fishbone/TestBasicDraggableFishbone.vue"),
    meta: {
      title: "官方测试基础鱼骨布局",
      accent: "#e48a3e",
    },
  },
  {
    path: "/fishbone/official-anti",
    name: "official-anti",
    component: () => import("@/views/fishbone/OfficialAntiFishbone.vue"),
    meta: {
      title: "反拖延决策鱼骨图",
      accent: "#815ef4",
    },
  },
  {
    path: "/fishbone/test-anti-case",
    name: "test-anti-case",
    component: () => import("@/views/fishbone/TestAntiCaseFishbone.vue"),
    meta: {
      title: "官方测试决策鱼骨图",
      accent: "#18a6a6",
    },
  },
  {
    path: "/fishbone/official-product",
    name: "official-product",
    component: () => import("@/views/fishbone/OfficialProductFishbone.vue"),
    meta: {
      title: "产品盈利分析鱼骨图",
      accent: "#203556",
    },
  },
  {
    path: "/fishbone/product-head-tail",
    name: "product-head-tail",
    component: () => import("@/views/fishbone/ProductHeadTailFishbone.vue"),
    meta: {
      title: "产品盈利分析鱼骨图（鱼头鱼尾强化版）",
      accent: "#f08f56",
    },
  },
];

const router = new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      redirect: menuRoutes[0].path,
    },
    ...menuRoutes,
    {
      path: "*",
      redirect: menuRoutes[0].path,
    },
  ],
});

export default router;
