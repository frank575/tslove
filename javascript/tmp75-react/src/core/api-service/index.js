import service from './service'
import { timeout } from '@jsl'

export const fetchLogin = params => service.post('login', params)

const _none = () => {}
export const callNoAuthFakeApi = async () => {
	await timeout().startSync(_none, 500)
	return {
		success: true,
		status: 200,
		message: '成功',
	}
}
export const callAuthFakeApi = async () => {
	await timeout().startSync(_none, 500)
	const token = localStorage.getItem('tmp75_token')
	if (token) {
		return {
			success: true,
			status: 200,
			message: '成功',
		}
	}
	return {
		success: false,
		status: 401,
		message: '尚未登入',
	}
}