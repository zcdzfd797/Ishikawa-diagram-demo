<template>
  <div class="fishbone-stage-wrap">
    <div ref="stageShell" class="fishbone-stage-scroll">
      <div v-show="!renderErrorMessage" ref="stageHost" class="fishbone-graph-stage"></div>
      <div v-if="renderErrorMessage" class="fishbone-demo-error">
        <div>
          <strong>G6 渲染失败</strong>
          <p>{{ renderErrorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as G6 from "@antv/g6";

const BRANCH_COLORS = [
  "#1783FF",
  "#F08F56",
  "#D580FF",
  "#00C9C9",
  "#7863FF",
  "#DB9D0D",
  "#60C42D",
  "#FF80CA",
  "#2491B3",
  "#17C76F",
];

let measureContext = null;

function getMeasureContext() {
  if (measureContext) {
    return measureContext;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  measureContext = canvas.getContext("2d");
  return measureContext;
}

function measureTextWidth(text, style) {
  const content = String(text == null ? "" : text);
  const options = style || {};
  const context = getMeasureContext();

  if (!context) {
    return content.length * ((Number(options.fontSize) || 16) * 0.6);
  }

  context.font =
    String(options.fontWeight || 400) +
    " " +
    String(Number(options.fontSize) || 16) +
    "px " +
    String(options.fontFamily || "sans-serif");

  return content.split(/\n/g).reduce((width, line) => {
    return Math.max(width, context.measureText(line || " ").width);
  }, 0);
}

function hexToRgb(hex) {
  let safeHex = String(hex || "#000000").replace("#", "");

  if (safeHex.length === 3) {
    safeHex = safeHex
      .split("")
      .map((part) => part + part)
      .join("");
  }

  const value = parseInt(safeHex, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function withAlpha(hex, alpha) {
  const rgb = hexToRgb(hex);
  return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function visitTree(node, visitor, depth, parent) {
  const children = Array.isArray(node.children) ? node.children : [];

  visitor(node, depth, parent);

  children.forEach((child) => {
    visitTree(child, visitor, depth + 1, node);
  });
}

function assignNodeIds(tree, prefix) {
  function loop(node, depth, path) {
    node.id = prefix + "-" + path.join("-");
    node.depth = depth;
    node.children = Array.isArray(node.children) ? node.children : [];

    node.children.forEach((child, index) => {
      loop(child, depth + 1, path.concat(index));
    });
  }

  loop(tree, 0, [0]);
  return tree;
}

function assignColorByBranch(tree, palette) {
  const colors = palette || BRANCH_COLORS;
  let colorIndex = 0;

  function loop(node, depth, branchColor, branchIndex) {
    let currentColor = branchColor || null;
    let currentIndex = branchIndex;

    if (depth === 1) {
      currentColor = colors[colorIndex % colors.length];
      currentIndex = colorIndex % colors.length;
      colorIndex += 1;
    }

    node.branchColor = currentColor;
    node.branchIndex = currentIndex;

    (node.children || []).forEach((child) => {
      loop(child, depth + 1, currentColor, currentIndex);
    });
  }

  loop(tree, 0, null, -1);
  return tree;
}

function arrangeEdgeZIndex(graphData) {
  if (!graphData || !Array.isArray(graphData.nodes) || !Array.isArray(graphData.edges)) {
    return graphData;
  }

  const oneLevelNodes = graphData.nodes.filter((node) => node.depth === 1);
  const zIndexMap = {};

  oneLevelNodes.forEach((node, index) => {
    zIndexMap[node.id] = oneLevelNodes.length - index;
  });

  graphData.edges.forEach((edge) => {
    if (zIndexMap[edge.target]) {
      edge.data = edge.data || {};
      edge.data.zIndex = zIndexMap[edge.target];
    }
  });

  return graphData;
}

function getOutsideLabelPlacement(direction) {
  return direction === "LR" ? "right" : "left";
}

function buildGraphData(example) {
  if (typeof G6.treeToGraphData !== "function") {
    throw new Error("G6 treeToGraphData is not available.");
  }

  const tree = assignColorByBranch(assignNodeIds(deepClone(example.tree), example.key));
  const graphData = G6.treeToGraphData(tree, {
    getNodeData(node, depth) {
      return {
        id: node.id,
        depth: depth,
        children: (node.children || []).map((child) => child.id),
        data: {
          label: node.label,
          branchColor: node.branchColor,
          branchIndex: node.branchIndex,
        },
      };
    },
    getEdgeData(source, target) {
      return {
        id: source.id + "->" + target.id,
        source: source.id,
        target: target.id,
        data: {
          branchColor: target.branchColor || source.branchColor || "#99ADD1",
        },
      };
    },
  });

  return arrangeEdgeZIndex(graphData);
}

const engine = {
  BRANCH_COLORS,
  measureTextWidth,
  withAlpha,
  deepClone,
  visitTree,
  assignColorByBranch,
  arrangeEdgeZIndex,
  buildGraphData,
  getOutsideLabelPlacement,
};

const ELEMENT_FONT =
  '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const GRAPH_FONT = ELEMENT_FONT;
const CARD_FONT = ELEMENT_FONT;

let extensionsReady = false;

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
  data() {
    return {
      graph: null,
      renderId: 0,
      renderErrorMessage: "",
      queueRender: null,
      handleResize: null,
      resizeObserver: null,
      example: example,};
  },
  computed: {
    direction() {
      return (this.example && this.example.defaultDirection) || "RL";
    },
  },
  watch: {
    example() {
      if (this.queueRender) {
        this.queueRender();
      }
    },
    direction() {
      if (this.queueRender) {
        this.queueRender();
      }
    },
  },
  mounted() {
    this.queueRender = this.debounce(() => {
      this.renderGraph();
    }, 40);
    this.handleResize = this.debounce(() => {
      this.renderGraph();
    }, 120);
    window.addEventListener("resize", this.handleResize);

    if (typeof ResizeObserver !== "undefined" && this.$refs.stageShell) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.queueRender) {
          this.queueRender();
        }
      });
      this.resizeObserver.observe(this.$refs.stageShell);
    }

    this.$nextTick(() => {
      this.renderGraph();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.cleanup();
  },
  methods: {
    debounce(fn, wait) {
      let timer = null;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, wait);
      };
    },
    cleanup() {
      if (this.graph && typeof this.graph.destroy === "function" && !this.graph.destroyed) {
        this.graph.destroy();
      }
      this.graph = null;
    },
    ensureExtensions() {
      if (
        extensionsReady ||
        typeof G6.register !== "function" ||
        !G6.ExtensionCategory ||
        typeof G6.Rect !== "function"
      ) {
        return;
      }

      class FishHeadNode extends G6.Rect {
        getKeyStyle(attributes) {
          const style = super.getKeyStyle(attributes);
          return Object.assign({}, style, {
            fill: "transparent",
            stroke: "transparent",
            lineWidth: 0,
          });
        }

        getHeadShapeStyle(attributes) {
          const style = this.getGraphicStyle(attributes);
          const size = this.getSize(attributes);
          const width = size[0];
          const height = size[1];
          const halfW = width / 2;
          const halfH = height / 2;
          const direction = attributes.headDirection || "right";
          const mirror = direction === "right" ? 1 : -1;
          const baseX = -halfW;
          const tipX = halfW;
          const browX = baseX + width * 0.2;
          const cheekX = baseX + width * 0.56;
          const jawX = tipX - width * 0.14;
          const lipX = tipX - width * 0.028;
          const mouthInsetX = tipX - width * 0.078;
          const upperLipY = -height * 0.04;
          const lowerLipY = height * 0.04;
          const upperJawY = -height * 0.3;
          const lowerJawY = height * 0.3;
          const topY = -halfH * 0.93;
          const bottomY = halfH * 0.93;
          const path = [
            ["M", mirror * baseX, topY],
            [
              "C",
              mirror * browX,
              -halfH * 1.03,
              mirror * cheekX,
              -halfH * 0.96,
              mirror * jawX,
              upperJawY,
            ],
            ["Q", mirror * lipX, -height * 0.15, mirror * tipX, upperLipY],
            ["L", mirror * mouthInsetX, 0],
            ["L", mirror * tipX, lowerLipY],
            ["Q", mirror * lipX, height * 0.15, mirror * jawX, lowerJawY],
            [
              "C",
              mirror * cheekX,
              halfH * 0.96,
              mirror * browX,
              halfH * 1.03,
              mirror * baseX,
              bottomY,
            ],
            ["Z"],
          ];

          return {
            d: path,
            fill: style.fill,
            fillOpacity: style.fillOpacity,
            stroke: style.stroke,
            lineWidth: style.lineWidth,
            lineJoin: "round",
            lineCap: "round",
          };
        }

        render(attributes = this.parsedAttributes, container = this) {
          this._drawKeyShape(attributes, container);
          this.upsert("head-shape", "path", this.getHeadShapeStyle(attributes), container);
          this.drawLabelShape(attributes, container);
        }
      }

      G6.register(G6.ExtensionCategory.NODE, "fish-head-node", FishHeadNode);
      extensionsReady = true;
    },
    resolveStage() {
      const host = this.$refs.stageHost;
      const scrollShell = this.$refs.stageShell;
      const minWidth = Number(this.example.stageMinWidth) || 1200;
      const baseHeight = Number(this.example.stageHeight) || 620;
      const viewportHeight = window.innerHeight || baseHeight;
      const availableHeight = (scrollShell && scrollShell.clientHeight) || 0;
      const width = (scrollShell && scrollShell.clientWidth) || (host && host.clientWidth) || minWidth;
      let height = baseHeight;

      if (!host || !scrollShell) {
        return null;
      }

      if (window.innerWidth > 1180) {
        height = availableHeight || Math.max(560, viewportHeight - 140);
      } else if (window.innerWidth > 720) {
        height = Math.max(baseHeight, viewportHeight - 220);
      } else {
        height = Math.max(500, viewportHeight - 180);
      }

      host.style.width = width + "px";
      host.style.height = height + "px";
      host.innerHTML = "";
      return { host, width, height };
    },
    normalizePoint(point) {
      if (Array.isArray(point)) {
        return point;
      }
      if (point && typeof point.x === "number" && typeof point.y === "number") {
        return [point.x, point.y];
      }
      return [0, 0];
    },
    getCanvasPoint(graph, id) {
      if (!graph || typeof graph.getElementPosition !== "function" || !id) {
        return null;
      }
      try {
        return this.normalizePoint(graph.getElementPosition(id));
      } catch (error) {
        return null;
      }
    },
    createProductHeadTailMarkers(graph, example, direction) {
      const options = example.decorationOptions || {};
      const rootPoint = this.getCanvasPoint(graph, example.key + "-0");
      const headWidth = options.headWidth || 360;
      const tailWidth = options.tailWidth || 66;
      let levelOneNodes = [];
      let tailCandidates = [];
      let tailTipX = 0;

      if (example.renderKey !== "product-headtail" || !rootPoint) {
        return [];
      }

      levelOneNodes = (typeof graph.getNodeData === "function" ? graph.getNodeData() : []).filter(
        (node) => node.depth === 1 && !(node.data && node.data.markerRole)
      );

      tailCandidates = levelOneNodes
        .map((node) => this.getCanvasPoint(graph, node.id))
        .filter((point) => point && isFinite(point[0]) && isFinite(point[1]))
        .map((point) => point[0]);

      if (!tailCandidates.length) {
        tailCandidates = [direction === "RL" ? rootPoint[0] - 320 : rootPoint[0] + 320];
      }

      tailTipX =
        direction === "RL"
          ? Math.min.apply(null, tailCandidates) - 84
          : Math.max.apply(null, tailCandidates) + 84;

      return [
        {
          id: example.key + "-head-marker",
          depth: -1,
          children: [],
          x: direction === "RL" ? rootPoint[0] + headWidth / 2 : rootPoint[0] - headWidth / 2,
          y: rootPoint[1],
          data: {
            label: options.headText || example.tree.label || "结果",
            markerRole: "head-marker",
          },
          style: {
            x: direction === "RL" ? rootPoint[0] + headWidth / 2 : rootPoint[0] - headWidth / 2,
            y: rootPoint[1],
          },
        },
        {
          id: example.key + "-tail-marker",
          depth: -1,
          children: [],
          x: direction === "RL" ? tailTipX - tailWidth / 2 : tailTipX + tailWidth / 2,
          y: rootPoint[1],
          data: {
            label: "",
            markerRole: "tail-marker",
          },
          style: {
            x: direction === "RL" ? tailTipX - tailWidth / 2 : tailTipX + tailWidth / 2,
            y: rootPoint[1],
          },
        },
      ];
    },
    createProductHeadTailSpineEdge(example) {
      if (example.renderKey !== "product-headtail") {
        return null;
      }
      return {
        id: example.key + "-head-tail-spine",
        source: example.key + "-tail-marker",
        target: example.key + "-head-marker",
        data: {
          edgeRole: "head-tail-spine",
          zIndex: -1,
        },
        style: {
          zIndex: -1,
        },
      };
    },
    syncProductHeadTailMarkers(graph, example, direction) {
      const markerNodes = this.createProductHeadTailMarkers(graph, example, direction);
      const spineEdge = this.createProductHeadTailSpineEdge(example);
      const existingIds = {};
      const existingEdgeIds = {};
      const nodesToAdd = [];
      const nodesToUpdate = [];
      const edgesToAdd = [];

      if (example.renderKey !== "product-headtail" || !markerNodes.length) {
        return Promise.resolve();
      }

      (typeof graph.getNodeData === "function" ? graph.getNodeData() : []).forEach((node) => {
        existingIds[node.id] = true;
      });
      (typeof graph.getEdgeData === "function" ? graph.getEdgeData() : []).forEach((edge) => {
        existingEdgeIds[edge.id] = true;
      });

      markerNodes.forEach((node) => {
        if (existingIds[node.id]) {
          nodesToUpdate.push(node);
          return;
        }
        nodesToAdd.push(node);
      });

      if (spineEdge && !existingEdgeIds[spineEdge.id]) {
        edgesToAdd.push(spineEdge);
      }

      if (nodesToAdd.length && typeof graph.addNodeData === "function") {
        graph.addNodeData(nodesToAdd);
      }
      if (edgesToAdd.length && typeof graph.addEdgeData === "function") {
        graph.addEdgeData(edgesToAdd);
      }
      if (nodesToUpdate.length && typeof graph.updateNodeData === "function") {
        graph.updateNodeData(nodesToUpdate);
      }

      if (!nodesToAdd.length && !nodesToUpdate.length && !edgesToAdd.length) {
        return Promise.resolve();
      }
      return Promise.resolve(typeof graph.draw === "function" ? graph.draw() : null);
    },
    getWrappedCardSize(label, options) {
      const settings = options || {};
      const fontSize = settings.fontSize || 12;
      const maxTextWidth = settings.maxTextWidth || 120;
      const minWidth = settings.minWidth || 56;
      const minHeight = settings.minHeight || 32;
      const paddingX = settings.paddingX || 12;
      const paddingY = settings.paddingY || 8;
      const textWidth = engine.measureTextWidth(label, {
        fontSize: fontSize,
        fontWeight: settings.fontWeight || 400,
        fontFamily: settings.fontFamily || GRAPH_FONT,
      });
      const lineHeight = settings.lineHeight || Math.round(fontSize * 1.35);
      const lineCount = Math.max(1, Math.ceil(textWidth / maxTextWidth));
      const width = Math.max(minWidth, Math.min(textWidth, maxTextWidth) + paddingX * 2);
      const height = Math.max(minHeight, lineCount * lineHeight + paddingY * 2);
      return [Math.round(width), Math.round(height)];
    },
    createGraphBase(stage, example, graphData) {
      return {
        container: stage.host,
        width: stage.width,
        height: stage.height,
        autoFit: "view",
        padding:
          example.layoutOptions && example.layoutOptions.padding != null
            ? example.layoutOptions.padding
            : [24, 40, 24, 40],
        data: graphData,
        behaviors: example.behaviors || ["drag-canvas", "zoom-canvas"],
        animation: false,
      };
    },
    createBasicConfig(stage, example, direction, graphData) {
      const base = this.createGraphBase(stage, example, graphData);
      const layoutOptions = example.layoutOptions || {};

      base.node = {
        type: "rect",
        style: (datum) => {
          const depth = datum.depth || 0;
          const label = datum.data.label;

          if (depth === 0) {
            return {
              size: this.getWrappedCardSize(label, {
                fontSize: 15,
                fontWeight: 700,
                fontFamily: CARD_FONT,
                maxTextWidth: 180,
                minWidth: 116,
                minHeight: 52,
                paddingX: 18,
                paddingY: 10,
                lineHeight: 20,
              }),
              radius: 12,
              fill: "#f3f5f8",
              stroke: "#7c93b3",
              lineWidth: 1.8,
              shadowBlur: 8,
              shadowColor: "rgba(80, 103, 136, 0.08)",
              labelText: label,
              labelFill: "#22344d",
              labelFontFamily: CARD_FONT,
              labelFontWeight: 700,
              labelFontSize: 15,
              labelLineHeight: 20,
              labelMaxWidth: 180,
              labelPlacement: "center",
              labelTextAlign: "center",
              labelTextBaseline: "middle",
              labelWordWrap: true,
            };
          }

          if (depth === 1) {
            return {
              size: this.getWrappedCardSize(label, {
                fontSize: 12,
                fontWeight: 600,
                fontFamily: CARD_FONT,
                maxTextWidth: 118,
                minWidth: 72,
                minHeight: 38,
                paddingX: 14,
                paddingY: 8,
                lineHeight: 16,
              }),
              radius: 10,
              fill: "#ffffff",
              stroke: "#90a4c0",
              lineWidth: 1.6,
              labelText: label,
              labelFill: "#28384d",
              labelFontFamily: CARD_FONT,
              labelFontWeight: 600,
              labelFontSize: 12,
              labelLineHeight: 16,
              labelMaxWidth: 118,
              labelPlacement: "center",
              labelTextAlign: "center",
              labelTextBaseline: "middle",
              labelWordWrap: true,
            };
          }

          return {
            size: this.getWrappedCardSize(label, {
              fontSize: 11,
              fontFamily: GRAPH_FONT,
              maxTextWidth: 126,
              minWidth: 66,
              minHeight: 34,
              paddingX: 12,
              paddingY: 8,
              lineHeight: 15,
            }),
            radius: 9,
            fill: "#ffffff",
            stroke: "#aab7cb",
            lineWidth: 1.4,
            labelText: label,
            labelFill: "#2d4058",
            labelFontFamily: GRAPH_FONT,
            labelFontSize: 11,
            labelLineHeight: 15,
            labelMaxWidth: 126,
            labelPlacement: "center",
            labelTextAlign: "center",
            labelTextBaseline: "middle",
            labelWordWrap: true,
          };
        },
      };

      base.edge = {
        type: "polyline",
        style: {
          lineWidth: 3,
          stroke: "#9fb1c7",
        },
      };

      base.layout = {
        type: "fishbone",
        direction: direction,
        hGap: layoutOptions.hGap || 48,
        vGap: layoutOptions.vGap || 48,
      };

      return base;
    },
    getSceneNodeStyle(datum, direction, example) {
      const depth = datum.depth || 0;
      const nodeData = datum.data || {};
      const label = nodeData.label;
      const color = nodeData.branchColor || "#1783FF";
      const markerRole = nodeData.markerRole;
      const styleOptions = example.styleOptions || {};
      const decorationOptions = example.decorationOptions || {};
      const placement = engine.getOutsideLabelPlacement(direction);
      const isProductStyle = example.renderKey === "product" || example.renderKey === "product-headtail";
      const baseStyle = {
        radius: 8,
        size: [styleOptions.leafNodeWidth != null ? styleOptions.leafNodeWidth : 2, 30],
        labelText: label,
        labelFontFamily: GRAPH_FONT,
        labelPlacement: placement,
        labelTextBaseline: "middle",
        labelFill: "#262626",
        labelFontSize: 16,
        fill: "transparent",
      };

      if (markerRole === "head-marker") {
        return {
          x: typeof datum.x === "number" ? datum.x : datum.style && datum.style.x,
          y: typeof datum.y === "number" ? datum.y : datum.style && datum.style.y,
          zIndex: 8,
          headDirection: direction === "RL" ? "right" : "left",
          size: [decorationOptions.headWidth || 374, decorationOptions.headHeight || 168],
          fill: decorationOptions.fill || "#f7f1e8",
          fillOpacity: 0.98,
          stroke: decorationOptions.stroke || "#343a45",
          lineWidth: decorationOptions.lineWidth || 4,
          labelText: label,
          labelFill: decorationOptions.textFill || "#343a45",
          labelFontFamily: CARD_FONT,
          labelFontWeight: 700,
          labelFontSize: decorationOptions.headFontSize || 20,
          labelLineHeight: decorationOptions.headLineHeight || 30,
          labelPlacement: "center",
          labelOffsetX:
            direction === "RL"
              ? -(decorationOptions.headLabelOffsetX || 10)
              : decorationOptions.headLabelOffsetX || 10,
          labelTextAlign: "center",
          labelTextBaseline: "middle",
          labelWordWrap: true,
          labelMaxWidth:
            decorationOptions.headLabelMaxWidth ||
            Math.round((decorationOptions.headWidth || 374) * 0.48),
          labelMaxLines: decorationOptions.headLabelMaxLines || 3,
          labelTextOverflow: "...",
        };
      }
      if (markerRole === "tail-marker") {
        return {
          x: typeof datum.x === "number" ? datum.x : datum.style && datum.style.x,
          y: typeof datum.y === "number" ? datum.y : datum.style && datum.style.y,
          zIndex: 8,
          size: [decorationOptions.tailWidth || 64, decorationOptions.tailHeight || 180],
          direction: direction === "RL" ? "right" : "left",
          fill: decorationOptions.fill || "#f7f1e8",
          fillOpacity: 0.98,
          stroke: decorationOptions.stroke || "#343a45",
          lineWidth: decorationOptions.lineWidth || 4,
          lineJoin: "round",
          labelText: "",
        };
      }

      if (depth === 0) {
        if (example.renderKey === "product-headtail") {
          return Object.assign(baseStyle, {
            size: [8, 8],
            fill: "transparent",
            stroke: "transparent",
            lineWidth: 0,
            labelText: "",
            labelFill: "transparent",
            shadowBlur: 0,
          });
        }

        return Object.assign(baseStyle, {
          size: [
            engine.measureTextWidth(label, {
              fontSize: 24,
              fontWeight: 700,
              fontFamily: CARD_FONT,
            }) + 80,
            styleOptions.rootHeight || (isProductStyle ? 90 : 70),
          ],
          fill: example.renderKey === "product-headtail" ? "#fff4ea" : "#EFF0F0",
          stroke: example.renderKey === "product-headtail" ? "#f08f56" : undefined,
          lineWidth: example.renderKey === "product-headtail" ? 3 : undefined,
          shadowBlur: example.renderKey === "product-headtail" ? 24 : undefined,
          shadowColor: example.renderKey === "product-headtail" ? "rgba(240, 143, 86, 0.22)" : undefined,
          labelFill: example.renderKey === "product-headtail" ? "#9a4513" : "#262626",
          labelFontFamily: CARD_FONT,
          labelFontWeight: 700,
          labelFontSize: example.renderKey === "product-headtail" ? 26 : 24,
          labelOffsetY: styleOptions.rootLabelOffsetY != null ? styleOptions.rootLabelOffsetY : 4,
          labelPlacement: "center",
          labelTextAlign: "center",
          labelLineHeight: styleOptions.rootLineHeight || (isProductStyle ? 32 : 24),
        });
      }

      if (depth === 1) {
        const depthOneStyle = {
          size: [
            engine.measureTextWidth(label, {
              fontSize: 18,
              fontWeight: isProductStyle ? 600 : 400,
              fontFamily: CARD_FONT,
            }) + 50,
            42,
          ],
          labelFontFamily: CARD_FONT,
          labelFontSize: 18,
          labelOffsetY: styleOptions.depthOneLabelOffsetY != null ? styleOptions.depthOneLabelOffsetY : 5,
          labelPlacement: "center",
          labelTextAlign: "center",
          fill: color,
        };

        if (isProductStyle) {
          return Object.assign(baseStyle, depthOneStyle, {
            labelFill: "#252525",
            labelFontWeight: 600,
            labelFillOpacity: 0.9,
            fillOpacity: example.renderKey === "product-headtail" ? 0.78 : 0.6,
            lineWidth: example.renderKey === "product-headtail" ? 2.3 : 2,
            stroke: example.renderKey === "product-headtail" ? engine.withAlpha(color, 0.92) : "#252525",
          });
        }

        return Object.assign(baseStyle, depthOneStyle, {
          labelFill: "#ffffff",
          labelFillOpacity: 0.9,
        });
      }

      return Object.assign(baseStyle, {
        labelPlacement: placement,
        labelFill: "#262626",
        labelFontSize: 16,
      });
    },
    createSceneConfig(stage, example, direction, graphData) {
      const base = this.createGraphBase(stage, example, graphData);
      const layoutOptions = example.layoutOptions || {};
      const isProductStyle = example.renderKey === "product" || example.renderKey === "product-headtail";

      base.node = {
        type: (datum) => {
          if (datum.data && datum.data.markerRole === "head-marker") {
            return "fish-head-node";
          }
          return datum.data && datum.data.markerRole === "tail-marker" ? "triangle" : "rect";
        },
        style: (datum) => this.getSceneNodeStyle(datum, direction, example),
      };

      base.edge = {
        type: (datum) => (datum.data && datum.data.edgeRole === "head-tail-spine" ? "line" : "polyline"),
        style: {
          lineWidth: (datum) => {
            if (datum.data && datum.data.edgeRole === "head-tail-spine") {
              return (example.decorationOptions && example.decorationOptions.lineWidth) || 4;
            }
            return example.renderKey === "product-headtail" ? 3.4 : 3;
          },
          stroke: (datum) => {
            if (datum.data && datum.data.edgeRole === "head-tail-spine") {
              return (example.decorationOptions && example.decorationOptions.stroke) || "#343a45";
            }
            return isProductStyle ? "#252525" : datum.data.branchColor || "#99ADD1";
          },
          zIndex: (datum) => datum.data.zIndex || 0,
          lineCap: "round",
        },
      };

      base.layout = {
        type: "fishbone",
        direction: direction,
        hGap: layoutOptions.hGap || 40,
        vGap: layoutOptions.vGap || 60,
      };

      if (typeof layoutOptions.ribSep === "number") {
        base.layout.getRibSep = (node) => (node.depth === 0 ? 0 : layoutOptions.ribSep);
      }

      return base;
    },
    createGraphConfig(stage, example, direction) {
      const graphData = engine.buildGraphData(example);
      if (example.renderKey === "anti" || example.renderKey === "product" || example.renderKey === "product-headtail") {
        return this.createSceneConfig(stage, example, direction, graphData);
      }
      return this.createBasicConfig(stage, example, direction, graphData);
    },
    isGraphCurrent(graph, renderId) {
      return this.renderId === renderId && this.graph === graph && !graph.destroyed;
    },
    renderGraph() {
      this.$nextTick(() => {
        let stage = null;
        let graph = null;
        const renderId = this.renderId + 1;

        if (!this.example || !this.example.key) {
          return;
        }

        this.cleanup();
        stage = this.resolveStage();
        if (!stage) {
          return;
        }

        this.renderId = renderId;
        this.renderErrorMessage = "";

        if (typeof G6.Graph !== "function") {
          this.renderErrorMessage = "G6 Graph is not available.";
          return;
        }

        try {
          this.ensureExtensions();
          graph = new G6.Graph(this.createGraphConfig(stage, this.example, this.direction));
          this.graph = graph;
        } catch (error) {
          this.cleanup();
          this.renderErrorMessage = error && error.message ? error.message : String(error);
          return;
        }

        Promise.resolve(graph.render())
          .then(() => {
            if (!this.isGraphCurrent(graph, renderId)) {
              return null;
            }
            return this.syncProductHeadTailMarkers(graph, this.example, this.direction).then(() => {
              if (!this.isGraphCurrent(graph, renderId)) {
                return;
              }
              if (typeof graph.fitView === "function") {
                graph.fitView();
              }
            });
          })
          .catch((error) => {
            this.cleanup();
            this.renderErrorMessage = error && error.message ? error.message : String(error);
          });
      });
    },
  },
};

</script>

<style scoped>
.fishbone-stage-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

.fishbone-stage-scroll {
  flex: 1;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.fishbone-graph-stage {
  position: relative;
  min-height: 0;
  background: #fff;
}

.fishbone-graph-stage > canvas,
.fishbone-graph-stage > svg {
  display: block;
}

.fishbone-demo-error {
  display: grid;
  place-items: center;
  min-height: 100%;
  height: 100%;
  padding: 24px;
  text-align: center;
  color: #f56c6c;
  background: #fff;
}

.fishbone-demo-error strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
}

.fishbone-demo-error p {
  margin: 8px 0 0;
  color: #909399;
  line-height: 20px;
  word-break: break-all;
}

@media (max-width: 1180px) {
  .fishbone-graph-stage,
  .fishbone-demo-error {
    min-height: 600px;
  }
}

@media (max-width: 720px) {
  .fishbone-graph-stage,
  .fishbone-demo-error {
    min-height: 480px;
  }
}
</style>
