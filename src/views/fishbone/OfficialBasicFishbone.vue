<template>
  <FishboneStage :example="example" :direction="example.defaultDirection || 'RL'" />
</template>

<script>
import FishboneStage from "@/components/FishboneStage.vue";

const example = {
  key: "official-basic",
  defaultDirection: "RL",
  renderKey: "basic",
  stageMinWidth: 1240,
  stageHeight: 620,
  behaviors: ["drag-canvas", "zoom-canvas"],
  layoutOptions: {
    hGap: 48,
    vGap: 48,
    padding: [24, 40, 24, 40],
  },
  tree: {
    label: "质量异常原因分析",
    children: [
      {
        label: "人员",
        children: [
          { label: "培训不足" },
          { label: "交接班信息遗漏" },
          {
            label: "关键岗位连续加班导致注意力下降",
            children: [{ label: "夜班末段判断失误" }],
          },
        ],
      },
      {
        label: "设备",
        children: [
          { label: "刀具磨损" },
          { label: "点检记录缺失" },
          {
            label: "自动校准流程未按新版作业规范执行",
            children: [{ label: "班后复核被跳过" }],
          },
        ],
      },
      {
        label: "原料",
        children: [
          { label: "来料批次差异" },
          { label: "标签混料" },
          {
            label: "替代物料上线前验证周期被压缩",
            children: [{ label: "首件签核遗漏" }],
          },
        ],
      },
      {
        label: "方法",
        children: [
          { label: "工艺窗口过窄" },
          { label: "作业书未更新" },
          {
            label: "返工判定标准在不同班组之间理解不一致",
            children: [{ label: "复判口径不统一" }],
          },
        ],
      },
      {
        label: "测量",
        children: [
          { label: "抽样频次不足" },
          { label: "量具过期" },
          {
            label: "质量数据回填经常延迟到次日早会后",
            children: [{ label: "异常趋势识别滞后" }],
          },
        ],
      },
      {
        label: "环境",
        children: [
          { label: "温湿度波动" },
          { label: "照明不足" },
          {
            label: "物料周转区被临时占用造成通道拥堵",
            children: [{ label: "搬运节奏被打乱" }],
          },
        ],
      },
    ],
  },
};

export default {
  name: "OfficialBasicFishbone",
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
