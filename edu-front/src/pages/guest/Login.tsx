import { useState } from "react";
import ButtonCheck from "../../components/ui/ButtonCheck";

interface Role {
	id: number,
	role: string
}

interface AllRoles {
	role: Role[]
}

const Roles: AllRoles = 

const handleCheckButton = (check: boolean): boolean => {
	return check;
}

function Login ()
{
	const [check, setCheck] = useState(false)

	return <>
	<div className="bg-ink-900 min-h-screen flex items-stretch">
		<div className="flex-1 flex items-center justify-center p-8">
			<div className="w-full max-w-[400px]">

			<div className="mb-8">
				<h2 className="text-white text-2xl font-bold mb-1">Connexion</h2>
				<p className="text-ink-400 text-sm">Choisissez votre rôle et connectez-vous.</p>
			</div>

			<form className="space-y-4">
				<div className="grid grid-cols-2 gap-2 mb-7">
					<ButtonCheck label="Administrateur" checked={false}/>
					<ButtonCheck label="Surveillant" checked={false}/>
					<ButtonCheck label="Professeur" checked={false}/>
					<ButtonCheck label="Étudiant" checked={false}/>
				</div>
				<div>
					<label className="block text-ink-300 text-xs font-medium mb-1.5">Adresse email</label>
					<div className="relative">
						<svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
						<input type="email" value="admin@ecole.mg" className="w-full bg-ink-800 border border-ink-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all" />
					</div>
				</div>

				<div>
					<label className="block text-ink-300 text-xs font-medium mb-1.5">Mot de passe</label>
					<div className="relative">
						<svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
						<input type="password" value="••••••••" className="w-full bg-ink-800 border border-ink-600 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all" />
						<button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
						</button>
					</div>
				</div>

				<div className="flex items-center justify-between pt-1">
					<label className="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" checked className="w-4 h-4 rounded border-ink-600 bg-ink-700 accent-brand" />
						<span className="text-xs text-ink-400">Se souvenir de moi</span>
					</label>
					<a href="#" className="text-xs text-brand hover:text-brand-dark transition-colors">Mot de passe oublié ?</a>
				</div>

				<button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-brand/25 flex items-center justify-center gap-2 mt-2">
					Se connecter
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
				</button>
			</form>

			<p className="text-center text-ink-600 text-xs mt-10">© 2026 EduGest · Tous droits réservés</p>
			</div>
		</div>
	</div>
	</>
}

export default Login;