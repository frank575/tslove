import React, { useMemo } from 'react'
import { Menu } from 'antd'
import {
	BgColorsOutlined,
	OrderedListOutlined,
	ScheduleOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useStore } from '@/core/store'

const { SubMenu, Item } = Menu
export const SideMenu = () => {
	const menuCollapsed = useStore(e => e.menuCollapsed)
	const selectedKeys = useStore(e => e.sideSelectedKeys)

	return useMemo(
		() => (
			<Menu
				className="max-w-side-menu"
				mode="inline"
				theme={'dark'}
				inlineCollapsed={menuCollapsed}
				selectedKeys={selectedKeys}
			>
				<Item key={'billboard'} icon={<OrderedListOutlined />}>
					<Link to={'/billboard'}>公佈欄</Link>
				</Item>
				<Item key={'colorful'} icon={<BgColorsOutlined />}>
					<Link className="text-white" to={'/colorful'}>
						多主題色
					</Link>
				</Item>
				<SubMenu key={'nesting'} title={'嵌套選單'}>
					<SubMenu key={'nesting-1'} title={'第二層'}>
						<Item key={'billboard'} icon={<ScheduleOutlined />}>
							<Link className="text-white" to={'/billboard'}>
								公佈欄(第三層)
							</Link>
						</Item>
					</SubMenu>
					<Item key={'billboard'} icon={<OrderedListOutlined />}>
						<Link className="text-white" to={'/billboard'}>
							公佈欄(第二層)
						</Link>
					</Item>
				</SubMenu>
			</Menu>
		),
		[menuCollapsed, selectedKeys],
	)
}
