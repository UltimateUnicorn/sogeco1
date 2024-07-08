'use server'

import {redirect} from 'next/navigation'

export async function enregistrementCommande(formData: FormData) {

	console.log(formData)
	let commande = new URLSearchParams()
	let retour

	try {
		//let commande = new URLSearchParams()
		commande.set('categorie', formData.categorie)
		commande.set('service', formData.service)
		commande.set('demandeur', (formData.hasOwnProperty("demandeur")) ? formData.demandeur.id : 0)
		commande.set('assignee', (formData.hasOwnProperty("attribuee")) ? formData.assignee.id : 0)
		commande.set('urgent', formData.urgent)
		commande.set('quantite', Number.parseInt(formData.quantite))
		commande.set('description', formData.description)
		
		console.log(commande)
		
		commande = await fetch('http://localhost:8080/commandes/nouvelle', {method: 'POST', cache: 'no-store', 'Content-Type': 'application/x-www-form-urlencoded', body: commande})

		if(commande.ok) {
			console.log("Commande enregistrée")
			retour = await commande.text()
		}

		if (!commande.ok) {
			console.log("Erreur d'enregistrement")
			throw new Error(commande.status)
		}

	} catch (error) {
		console.error(error)
	}

	if (commande.ok) {
		console.log("Redirection : commandes/detail/" + retour)
		redirect(`/commandes/detail/${retour}`)
	}
}
