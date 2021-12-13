import { useEffect, useState, useRef } from "react";
import ResizeObserver from "resize-observer-polyfill";

export const combineChartDimensions = dimensions => {
  let parsedDimensions = {
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
  const dimensions = combineChartDimensions(passedSettings)

  // if (dimensions.width && dimensions.height) return [ref, sdimensions]
  const initialWidth = dimensions.width || 0;
  const initialHeight = dimensions.height || 0;
  // const [width, changeWidth] = useState(initialWidth)
  // const [height, changeHeight] = useState(initialHeight)
  // 合并有关联的state，减少组件更新
  const [wd, changeWd] = useState({width: initialWidth, height: initialHeight});

  useEffect(() => {
    const element = ref.current
    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return

      const entry = entries[0]

      // if (width !== entry.contentRect.width) changeWidth(entry.contentRect.width)
      // if (height !== entry.contentRect.height) changeHeight(entry.contentRect.height)
      if (wd.width !== entry.contentRect.width || wd.height !== entry.contentRect.height) {
        changeWd({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        })
      }
    })

    resizeObserver.observe(element)

    return () => resizeObserver.unobserve(element)
  }, [])

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || wd.width,
    height: dimensions.height || wd.height,
  })

  return [ref, newSettings]
}