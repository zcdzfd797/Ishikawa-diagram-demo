import Vue from "vue";
import Router from "vue-router";
import OfficialBasicFishbone from "@/views/fishbone/OfficialBasicFishbone.vue";
import TestBasicDraggableFishbone from "@/views/fishbone/TestBasicDraggableFishbone.vue";
import OfficialAntiFishbone from "@/views/fishbone/OfficialAntiFishbone.vue";
import TestAntiCaseFishbone from "@/views/fishbone/TestAntiCaseFishbone.vue";
import OfficialProductFishbone from "@/views/fishbone/OfficialProductFishbone.vue";
import ProductHeadTailFishbone from "@/views/fishbone/ProductHeadTailFishbone.vue";

Vue.use(Router);

export const menuRoutes = [
  {
    path: "/fishbone/official-basic",
    name: "official-basic",
    component: OfficialBasicFishbone,
    meta: {
      title: "官方基础鱼骨布局",
      accent: "#2f76c7",
    },
  },
  {
    path: "/fishbone/test-basic-draggable",
    name: "test-basic-draggable",
    component: TestBasicDraggableFishbone,
    meta: {
      title: "官方测试基础鱼骨布局",
      accent: "#e48a3e",
    },
  },
  {
    path: "/fishbone/official-anti",
    name: "official-anti",
    component: OfficialAntiFishbone,
    meta: {
      title: "反拖延决策鱼骨图",
      accent: "#815ef4",
    },
  },
  {
    path: "/fishbone/test-anti-case",
    name: "test-anti-case",
    component: TestAntiCaseFishbone,
    meta: {
      title: "官方测试决策鱼骨图",
      accent: "#18a6a6",
    },
  },
  {
    path: "/fishbone/official-product",
    name: "official-product",
    component: OfficialProductFishbone,
    meta: {
      title: "产品盈利分析鱼骨图",
      accent: "#203556",
    },
  },
  {
    path: "/fishbone/product-head-tail",
    name: "product-head-tail",
    component: ProductHeadTailFishbone,
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
