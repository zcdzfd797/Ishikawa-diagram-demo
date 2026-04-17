import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const menuRoutes = [
  {
    path: "/fishbone/official-basic",
    name: "official-basic",
    component: () => import("@/views/fishbone/OfficialBasicFishbone.vue"),
    meta: {
      title: "基础版",
      accent: "#2f76c7",
    },
  },
  {
    path: "/fishbone/test-basic-draggable",
    name: "test-basic-draggable",
    component: () => import("@/views/fishbone/TestBasicDraggableFishbone.vue"),
    meta: {
      title: "拖拽版",
      accent: "#e48a3e",
    },
  },
  {
    path: "/fishbone/official-anti",
    name: "official-anti",
    component: () => import("@/views/fishbone/OfficialAntiFishbone.vue"),
    meta: {
      title: "逆向版",
      accent: "#815ef4",
    },
  },
  {
    path: "/fishbone/official-product",
    name: "official-product",
    component: () => import("@/views/fishbone/OfficialProductFishbone.vue"),
    meta: {
      title: "综合版",
      accent: "#203556",
    },
  },
  {
    path: "/fishbone/product-head-tail",
    name: "product-head-tail",
    component: () => import("@/views/fishbone/ProductHeadTailFishbone.vue"),
    meta: {
      title: "鱼头鱼尾版",
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
