import { useClock } from '../lib/hooks'

/** 独立时钟：把每秒一次的重渲染隔离在最小组件内，Header/Hero 不再跟着重渲染 */
export default function Clock() {
  return <>{useClock()}</>
}
