'use client'

import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography'

import { auth, signIn, signOut } from "@/auth";
interface RecapService {
	encours: number,
	livree: number,
	enattente: number
}

async function getRecap(id: number, handle, snack) {
	// Retourne les valeurs pour peupler les MUI Cards de CardRecapService.

	try{
		let recap = await fetch(`http://localhost:8080/services/recap/${id}`)
		if (recap.ok) {
			recap = await recap.json()
			handle(recap)
		}
		else {
			throw new Error(recap.status)
		}
	} catch (error) {
		snack({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
		console.error(error)
	}
}

function CardRecapService (service: string, image: string, recapService: RecapService) {
	// Retourne une "MUI Card" : un récapitulatif pour le service.
	// TODO : bouton pour aller aux commandes à valider ?
	// TODO : bouton pour aller aux commande à réceptionner ?

	return (
		<Card sx={{m:1, minWidth: 275}}>
			<CardActionArea component={Link} href={"/commandes/" + image}>
				<CardHeader title={service} />
				<CardMedia>
					<Image
						src={"/RecapService/" + image + ".png"}
						alt="Image du service"
						height={150}
						width={275}
					/>
				</CardMedia>
				<CardContent>
					<Box sx={{display: 'flex'}}>En cours :{"\xa0"} {recapService ? recapService.encours : <Skeleton variant="inline" sx={{flexGrow: 1}}/>}</Box>
					<Box sx={{display: 'flex'}}>Livrées à bord :{"\xa0"} {recapService ? recapService.livrees : <Skeleton variant="inline" sx={{flexGrow: 1}}/>}</Box>
					<Box sx={{display: 'flex'}}>En attente de validation :{"\xa0"} {recapService ? recapService.enattente : <Skeleton variant="inline" sx={{flexGrow: 1}}/>}</Box>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

export default function Accueil() {
	const [recapPont, setRecapPont] = useState<RecapService | null>()
	const [recapMachine, setRecapMachine] = useState<RecapService | null>(null)
	const [recapExterieur, setRecapExterieur] = useState<RecapService | null>(null)
	const [recapElectro, setRecapElectro] = useState<RecapService | null>(null)
	const [recapHotellerie, setRecapHotellerie] = useState<RecapService | null>(null)
	const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

	const handlePont = (data) => {setRecapPont(data)}
	const handleMachine = (data) => {setRecapMachine(data)}
	const handleExterieur = (data) => {setRecapExterieur(data)}
	const handleElectro = (data) => {setRecapElectro(data)}
	const handleHotellerie = (data) => {setRecapHotellerie(data)}
	const handleSnackBar = (data) => {setSnackbar(data)}

	useEffect(() => {
		getRecap(1, handlePont, handleSnackBar)
		getRecap(2, handleMachine, handleSnackBar)
		getRecap(3, handleExterieur, handleSnackBar)
		getRecap(4, handleElectro, handleSnackBar)
		getRecap(5, handleHotellerie, handleSnackBar)
	},[])

	return (
		<Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
			{CardRecapService("Pont", "pont", recapPont)}
			{CardRecapService("Machine", "machine", recapMachine)}
			{CardRecapService("Extérieur", "exterieur", recapExterieur)}
			{CardRecapService("Électro", "electro", recapElectro)}
			{CardRecapService("Hôtellerie", "hotellerie", recapHotellerie)}
			{!!snackbar && (
				<Snackbar
					open
					anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
					onClose={setSnackbar(false)}
					autoHideDuration={1500}
				>
					<Alert {...snackbar} variant="filled" />
				</Snackbar>
			)}
		</Box>
	)
}
