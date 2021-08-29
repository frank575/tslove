import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'
import './typedof'
import { createClassName } from '@jsl'
import { commonValidatorRule } from '@/components/form/lib/validator'

export const Input = forwardRef(
	/**
	 * @param {undefined | string} label
	 * @param {undefined | boolean} required
	 * @param {undefined | string} value 如果 value 為 undefined 將由組件內部自行驅動 value
	 * @param {string} placeholder
	 * @param {undefined | string} className
	 * @param {Rule[]} rules 規則，詳情查看 Rule
	 * @param {'change'} trigger 驗證觸發方式
	 * @param {function(value: string): void} onChange
	 * @param {'password' | 'text'} htmlType input type
	 * @param {number | string} labelWidth label 寬度
	 * @param {boolean} togglePassword 是否顯示眼睛 icon
	 * @param {undefined | string} defaultValue 預設值
	 * @param ref
	 * @return {JSX.Element}
	 */
	(
		{
			label,
			required,
			value,
			placeholder = '',
			className,
			rules = [],
			trigger = 'change',
			onChange,
			htmlType = 'text',
			labelWidth = 64,
			togglePassword = false,
			defaultValue,
		},
		ref,
	) => {
		const changeLockRef = useRef(0)
		const [look, setLook] = useState(false)
		const [authState, setAuthState] = useState({
			message: '格式不正確',
			success: true,
		})
		const [_value, set_value] = useState(() => value ?? defaultValue ?? '')

		const _onChange = async ev => {
			const v = ev.target.value
			if (value === undefined) {
				await validateByChangeTrigger(v)
				set_value(v)
				onChange?.(v)
			} else {
				if (onChange) {
					changeLockRef.current = 1
					return onChange(v)
				}
				ev.target.value = value
			}
		}

		const validateByChangeTrigger = async value => {
			if (trigger === 'change') {
				await validate(value)
			}
		}

		const validate = async value => {
			const result = await commonValidatorRule(rules, value ?? _value)
			setAuthState(result)
			return result
		}

		const toggleLook = look => () => setLook(look)

		useImperativeHandle(ref, () => ({
			value: _value,
			pass: authState.success,
			validate,
		}))

		useEffect(() => {
			if (value !== _value && changeLockRef.current > 0) {
				;(async () => {
					await validateByChangeTrigger(value)
					set_value(value)
					if (changeLockRef.current) {
						changeLockRef.current = 0
					}
				})()
			}
		}, [value])

		return (
			<div
				className={createClassName({
					'w-full flex items-baseline': true,
					[className]: className != null,
				})}
			>
				{label != null && (
					<div className="mr-2" style={{ width: labelWidth }}>
						{required || rules.length ? (
							<span className="text-danger">*</span>
						) : null}
						{label}
					</div>
				)}
				<div className="flex-1 relative">
					<div className="relative">
						<input
							className={createClassName({
								'border-solid border-1 border-gray-200 rounded-md p-2 w-full outline-none': true,
								'border-danger': !authState.success,
								'pr-12': togglePassword,
							})}
							type={togglePassword ? (look ? 'text' : 'password') : htmlType}
							placeholder={placeholder}
							onChange={_onChange}
							defaultValue={defaultValue ?? _value}
						/>
						{togglePassword &&
							(look ? (
								<img
									className="absolute top-1/2 right-4 transform -translate-y-1/2 w-4 cursor-pointer"
									src="/visibility.svg"
									alt=""
									onClick={toggleLook(false)}
								/>
							) : (
								<img
									className="absolute top-1/2 right-4 transform -translate-y-1/2 w-4 cursor-pointer"
									src="/invisible.svg"
									alt=""
									onClick={toggleLook(true)}
								/>
							))}
					</div>
					{!authState.success && (
						<div className="text-danger text-sm">{authState.message}</div>
					)}
				</div>
			</div>
		)
	},
)
