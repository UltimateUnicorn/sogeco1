'use client'

import React, {useState, useEffect} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {MuiFileInput} from 'mui-file-input'
import fs from 'fs'

import Alert, {AlertProps} from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import TextField from '@mui/material/TextField'

import AttachFileIcon from '@mui/icons-material/AttachFile'
import CloseIcon from '@mui/icons-material/Close'

import {enregistrementCommande} from './enregistrementCommande'

type FormValues = {
	categorie: number
	service: number
	demandeur: number
	attribuee: number
	urgent: boolean
	quantite: string
	description: string
}

export default function NouvelleCommande() {
	const {control, handleSubmit} = useForm()
	const [categorie,setCategorie] = React.useState<number>(1)
	const [service, setService] = React.useState<number>(1)
	const [urgent, setUrgent] = React.useState<boolean>(false)
	const [employes, setEmployes] = React.useState([])
	const [quantite, setQuantite] = React.useState<string>()
	const [description, setDescription] = React.useState<string>()
	const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

	useEffect(() => {
		getEmployes()
	},[])

	const handleChangeCategorie = (event: React.MouseEvent<HTMLElement>, nCategorie: string) => {nCategorie !== null ? setCategorie(nCategorie) :{}}
	const handleChangeService = (event: React.MouseEvent<HTMLElement>, nService: string) => {nService !== null ? setService(nService) : {}}
	const handleChangeUrgent = (event: React.MouseEvent<HTMLElement>, nUrgent: string) => {nUrgent !== null ? setUrgent(nUrgent) : {}}

	const getEmployes = async () => {
		try {
			let fonctions = await fetch("http://localhost:8080/commandes/listepersonnel")
			if (fonctions.ok) {
				fonctions = await fonctions.json()
				setEmployes(employes.concat(fonctions))
			}
			else {
				throw new Error(fonctions.status)
			}

		} catch (error) {
			setSnackbar({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
			console.error(error)
		}
	}

	return (
		<Paper>
			<Box
				sx={{
					p: 2,
					width: '100%',
					'& .actions': {color: 'text.secondary'},
					'& .textPrimary': {color: 'text.primary'}
				}}
			>
				<form action={handleSubmit((data) => enregistrementCommande(data))}>
					<Box sx={{p: 1}}>
						<Controller
							control={control}
							name="categorie"
							defaultValue={categorie}
							render={({field: {onChange, value}}) => (
								<ToggleButtonGroup
									color="primary"
									value={categorie}
									exclusive
									onChange={(event, value) => {
										onChange(event)
										handleChangeCategorie(event, value)
									}}
									aria-label="Platform"
									sx={{flex: 3}}
								>
									<ToggleButton value={1} sx={{flex: 1}}>EPI</ToggleButton>
									<ToggleButton value={2} sx={{flex: 1}}>Papeterie</ToggleButton>
									<ToggleButton value={3} sx={{flex: 1}}>Pièces</ToggleButton>
									<ToggleButton value={4} sx={{flex: 1}}>Travaux</ToggleButton>
								</ToggleButtonGroup>
							)}
						/>
					</Box>
					<Box sx={{p: 1}}>
						<Controller
							control={control}
							name="service"
							defaultValue={service}
							render={({field: {onChange, value}}) => (
								<ToggleButtonGroup
									color="primary"
									value={service}
									exclusive
									onChange={(event, value) => {
										onChange(event)
										handleChangeService(event, value)
									}}
									aria-label="Platform"
									sx={{flex: 3}}
								>
									<ToggleButton value={1} sx={{flex: 1}}>Pont</ToggleButton>
									<ToggleButton value={2} sx={{flex: 1}}>Machine</ToggleButton>
									<ToggleButton value={3} sx={{flex: 1}}>Extérieur</ToggleButton>
									<ToggleButton value={4} sx={{flex: 1}}>Électro</ToggleButton>
									<ToggleButton value={5} sx={{flex: 1}}>Hôtellerie</ToggleButton>
								</ToggleButtonGroup>
							)}
						/>
					</Box>
					<Box sx={{p: 1}}>
						<Controller
							control={control}
							name="urgent"
							defaultValue={urgent}
							render={({field: {onChange, value}}) => (
								<ToggleButtonGroup
									color="primary"
									value={urgent}
									exclusive
									onChange={(event, value) => {
										onChange(event)
										handleChangeUrgent(event, value)
									}}
									aria-label="Platform"
									sx={{flex: 3}}
								>
									<ToggleButton value={false} sx={{flex: 1}}>Normal</ToggleButton>
									<ToggleButton value={true} sx={{flex: 1}}>Urgent</ToggleButton>
								</ToggleButtonGroup>
							)}
						/>
					</Box>
					<Box sx={{p: 1}}>
						<Controller
							control={control}
							name="demandeur"
							render={({field: {onChange, value}}) => (
								<Autocomplete
									disablePortal
									sx={{width: 300}}
									options={employes}
									renderInput={(params) => <TextField {...params} label="Demandeur"/>}
									onChange={(_, data) => onChange(data)}
									getOptionLabel={(option) => option.nom}
									groupBy={(option) => option.groupe}
								/>
							)}
						/>
					</Box>
					<Box sx={{p: 1}}>
						<Controller
							control={control}
							name="assignee"
							render={({field: {onChange, value}}) => (
								<Autocomplete
									disablePortal
									sx={{width: 300}}
									options={employes}
									renderInput={(params) => <TextField {...params} label="Assignée à"/>}
									onChange={(_, data) => onChange(data)}
									getOptionLabel={(option) => option.nom}
									groupBy={(option) => option.groupe}
								/>
							)}
						/>
					</Box>
					<Box sx={{p: 1}}>
						<Controller
							control={control}
							name="quantite"
							render={({field}) => (
								<TextField
									{...field}
									sx={{width: 300}}
									value={quantite}
									label="Quantité"
									variant="outlined"
								/>
							)}
						/>
					</Box>
					<Box sx={{p: 1}}>
						<Controller
							control={control}
							name="description"
							render={({field}) => (
								<TextField
									{...field}
									fullWidth={true}
									value={description}
									label="Description"
									multiline
									rows={4}
								/>
							)}
						/>
					</Box>
					<Box sx={{p: 1}}>
						<Button type="submit" variant="contained" size="large">Enregistrer</Button>
					</Box>
				</form>
			</Box>
		</Paper>
	)
}
