<template>
  <FishboneStage :example="example" :direction="example.defaultDirection || 'RL'" />
</template>

<script>
import FishboneStage from "@/components/FishboneStage.vue";

const example = {
  key: "official-anti",
  defaultDirection: "LR",
  renderKey: "anti",
  stageMinWidth: 1480,
  stageHeight: 760,
  behaviors: ["zoom-canvas", "drag-canvas"],
  layoutOptions: {
    hGap: 40,
    vGap: 60,
    padding: 10,
  },
  styleOptions: {
    rootHeight: 70,
    rootLineHeight: 24,
    rootLabelOffsetY: 4,
    depthOneLabelOffsetY: 5,
    leafNodeWidth: 2,
  },
  tree: {
    label: "克服拖延与执行焦虑",
    children: [
      {
        label: "完美主义倾向",
        children: [
          { label: "正确评估任务的真实难度" },
          { label: "先完成再持续打磨" },
          { label: "不要把第一次输出要求成最终版本" },
        ],
      },
      {
        label: "提高专注度",
        children: [
          { label: "番茄工作法" },
          { label: "限时限量一次只推进一个关键动作" },
          { label: "主动减少消息打断与无效会议干扰" },
        ],
      },
      {
        label: "设定清晰任务流程",
        children: [
          { label: "先拆成今天就能完成的最小动作" },
          { label: "对完成事项建立优先级排序" },
          { label: "收集整理排序执行复盘形成闭环" },
        ],
      },
      {
        label: "建立正向反馈",
        children: [
          { label: "给阶段成果安排即时奖励" },
          { label: "将抽象目标转成可见进度条" },
          { label: "与同伴公开同步进展形成推动" },
        ],
      },
      {
        label: "放松与接纳",
        children: [
          { label: "更关注过程而非一次结果" },
          { label: "让行动由需求驱动而不是焦虑驱动" },
          { label: "接受自己会慢热但不会停下" },
        ],
      },
    ],
  },
};

export default {
  name: "OfficialAntiFishbone",
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
