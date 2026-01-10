import React from 'react';
import VariableProximity from './VariableProximity';

const EXCLUDED_TAGS = new Set([
  'svg',
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'g',
  'defs',
  'mask',
  'clipPath',
  'linearGradient',
  'radialGradient',
  'stop',
  'pattern',
  'image',
  'video',
  'audio',
  'canvas',
  'img',
  'source',
  'track',
  'style',
  'script',
]);

export default function AutoVariableProximity({
  children,
  containerRef,
  enabled = true,
  radius = 90,
  falloff = 'linear',
  fromFontVariationSettings = "'wght' 400, 'opsz' 9",
  toFontVariationSettings = "'wght' 1000, 'opsz' 40",
  className = 'variable-proximity-demo',
}) {
  const wrapNode = (node) => {
    if (node == null || typeof node === 'boolean') return node;

    if (typeof node === 'string' || typeof node === 'number') {
      const text = String(node);
      if (text.trim().length === 0) return node;

      return (
        <VariableProximity
          label={text}
          className={className}
          fromFontVariationSettings={fromFontVariationSettings}
          toFontVariationSettings={toFontVariationSettings}
          containerRef={containerRef}
          radius={radius}
          falloff={falloff}
          enabled={enabled}
          a11yMode="aria-label"
        />
      );
    }

    if (!React.isValidElement(node)) return node;

    const elementType = node.type;
    if (typeof elementType === 'string' && EXCLUDED_TAGS.has(elementType)) {
      return node;
    }

    if (node.props?.dangerouslySetInnerHTML) {
      return node;
    }

    if (!node.props || node.props.children == null) {
      return node;
    }

    const newChildren = React.Children.map(node.props.children, wrapNode);
    return React.cloneElement(node, node.props, newChildren);
  };

  return <>{React.Children.map(children, wrapNode)}</>;
}
