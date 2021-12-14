import { useEffect, useState, useRef } from "react";
import ResizeObserver from "resize-observer-polyfill";

export const combineChartDimensions = dimensions => {
  let parsedDimensions = {
    width: 0,
    height: 0,
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    ...dimensions,
  }

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
    boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
  }
}

// 获取容器宽高，如果没有传入width和height则监控容器变化更新width和height，如果传入了则直接使用传入宽高。
export const useChartDimensions = passedSettings => {
  const ref = useRef()
  const [dimensions, setDimensions] = useState(combineChartDimensions(passedSettings));
  useEffect(() => {
    const element = ref.current
    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return

      const entry = entries[0]
      if (dimensions.width !== entry.contentRect.width || dimensions.height !== entry.contentRect.height) {
        setDimensions(combineChartDimensions({
          ...dimensions,
          width: entry.contentRect.width,
          height: entry.contentRect.height
        }))
      }
    })

    resizeObserver.observe(element)

    return () => resizeObserver.unobserve(element)
  }, []);
  return [ref, dimensions];
}