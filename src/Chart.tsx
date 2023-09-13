import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  CSSProperties,
} from "react";
import { Chart as G2Chart, G2Spec, ChartOptions } from "@antv/g2";

export type ChartRef = G2Chart | undefined;

export type ChartProps = {
  spec: G2Spec;
  options?: ChartOptions;
  style?: CSSProperties;
  onInit?: () => void;
};

export const Chart = forwardRef<ChartRef, ChartProps>((props, ref) => {
  const { spec, style, onInit, options } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<G2Chart>();
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      chartRef.current = new G2Chart({
        ...options,
        container: containerRef.current,
      });
      setInit(true);
    }
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (init) onInit?.();
  }, [init]);

  useEffect(() => {
    if (chartRef.current && spec) {
      chartRef.current.options(spec);
      chartRef.current.render();
    }
  }, [spec]);

  useImperativeHandle(ref, () => chartRef.current, [init]);

  return <div ref={containerRef} style={style}></div>;
});