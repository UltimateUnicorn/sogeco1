'use client'

import React, {useState, useEffect} from 'react'
import Link from 'next/link'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar';

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import {
	GridRowsProp,
	GridRowModesModel,
	GridRowModes,
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowEditStopReasons,
	GridFooter
} from '@mui/x-data-grid'

import {jsPDF} from 'jspdf'

async function getCommandes(service: number, handle1, handle2) {
	// Retourne la liste des commandes du service passé en argument.
	try{
		let recap = await fetch(`http://localhost:8080/commandes/${service}`)
		if (recap.ok) {
			recap = await recap.json()
			handle1(recap)
			handle2(false)
		}
		else {
			throw new Error(recap.status)
		}
	} catch (error) {
		setSnackbar({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
		console.error(error)
	}
}

export default function CommandesService({params}: {params: {service: string}}) {
	const [rows, setRows] = React.useState([])
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})
	const [rowSelectionModel, setRowSelectionModel] = React.useState([])
	const [chargement, setChargement] = React.useState(true)
	const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

	const handleRows = (data) => {setRows(data)}
	const handleChargement = (data) => {setChargement(data)}

	useEffect(() => {
		getCommandes(params.service, handleRows, handleChargement)
	},[])

	const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
		  event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id: GridRowId) => () => {
		console.log('handleSaveClick');
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleDeleteClick = (id: GridRowId) => async () => {
		try {
			const response = await fetch('http://localhost:8080/voyages/supprimer/' + id, {cache: 'no-store'});
			if (!response.ok) {throw new Error("La réponse n'est pas ok");}

			setRows(rows.filter((row) => row.id !== id));
		} catch (error) {
			console.error("Problème : ", error);
		}
	};

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true }});

		const editedRow = rows.find((row) => row.id === id);
		if (editedRow!.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const processRowUpdate = async (newRow: GridRowModel) => {
		console.log('processRowUpdate');

		if(newRow.isNew) {
			console.log('Nouvelle ligne : ' + newRow.id);
			try {
				const test = new URLSearchParams();
				test.set('id', newRow.id);
				test.set('number', newRow.number);
				test.set('start', newRow.start);
				test.set('end', newRow.end);

				const response = await fetch('http://localhost:8080/voyages/ajouter', {method: 'POST', cache: 'no-store', 'Content-Type': 'application/x-www-form-urlencoded', body: test});
				if (!response.ok) {throw new Error("La réponse n'est pas ok");}

			} catch (error) {
				console.error("Problème : ", error);
			}
		}

		if(!newRow.isNew) {
			console.log('Ligne modifiée : ' + newRow.id);
			console.log('Ligne modifiée : ' + newRow.end);
			try {
				const test = new URLSearchParams();
				test.set('id', newRow.id);
				test.set('number', newRow.number);
				test.set('start', newRow.start);
				test.set('end', newRow.end);

				const response = await fetch('http://localhost:8080/voyages/modifier/' + newRow.id, {method: 'POST', cache: 'no-store', 'Content-Type': 'application/x-www-form-urlencoded', body: test});
				if (!response.ok) {throw new Error("La réponse n'est pas ok");}

			} catch (error) {
				console.error("Problème : ", error);
			}
		}

		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columns: GridColDef[] = [
		{
			field: 'id',
			type: 'dateTime',
			headerName: 'Id',
			width: 180,
			headerAlign: 'center',
			align: 'center',
			valueGetter: (value) => {
				const date = new Date(value.value)
				return date
			}
		},
		{
			field: 'voyage',
			type: 'string',
			headerName: 'Voyage',
			width: 120,
			headerAlign: 'center',
			align: 'center',
		},
		{
			field: 'categorie',
			type: 'number',
			headerName: 'Catégorie',
			headerAlign: 'center',
			width: 120,
			align: 'center',
		},
		{
			field: 'service',
			type: 'number',
			headerName: 'Service',
			headerAlign: 'center',
			width: 120,
			align: 'center',
		},
		{
			field: 'demandeur',
			headerName: 'Demandeur',
			headerAlign: 'center',
			width: 200,
			align: 'center',
		},
		{
			field: 'assignee',
			headerName: 'Assignée à',
			headerAlign: 'center',
			width: 200,
			align: 'center',
			editable: true
		},
		{
			field: 'urgent',
			type: 'boolean',
			headerName: 'Urgent',
			headerAlign: 'center',
			width: 80,
			align: 'center',
			editable: true
		},
		{
			field: 'quantite',
			headerName: 'Quantité',
			headerAlign: 'center',
			width: 80,
			align: 'center',
		},
		{
			field: 'description',
			headerName: 'Description',
			headerAlign: 'center',
			flex: 1,
			align: 'center',
		},
		{
			field: 'status',
			headerName: 'Status',
			headerAlign: 'center',
			width: 120,
			align: 'center',
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 140,
			cellClassName: 'actions',
			getActions: ({id}) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveIcon />}
							label="Save"
				  			sx={{color: 'primary.main'}}
				  			onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
				  			icon={<CancelIcon />}
				  			label="Cancel"
				  			className="textPrimary"
				  			onClick={handleCancelClick(id)}
				  			color="inherit"
						/>
			  		]
				}

				return [
					<GridActionsCellItem
						icon={<DoneIcon color="success"/>}
						label="Valider"
						onClick={handleEditClick(id)}
						color="inherit"
			  		/>,
			  		<GridActionsCellItem
						icon={<CloseIcon color="error"/>}
						label="Anuuler"
						onClick={handleDeleteClick(id)}
						color="inherit"
			  		/>,
			  		<GridActionsCellItem
						icon={<VisibilityIcon color="primary"/>}
						label="Détails"
						href={"/commandes/detail/" + id}
						color="inherit"
			  		/>
				]
			}
		}
	]

	function customFooter() {
		return(
			<Box sx={{display: 'flex', borderTop: '1px solid #e0e0e0'}}>
				<Button onClick={listeCommandes}>Liste en PDF</Button>
				<Button onClick={listeEPI}>Affichage EPI</Button>
				<GridFooter sx={{flexGrow: 1, border: 0}}/>
			</Box>
		)
	}

	function listeCommandes() {
		// Génère un document PDF avec la liste des commandes sélectionnées.
		// Le document PDF s'ouvre dans une nouvelle page.

		const headers = [
			{id: "id", name: "id", width: 35, align: "center", padding: 0},
			{id: "voyage", name: "voyage", width: 20, align: "center", padding: 0},
			{id: "categorie", name: "categorie", width: 25, align: "center", padding: 0},
			{id: "service", name: "service", width: 25, align: "center", padding: 0},
			{id: "demandeur", name: "demandeur", width: 50, align: "center", padding: 0},
			{id: "assignee", name: "assignee", prompt: "assignée à", width: 50, align: "center", padding: 0},
			{id: "urgent", name: "urgent", width: 20, align: "center", padding: 0},
			{id: "quantite", name: "quantite", prompt: "qté", width: 20, align: "center", padding: 0},
			{id: "description", name: "description", width: 138, align: "center", padding: 0},
		]

		const contenu = []

		rows.filter((row) => rowSelectionModel.includes(row.id)).forEach((commande) => {
			{commande.assignee === "" ? commande.assignee = " " : {}}
			{commande.urgent ? commande.urgent = "oui" : commande.urgent = "non"}
			{commande.quantite = commande.quantite.toString()}
			contenu.push(
				{
					id: commande.id,
					voyage: commande.voyage,
					categorie: commande.categorie,
					service: commande.service,
					demandeur: commande.demandeur,
					assignee: commande.assignee,
					urgent: commande.urgent,
					quantite: commande.quantite,
					description: commande.description,
					status: commande.status
				}
			)
		})

		let doc = new jsPDF('landscape')
		doc.text("Bon de livraison", 5, 10)
		doc.table(5, 15, contenu, headers, {fontSize: 6})
		doc = doc.output('datauristring')
		
		const fenetre = window.open()
		fenetre?.document.write(`<iframe width='100%' height='100%' src=${doc}></iframe>`)
	}

	function listeEPI() {
		// Génère un document PDF avec la liste des EPIs (ou autre) sélectionnés et leurs récipiendaire.
		// Le document PDF s'ouvre dans une nouvelle page.

		const headers = [
			{id: "demandeur", name: "demandeur", width: 100, align: "center", padding: 0},
			{id: "quantite", name: "quantite", prompt: "qté", width: 20, align: "center", padding: 0},
			{id: "description", name: "description", width: 130, align: "center", padding: 0},
		]

		const contenu = []

		rows.filter((row) => rowSelectionModel.includes(row.id)).forEach((commande) => {
			{commande.assignee === "" ? commande.assignee = " " : {}}
			{commande.urgent ? commande.urgent = "oui" : commande.urgent = "non"}
			{commande.quantite = commande.quantite.toString()}
			contenu.push(
				{
					demandeur: commande.demandeur,
					quantite: commande.quantite,
					description: commande.description,
				}
			)
		})

		let doc = new jsPDF()
		doc.text("Merci de venir chercher vos EPIs", 10, 20)
		doc.table(10, 30, contenu, headers, {fontSize: 10})
		doc = doc.output('datauristring')
		
		const fenetre = window.open()
		fenetre?.document.write(`<iframe width='100%' height='100%' src=${doc}></iframe>`)
	}

	return (
		<Paper
			sx={{
				display: 'flex',
				flexGrow: 1,
				'& .actions': {color: 'text.secondary'},
				'& .textPrimary': {color: 'text.primary'}
			}}
		>
			<DataGrid
				checkboxSelection
				rows={rows}
				columns={columns}
				editMode="row"
				rowModesModel={rowModesModel}
				rowSelectionModel={rowSelectionModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowSelectionModelChange={(newModel) => setRowSelectionModel(newModel)}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				slots={{footer: customFooter}}
				loading={chargement}
				initialState={{
					sorting: {sortModel: [{field: 'id', sort: 'asc'}]},
					columns: {
						columnVisibilityModel: {
							id: false,
							categorie: false,
							service: false
						}
					}
				}}
			/>
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
		</Paper>
	)
}
