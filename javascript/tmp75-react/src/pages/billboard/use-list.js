import { useCallback, useEffect } from 'react'
import { useDebounce, useSearch } from '@jsl-hooks'
import { fetchBillboard, fetchLikeBillboardPost } from '@/core/api-service'
import { message } from 'antd'
import { useSafeState } from '@jsl-hooks'

export const useList = () => {
	const [data, setData] = useSafeState({ content: [], total: 0 })
	const [search, setSearch] = useSearch({
		size: 10,
		number: 1,
		status: undefined,
		sort: undefined,
		order: undefined,
		keyword: '',
	})
	const [loading, setLoading] = useSafeState(true)

	const onChangeSearch = (key, value) => {
		setSearch(e => ({ ...e, number: 1, [key]: value }))
	}

	const onDebounceChangeSearch = useDebounce((key, value) => {
		setSearch(e => ({ ...e, number: 1, [key]: value }))
	}, 1000)

	const onChangeTable = (pagination, filters, sorter) => {
		if (
			pagination.current !== search.number ||
			pagination.pageSize !== search.size
		) {
			setSearch(e => ({
				...e,
				number: pagination.current,
				size: pagination.pageSize,
			}))
			return
		}
		if (sorter.field !== search.sort || sorter.order !== search.order) {
			setSearch(e => ({
				...e,
				number: 1,
				sort: sorter.field,
				order: sorter.order,
			}))
		}
	}

	const getList = useCallback(async () => {
		setLoading(true)
		const res = await fetchBillboard({
			...search,
			number: search.number - 1,
		})
		setLoading(false)
		if (res.success) {
			setData({ total: res.data.total, content: res.data.content })
			return
		}
		setData({ total: 0, content: [] })
	}, [search])

	const onLike = useCallback(
		async (id, key = 'like', value = true) => {
			setLoading(true)
			const { success, message: resMessage } = await fetchLikeBillboardPost({
				id,
				[key]: value,
			})
			if (success) {
				message.success(resMessage)
				getList()
			}
		},
		[getList],
	)

	useEffect(getList, [search])

	return {
		loading,
		data,
		search,
		getList,
		onChangeSearch,
		onDebounceChangeSearch,
		onChangeTable,
		onLike,
	}
}