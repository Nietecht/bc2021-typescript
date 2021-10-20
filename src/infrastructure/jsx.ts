import { FunctionComponent, h, jsx as snabbdomJsx, JsxVNodeChildren } from 'snabbdom';
import { VNode, VNodeData } from 'snabbdom';

export type JSXComponent = (props: VNodeData, children: any[]) => VNode;

type Obj = { [key: string]: any };

function deepFlatten<T>(ar: T[][] | T[]): T[] {
  const x = ar.slice();
  let i = x.length;
  while (i--) {
    if (Array.isArray(x[i])) {
      (x as any).splice.apply(x, [i, 1].concat(deepFlatten(x[i] as any) as any) as any);
    }
  }
  return (x as any) as T[];
}

function copyProps(props: string[], src: Obj, target: Obj) {
  for (const prop of props) {
    target[prop] = src[prop];
  }
  return target;
}

const ariaRegex = /^aria-.*/;

function copyAria(src: Obj, target: Obj) {
  return copyProps(
    Object.keys(src).filter(key => ariaRegex.test(key)),
    src,
    target
  );
}

function getDatasetKeys(src: Obj) {
  return Object.keys(src)
    .filter(key => /^data-./.test(key))
    .map(dataKey => dataKey.substr('data-'.length));
}

function getDataset(props: VNodeData) {
  if (!props) {
    return undefined;
  }

  const dataset = props.dataset;
  const dataset2 = getDatasetKeys(props);

  const resultingDataSet = dataset2.length && !dataset ? {} : dataset;

  if (resultingDataSet && dataset2.length) {
    for (const dataProp of dataset2) resultingDataSet[dataProp] = props['data-' + dataProp];
  }

  return resultingDataSet;
}

export const vnodeProps = (props: VNodeData | null) => {
  if (!props)
    return null
  
  const dataset = getDataset(props);
  return {
    props: props && { ...props, style: undefined, dataset: undefined, hook: undefined, key: undefined, on: undefined },
    attrs: props ? copyAria(props, { ...props.attrs, for: props.for }) : undefined,
    style: props && props.style ? props.style : undefined,
    dataset: dataset || undefined,
    hook: props && props.hook ? props.hook : undefined,
    on: props && props.on ? props.on : undefined,
    key: props && (props.key ? props.key : props.id ? props.id : undefined)
  };
};

export function jsx(sel: string | FunctionComponent, props: VNodeData | null, ...children: JsxVNodeChildren[]) {
  return snabbdomJsx(sel, vnodeProps(props), ...children)
}

namespace JSXInternal {
  export type Element = VNode;
  export interface IntrinsicElements {
    [elemName: string]: VNodeData;
  }
}

export namespace jsx {
  export import JSX = JSXInternal; // eslint-disable-line @typescript-eslint/no-unused-vars
}