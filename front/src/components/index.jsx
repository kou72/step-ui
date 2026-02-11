import { useTheme } from '../theme/ThemeContext'
import * as Neu from './neu'
import * as Material from './material'

export { SideBar }       from './SideBar'
export { ThemeSwitcher } from './ThemeSwitcher'

function themed(name) {
  return function Themed(props) {
    const { theme } = useTheme()
    const C = theme === 'neu' ? Neu[name] : Material[name]
    return <C {...props} />
  }
}

export const Card        = themed('Card')
export const StatusBadge = themed('StatusBadge')
export const InfoPanel   = themed('InfoPanel')
export const Button      = themed('Button')
export const InitPanel   = themed('InitPanel')
export const ConfigPanel = themed('ConfigPanel')
