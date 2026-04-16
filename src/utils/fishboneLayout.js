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

export default {
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
