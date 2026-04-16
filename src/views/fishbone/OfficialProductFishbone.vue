<template>
  <FishboneStage :example="example" :direction="example.defaultDirection || 'RL'" />
</template>

<script>
import FishboneStage from "@/components/FishboneStage.vue";

const example = {
  key: "official-product",
  defaultDirection: "RL",
  renderKey: "product",
  stageMinWidth: 1560,
  stageHeight: 780,
  behaviors: ["zoom-canvas", "drag-canvas"],
  layoutOptions: {
    hGap: 40,
    vGap: 60,
    padding: 30,
    ribSep: -50,
  },
  styleOptions: {
    rootHeight: 90,
    rootLineHeight: 32,
    rootLabelOffsetY: 3,
    depthOneLabelOffsetY: 5,
    leafNodeWidth: 2,
  },
  tree: {
    label: "产品盈利能力低于预期",
    children: [
      {
        label: "问题描述",
        children: [
          { label: "品牌销量" },
          { label: "市场容量" },
          { label: "品牌市场份额" },
          { label: "总贡献毛利" },
        ],
      },
      {
        label: "品牌定位",
        children: [
          { label: "包装体验" },
          { label: "品牌名称识别度" },
          { label: "销售价格带是否偏离目标人群预期" },
          { label: "产品规格与使用场景匹配度" },
        ],
      },
      {
        label: "分销渠道",
        children: [
          { label: "区域覆盖" },
          { label: "渠道结构" },
          { label: "客户类型" },
          { label: "销售人员覆盖质量" },
        ],
      },
      {
        label: "市场认知",
        children: [
          { label: "区域投放权重" },
          { label: "媒体组合" },
          { label: "广告投入效率" },
          { label: "消费者对品质的长期感知" },
        ],
      },
      {
        label: "试购转化",
        children: [
          { label: "门店陈列" },
          { label: "促销类型" },
          { label: "促销时机" },
          { label: "供货保障" },
        ],
      },
      {
        label: "复购表现",
        children: [
          { label: "消费者画像" },
          { label: "使用场景" },
          { label: "使用频次" },
          { label: "因产品问题导致的退货与口碑扩散" },
        ],
      },
    ],
  },
};

export default {
  name: "OfficialProductFishbone",
  components: {
    FishboneStage,
  },
  data() {
    return {
      example,
    };
  },
};
</script>
