<template>
  <FishboneStage :example="example" :direction="example.defaultDirection || 'RL'" />
</template>

<script>
import FishboneStage from "@/components/FishboneStage.vue";

const example = {
  key: "test-anti-case",
  defaultDirection: "LR",
  renderKey: "anti",
  stageMinWidth: 1420,
  stageHeight: 720,
  behaviors: ["zoom-canvas", "drag-canvas"],
  layoutOptions: {
    hGap: 40,
    vGap: 60,
    padding: 10,
  },
  styleOptions: {
    rootHeight: 58,
    rootLineHeight: 24,
    rootLabelOffsetY: 8,
    depthOneLabelOffsetY: 3,
    leafNodeWidth: 0,
  },
  tree: {
    label: "克服拖延",
    children: [
      {
        label: "完美主义情结",
        children: [
          { label: "正确评估事情难度" },
          { label: "先完成再完善" },
          { label: "不把所有细节都堆到开始之前" },
        ],
      },
      {
        label: "提高专注度",
        children: [
          { label: "番茄工作法" },
          { label: "限时限量一次只做一件事" },
          { label: "提高抗干扰能力减少临时打断" },
        ],
      },
      {
        label: "设定清晰的任务管理流程",
        children: [
          { label: "为完成事项建立优先级" },
          { label: "拆解成今天就能执行的具体动作" },
          { label: "收集整理排序执行反馈总结" },
        ],
      },
      {
        label: "建立积极反馈",
        children: [
          { label: "做喜欢的事情" },
          { label: "精神激励" },
          { label: "物质激励" },
        ],
      },
      {
        label: "放松享受",
        children: [
          { label: "注重过程而非结果" },
          { label: "靠需求驱动而非焦虑" },
          { label: "接受理解并允许自己逐步进入状态" },
        ],
      },
    ],
  },
};

export default {
  name: "TestAntiCaseFishbone",
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
