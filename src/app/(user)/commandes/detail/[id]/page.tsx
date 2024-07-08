'use client'

import React, {useState, useEffect} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {MuiFileInput} from 'mui-file-input'
import Image from 'next/image'
import Link from 'next/link'

import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import Paper from '@mui/material/Paper'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import AttachFileIcon from '@mui/icons-material/AttachFile'
import ClearIcon from '@mui/icons-material/Clear'


import {enregistrementCommentaire} from './enregistrementCommentaire'

const steps = [
	'Validation',
	'Assignation',
	'Préparation',
	'Livraison',
	'Réception partielle',
	'Reception complète',
	'Clôture',
	'Annulée'
]

interface Commande {
	id: string,
	voyage: string,
	categorie: string,
	service: string,
	demandeur: string,
	assignee: string | null,
	urgent: boolean,
	quantite: number,
	description: string,
	status: number,
	ignoree: string,
	historique: string
}

export default function DetailCommandeId({params}: {params: {id: string}}) {
	const [commande, setCommande] = useState<Commande>({})
	const [assignee, setAssignee] = React.useState(null)
	const [etapesIgnorees, setEtapesIgnorees] = useState([])
	const [historique, setHistorique] = useState([])

	const [employes, setEmployes] = React.useState([])
	const [etapeOptionnelle, setEtapeOptionnelle] = useState<boolean>(false)
	const [quantitePartielle, setQuantitePartielle] = React.useState('')

	const [chargementValider, setChargementValider] = React.useState<boolean>(false)
	const [chargementIgnorer, setChargementIgnorer] = React.useState<boolean>(false)

	const [afficherAssignation, setAfficherAssignation] = React.useState<boolean>(false)
	const [chargementValiderAssignation, setChargementValiderAssignation] = React.useState<boolean>(false)

	const [afficherReception, setAfficherReception] = React.useState<boolean>(false)
	const [chargementValiderReception, setChargementValiderReception] = React.useState<boolean>(false)

	const [afficherNouvCom, setAfficherNouvCom] = React.useState<boolean>(false)
	const {control, handleSubmit} = useForm({defaultValues:{file: undefined}})
	const [commentaire, setCommentaire] = React.useState()
	const [fichier, setFichier] = React.useState(null)

	const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

	const idCommande = params.id
	const enregistrementCommentaireId = enregistrementCommentaire.bind(null, idCommande)

	useEffect(() => {
		getEmployes()
		getCommande(params.id)
	},[])

	useEffect(() => {
		verifierEtapeOptionnelle()
	},[commande, etapesIgnorees])

	async function getEmployes() { 
		try {
			let liste_employes = await fetch("http://localhost:8080/commandes/listepersonnel")
			if (liste_employes.ok) {
				liste_employes = await liste_employes.json()
				setEmployes(liste_employes)
			}
			else {
				throw new Error(liste_employes.status)
			}
		} catch (error) {
			//setSnackbar({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
			console.error(error)
		}
	}

	async function getCommande(id: string) {
		// Retourne la commande don l'id est passé en argument.
		let commandes = await fetch(`http://localhost:8080/commandes/detail/${id}`)
			commandes = await commandes.json()
			setCommande(commandes[0])
			setHistorique(JSON.parse(commandes[0].historique))
			setEtapesIgnorees(JSON.parse(commandes[0].ignoree))
			if (commandes[0].assignee !== '') {setAssignee(commandes[0].assignee)}
			
	}

	function Historique(entree) {
		return(
			<Paper sx={{p: 2, mt: 2}} key={entree.id}>
				<Box><Typography sx={{color: 'text.secondary'}}>{entree.id} - {entree.auteur}</Typography></Box>
				<Box>{entree.commentaire}</Box>
				<Box sx={{flexGrow: 1}}>
					<Grid container spacing={2}>
						{HistoriqueImage(entree)}
						{HistoriquePJ(entree)}
					</Grid>
				</Box>
			</Paper>
		)
	}

	function HistoriqueImage(entree) {
		if(entree.hasOwnProperty('images')) {
			return(
				entree.images.map((image) => (
					<Grid xs={3} display="flex" justifyContent="center" key={image}>
						<Image
							alt="image"
							src={image}
							height={150}
							width={275}
						/>
					</Grid>
				))
			)
		}
	}

	function HistoriquePJ(entree) {
		if(entree.hasOwnProperty('pj')) {
			return(
				entree.pj.map((pj) => (
					<Grid xs={3} display="flex" justifyContent="center" key={pj}>
						<Link href="/pj1.pdf" target="_blank">
							<AttachFileIcon />
						</Link>
					</Grid>
				))
			)
		}
	}

	function validerEtape() {
		setChargementValider(true)
		if (commande.status === 0 || commande.status === 2 || commande.status === 3 || commande.status === 5) {maj_status()}
		if (commande.status === 1 && (assignee === null)) {setAfficherAssignation(true)}
		if (commande.status === 1 && assignee !== null) {maj_status()}
		if (commande.status === 4 && (quantitePartielle === '')) {setAfficherReception(true)}
		if (commande.status === 4 && (quantitePartielle !== '')) {maj_status()}
		if (commande.status === 5) {maj_status()}
		if (commande.status === 6) {cloturer()}
	}
	
	function ignorerEtape() {
		setChargementIgnorer(true)
		setEtapesIgnorees(etapesIgnorees.concat(commande.status))
		maj_status()
	}

	async function cloturer() { 
		try {
			let cloture = await fetch(`http://localhost:8080/commandes/cloturer/${params.id}`)
			if (cloture.ok) {
				console.log("commande clôturée")
				setChargementValider(false)
			}
			else {
				throw new Error(liste_employes.status)
			}
		} catch (error) {
			setSnackbar({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
			console.error(error)
		}
	}

	async function maj_status() {
		try {
			let maj_status = await fetch(`http://localhost:8080/commandes/status/${params.id}/${commande.status + 1}`)
			if (maj_status.ok) {
				setChargementValider(false)
				setChargementIgnorer(false)
				setCommande({...commande, status: commande.status + 1})
			}
			else {
				throw new Error(maj_status.status)
			}
		} catch (error) {
			setSnackbar({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
			console.error(error)
		}
	}

	function verifierEtapeOptionnelle() {
		if (commande.status === 4) {setEtapeOptionnelle(true)}
		if ((commande.status === 5) && (etapesIgnorees.includes(4))) {setEtapeOptionnelle(false)}
	}

	async function validerAssignation() {
		if (assignee) {
			try {
				setChargementValiderAssignation(true)
				let fonctions = await fetch(`http://localhost:8080/commandes/assignation/${params.id}/${assignee.id}`)
				if (fonctions.ok) {
					setChargementValiderAssignation(false)
					setAfficherAssignation(false)
					setCommande({...commande, assignee: assignee.nom})
					validerEtape()
				}
				else {
					throw new Error(fonctions.status)
				}

			} catch (error) {
				setSnackbar({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
				console.error(error)
			}
		}
	}

	function annulerAssignation() {
		setAssignee(null)
		setAfficherAssignation(false)
		setChargementValider(false)
	}

	async function validerReceptionPartielle() {
		if (assignee) {
			try {
				setChargementValiderReception(true)
				let fonctions = await fetch(`http://localhost:8080/commandes/reception/${params.id}/${quantitePartielle}`)
				if (fonctions.ok) {
					setAfficherReception(false)
					setChargementValiderReception(false)
					validerEtape()
				}
				else {
					throw new Error(fonctions.status)
				}

			} catch (error) {
				setSnackbar({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
				console.error(error)
			}
		}
	}

	function annulerReceptionPartielle() {
		setAfficherReception(false)
		setChargementValider(false)
	}

	function handleAfficher() {
		setAfficherNouvCom(!afficherNouvCom)
	}

	const handleChange = (newFile) => {
		setFichier(newFile)
	}

	return (
		<React.Fragment>
			<Paper sx={{p: 2}}>
				<Box>
					<Box sx={{py: 2}}>
						<Stepper activeStep={commande.status === undefined ? -1 : commande.status} alternativeLabel>
							{steps.map((label, index) => {
								const stepProps: {completed?: boolean} = {}
								{(
									(index < commande.status) && !etapesIgnorees.includes(index) ||
									(index === 6) && (commande.status === 6) && !etapesIgnorees.includes(index)
								) ? stepProps.completed = true : stepProps.completed = false}
								return(
									<Step key={index} {...stepProps}>
											<StepLabel>{label}</StepLabel>
									</Step>
								)
							})}
						</Stepper>
					</Box>

					<Box sx={{p: 2, display: 'flex'}}>
						<Box sx={{flexGrow: 1}}>
							<ButtonGroup>
								<Button onClick={validerEtape} disabled={chargementValider} variant="outlined" color="success">{(commande.status === 6) ? "Clôturer" : "Valider"}
								{chargementValider && (
									<CircularProgress
										size={24}
										sx={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											marginTop: '-12px',
											marginLeft: '-12px',
										}}
									/>
								)}
								</Button>
								<Button onClick={ignorerEtape} disabled={!etapeOptionnelle} variant="outlined" color="warning">Ignorer
								{chargementIgnorer && (
									<CircularProgress
										size={24}
										sx={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											marginTop: '-12px',
											marginLeft: '-12px',
										}}
									/>
								)}
								</Button>
							</ButtonGroup>
						</Box>
						<Button variant="outlined" color="error">Annuler la commande</Button>
					</Box>

					<Divider />

					<Box>
						<Box sx={{pt: 1}}><b>Date d'enregistrement :</b> {commande.id}</Box>
						<Box sx={{pt: 1}}><b>Categorie :</b> {commande.categorie}</Box>
						<Box sx={{pt: 1}}><b>Service :</b> {commande.service}</Box>
						<Box sx={{pt: 1}}><b>Demandeur :</b> {commande.demandeur}</Box>
						<Box sx={{pt: 1}}><b>Assignée à :</b> {commande.assignee}</Box>
						<Box sx={{pt: 1}}><b>Priorité :</b> {(commande.hasOwnProperty("urgent")) ? ((commande.urgent === false) ? "Normale" : "Urgent") : null}</Box>
						<Box sx={{pt: 1}}><b>Quantité :</b> {commande.quantite}</Box>
						<Box sx={{pt: 1}}><b>Description :</b> {commande.description}</Box>
					</Box>
				</Box>
			</Paper>

			{historique.map((entree) => (Historique(entree)))}

			<Paper sx={{mt: 2}}>
				<Box sx={{p: 2}}>
					<form action={enregistrementCommentaireId}>
						<Controller
							control={control}
							name="commentaire"
							render={({field}) => (
								<TextField
									{...field}
									fullWidth={true}
									value={commentaire}
									label="Commentaire"
									multiline
									rows={4}
								/>
							)}
						/>

						<Controller
							control={control}
							name="file"
							render={({field, fieldState}) => (
								<MuiFileInput
									{...field}
									sx={{pt: 2}}
								/>
							)}
						/>

						<Box sx={{p: 1}}>
							<Button type="submit" variant="contained" size="large">Enregistrer</Button>
						</Box>
					</form>
				</Box>
			</Paper>

			<Dialog scroll="paper" open={afficherAssignation}>
				<DialogTitle>Attribuer à</DialogTitle>
				<DialogContent>
					<Box sx={{pt: 1}}>
					<Autocomplete
						sx={{width: 300}}
						options={employes}
						renderInput={(params) => <TextField {...params} label="Demandeur"/>}
						value={assignee}
						onChange={(_, value) => setAssignee(value)}
						getOptionLabel={(option) => option.nom}
						groupBy={(option) => option.groupe}
						disablePortal={false}
					/>
					</Box>
					<DialogActions>
						<Button onClick={validerAssignation} disabled={chargementValiderAssignation}>Valider
							{chargementValiderAssignation && (
								<CircularProgress
									size={24}
									sx={{
									  position: 'absolute',
									  top: '50%',
									  left: '50%',
									  marginTop: '-12px',
									  marginLeft: '-12px',
									}}
								/>
							)}
						</Button>
						<Button onClick={annulerAssignation}>Annuler</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>

			<Dialog scroll="paper" open={afficherReception}>
				<DialogTitle>Quantité reçue</DialogTitle>
				<DialogContent>
					<Box sx={{pt: 1}}>
						<TextField
							sx={{width: 300}}
							value={quantitePartielle}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuantitePartielle(event.target.value)}
							label="Quantité partielle"
							variant="outlined"
						/>
					</Box>
					<DialogActions>
						<Button onClick={validerReceptionPartielle}>Valider
							{chargementValiderReception && (
								<CircularProgress
									size={24}
									sx={{
									  position: 'absolute',
									  top: '50%',
									  left: '50%',
									  marginTop: '-12px',
									  marginLeft: '-12px',
									}}
								/>
							)}
						</Button>
						<Button onClick={annulerReceptionPartielle}>Annuler</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>

			{!!snackbar && (
				<Snackbar
					open
					anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
					onClose={handleClose}
					autoHideDuration={1500}
				>
					<Alert {...snackbar} variant="filled" />
				</Snackbar>
			)}
		</React.Fragment>
	)
}
