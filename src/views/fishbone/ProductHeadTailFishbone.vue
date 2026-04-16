<template>
  <FishboneStage :example="example" :direction="example.defaultDirection || 'RL'" />
</template>

<script>
import FishboneStage from "@/components/FishboneStage.vue";

const example = {
  key: "product-head-tail",
  defaultDirection: "RL",
  renderKey: "product-headtail",
  stageMinWidth: 1640,
  stageHeight: 820,
  behaviors: ["zoom-canvas", "drag-canvas"],
  layoutOptions: {
    hGap: 48,
    vGap: 64,
    padding: 34,
    ribSep: -42,
  },
  styleOptions: {
    rootHeight: 102,
    rootLineHeight: 32,
    rootLabelOffsetY: 2,
    depthOneLabelOffsetY: 5,
    leafNodeWidth: 2,
  },
  decorationOptions: {
    headText: "新品利润率\n未达目标",
    headWidth: 408,
    headHeight: 184,
    tailWidth: 60,
    tailHeight: 152,
    fill: "#f7f1e8",
    stroke: "#343a45",
    textFill: "#343a45",
    lineWidth: 4,
    headFontSize: 21,
    headLineHeight: 32,
    headLabelMaxWidth: 188,
    headLabelMaxLines: 3,
    headLabelOffsetX: 20,
  },
  tree: {
    label: "新品利润率未达目标",
    children: [
      {
        label: "产品结构",
        children: [
          { label: "高毛利 SKU 占比不足" },
          { label: "组合装没有带动利润款出货" },
          { label: "规格层级过多导致选择分散" },
        ],
      },
      {
        label: "价格策略",
        children: [
          { label: "终端成交价低于计划价格带" },
          { label: "大促折扣深度过大" },
          { label: "价格锚点没有与竞品形成清晰区隔" },
        ],
      },
      {
        label: "渠道效率",
        children: [
          { label: "高返利渠道贡献偏低" },
          { label: "低效渠道动销慢" },
          { label: "重点城市陈列投入没有形成销量回报" },
        ],
      },
      {
        label: "市场投放",
        children: [
          { label: "品牌心智建立不足" },
          { label: "投放节奏集中在低转化时段" },
          { label: "内容卖点与核心使用场景连接不强" },
        ],
      },
      {
        label: "供应成本",
        children: [
          { label: "小批量采购成本偏高" },
          { label: "包装升级抬高单位成本" },
          { label: "排期波动带来加急物流费用" },
        ],
      },
      {
        label: "复购质量",
        children: [
          { label: "首购到复购周期偏长" },
          { label: "口味稳定性影响口碑" },
          { label: "售后反馈没有及时进入产品改版" },
        ],
      },
    ],
  },
};

export default {
  name: "ProductHeadTailFishbone",
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
