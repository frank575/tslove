import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'

export const useRoute = () => {
	const location = useLocation()
	const [pathnameHistory, setPathnameHistory] = useState({
		previous: '/',
		current: '/',
	})
	const previousPathname = useMemo(
		() => pathnameHistory.previous,
		[pathnameHistory],
	)
	useEffect(() => {
		setPathnameHistory(e => ({
			previous: e.current,
			current: location.pathname,
		}))
	}, [location])

	return {
		previousPathname,
	}
}