import { useState } from "react";

interface Classes {
	classNamesChecked: string,
	classNamesNotChecked: string,
	isChecked: boolean
}

function ButtonCheck({label, checked, onCheck}: {label: string, checked: boolean, onCheck: ()})
{
	const buttonClass: Classes = {
		classNamesChecked: "flex items-center gap-2.5 px-4 py-3 rounded-xl border border-brand bg-brand/10 text-brand text-sm font-medium",
		classNamesNotChecked: "flex items-center gap-2.5 px-4 py-3 rounded-xl border border-ink-600 text-ink-400 text-sm font-medium hover:border-ink-500 hover:text-ink-300 transition-colors",
		isChecked: checked
	}

	return <>
		<button className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-brand bg-brand/10 text-brand text-sm font-medium" name="role_id" onClick={onCheck}>
			<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
			{label}
		</button>
	</>
}

export default ButtonCheck;