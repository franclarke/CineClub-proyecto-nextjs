import { ReactNode } from 'react'
import { UseFormRegister, Path } from 'react-hook-form'

interface FormFieldProps<T extends Record<string, unknown>> {
	label: string
	name: Path<T>
	type?: string
	placeholder?: string
	error?: string
	register: UseFormRegister<T>
	required?: boolean
	className?: string
	icon?: ReactNode
}

export function FormField<T extends Record<string, unknown>>({
	label,
	name,
	type = 'text',
	placeholder,
	error,
	register,
	required = false,
	className,
	icon,
}: FormFieldProps<T>) {
	const baseInputClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
	const defaultClasses = "border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-transparent"
	const inputClasses = className ? `${baseInputClasses} ${className}` : `${baseInputClasses} ${defaultClasses}`

	return (
		<div className="space-y-2">
			<label htmlFor={String(name)} className="text-sm font-medium text-gray-200 flex items-center space-x-1">
				<span>{label}</span>
				{required && <span className="text-red-400">*</span>}
			</label>
			
			<div className="relative">
				{icon && (
					<div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
						{icon}
					</div>
				)}
				<input
					{...register(name)}
					type={type}
					id={String(name)}
					placeholder={placeholder}
					className={`${inputClasses} ${icon ? 'pl-11' : 'px-4'}`}
				/>
			</div>
			
			{error && (
				<div className="flex items-center space-x-2">
					<svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
					</svg>
					<p className="text-sm text-red-400">{error}</p>
				</div>
			)}
		</div>
	)
} 
