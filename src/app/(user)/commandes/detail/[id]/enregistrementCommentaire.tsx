'use server'

export async function enregistrementCommentaire(idCommande, formData: FormData) {
	console.log(decodeURIComponent(idCommande))

	console.log(formData)
	let message = new FormData()

	message.append('id_commande', decodeURIComponent(idCommande))
	message.append('commentaire', formData.get('commentaire'))
	message.append('file', formData.get('file'))
	try {
		console.log(message)
		message = await fetch('http://localhost:8080/commandes/upload4', {method: 'POST', cache: 'no-store', body: message})
		
	} catch (error) {
		console.error(error)
	}
}
