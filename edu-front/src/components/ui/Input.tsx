import type { ReactElement } from "react";
import Icon from "./Icon";

function Input({label, type, defaultValue, placeholder, icon}: {label: string, type: string, defaultValue?: string, placeholder: string, icon: ReactElement}) {
	return <>
		<div>
			<label className="block text-ink-300 text-xs font-medium mb-1.5">{label}</label>
			<div className="relative">
				<Icon icon={icon} />
				<input type={type} placeholder={placeholder} defaultValue={defaultValue} className="w-full bg-ink-800 border border-ink-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all" />
			</div>
		</div>
	</>
}

export default Input;