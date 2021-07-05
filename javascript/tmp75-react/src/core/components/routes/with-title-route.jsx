import { useTitle } from '@jsl-hooks'
import { PrivateRoute } from '@/core/components/routes/private-route'
import { Route } from 'react-router'

export const WithTitleRoute = props => {
	useTitle(props.title)
	return <Route {...props} />
}