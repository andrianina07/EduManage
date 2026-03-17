import { useEffect, useState } from "react";
import ButtonCheck from "../../components/ui/ButtonCheck";
import Input from "../../components/ui/Input";
import Email from "../../components/icons/Email";
import Padplock from "../../components/icons/Padplock";

interface Role {
	id: number,
	role: string
}

interface RoleWithCheck extends Role {
	check: true | false
}

function Login ()
{
	const [roles, setRoles] = useState<Role[]>([
		{
			id: 1,
			role: "Administrateur",
		},
		{
			id: 2,
			role: "Surveillant",
		},
		{
			id: 3,
			role: "Professeur",
		},
		{
			id: 4,
			role: "Étudiant",
		}
	]);

	const [rolesWithCheck, setRoleWithCheck] = useState<RoleWithCheck[]>([]);
	const roleTemporary: RoleWithCheck[] = roles.map((role) => ({...role, check: false}));

	useEffect(() => {
		setRoleWithCheck(roleTemporary);
	}, [])

	const toggleCheckButton = (id: number): void => {
		const roleCheck: RoleWithCheck[] = roleTemporary.map((role) => id == role.id ? {...role, check: true} : role);
		setRoleWithCheck(roleCheck);
	}

	return <>
	<div className="bg-ink-900 min-h-screen flex items-stretch">
		<div className="flex-1 flex items-center justify-center p-8">
			<div className="w-full max-w-[400px]">

			<div className="mb-8">
				<h2 className="text-white text-2xl font-bold mb-1">Connexion</h2>
				<p className="text-ink-400 text-sm">Choisissez votre rôle et connectez-vous.</p>
			</div>

			<div className="grid grid-cols-2 gap-2 mb-7">
				{rolesWithCheck.map((role) => <ButtonCheck label={role.role} checked={role.check} onCheck={() => toggleCheckButton(role.id)} key={role.id}/>)}
			</div>
			<form className="space-y-4">
				<Input label="Adresse email" type="email" placeholder="Entrer votre email" icon={<Email />}/>
				<Input label="Mot de passe" type="password"  placeholder="Entrer votre mot de passe" icon={<Padplock />}/>

				<div className="flex items-center justify-between pt-1">
					<label className="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" checked className="w-4 h-4 rounded border-ink-600 bg-ink-700 accent-brand" />
						<span className="text-xs text-ink-400">Se souvenir de moi</span>
					</label>
					<a href="#" className="text-xs text-brand hover:text-brand-dark transition-colors">Mot de passe oublié ?</a>
				</div>

				<button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-brand/25 flex items-center justify-center gap-2 mt-2">
					Se connecter
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
				</button>
			</form>

			<p className="text-center text-ink-600 text-xs mt-10">© 2026 EduGest · Tous droits réservés</p>
			</div>
		</div>
	</div>
	</>
}

export default Login;