'use client'

import React, {useState, useEffect} from 'react'

import Alert, {AlertProps} from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import {styled} from '@mui/material/styles'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'

import {
	GridRowsProp,
	GridRowModesModel,
	GridRowModes,
	DataGrid,
	GridColDef,
	GridToolbarContainer,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowEditStopReasons,
	GridFooter
} from '@mui/x-data-grid';

import * as dayjs from 'dayjs'
import 'dayjs/plugin/utc'
dayjs.extend(require('dayjs/plugin/utc'))
dayjs().format()

const StyledGridOverlay = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	'& .ant-empty-img-1': {fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626'},
	'& .ant-empty-img-2': {fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959'},
	'& .ant-empty-img-3': {fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',},
	'& .ant-empty-img-4': {fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c'},
	'& .ant-empty-img-5': {
		fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
		fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
	}
}))

function CustomNoRowsOverlay() {
	return (
		<StyledGridOverlay>
			<svg
				width="120"
				height="100"
				viewBox="0 0 184 152"
				aria-hidden
				focusable="false"
			>
			<g fill="none" fillRule="evenodd">
				<g transform="translate(24 31.67)">
					<ellipse
						className="ant-empty-img-5"
						cx="67.797"
						cy="106.89"
						rx="67.797"
						ry="12.668"
					/>
					<path
						className="ant-empty-img-1"
						d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
					/>
					<path
						className="ant-empty-img-2"
						d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
					/>
					<path
						className="ant-empty-img-3"
						d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
					/>
				</g>
				<path
					className="ant-empty-img-3"
					d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
				/>
				<g className="ant-empty-img-4" transform="translate(149.65 15.383)">
					<ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
					<path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
				</g>
			</g>
		</svg>
		<Box sx={{ mt: 1 }}>No Rows</Box>
		</StyledGridOverlay>
	)
}

export default function ListeVoyages() {
	const [rows, setRows] = React.useState([])
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})
	const [loadRows, setLoadRows] = React.useState(true)
	const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		getVoyages()
	},[])

	const getVoyages = async () => {
		try {
			let voyages = await fetch("http://localhost:8080/voyages/liste")
			if (voyages.ok) {
				voyages = await voyages.json()
				setRows(voyages)
				setLoadRows(false)
			}
			else {
				throw new Error(voyages.status)
			}

		} catch (error) {
			setLoadRows(false)
			setSnackbar({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
			console.error(error)
		}
	}

	const handleClose = () => {
		setSnackbar(null)
	}

	const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
		  event.defaultMuiPrevented = true
		}
	}

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
	}

	const handleSaveClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
	}

	const handleDeleteClick = (id: GridRowId) => async () => {
		try {
			const reponse = await fetch('http://localhost:8080/voyages/supprimer/' + id, {cache: 'no-store'})
			if (reponse.ok) {
				setSnackbar({children: 'Voyage supprimé !', severity: 'success'})
				setRows(rows.filter((row) => row.id !== id))
			}
			else {
				throw new Error(reponse.status)
			}

		} catch (error) {
			setSnackbar({children: "Erreur.", severity: 'error'})
			console.error(error)
		}
	};

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true }})

		const editedRow = rows.find((row) => row.id === id)
		if (editedRow!.isNew) {
			setRows(rows.filter((row) => row.id !== id))
		}
	}

	const processRowUpdate = async (newRow: GridRowModel) => {
		if(newRow.isNew) {
			try {

				let voyage = new URLSearchParams()
				voyage.set('id', newRow.id)
				voyage.set('number', newRow.number)
				voyage.set('start', dayjs.utc(newRow.start).format('YYYY-MM-DDTHH:mm:ss'))
				voyage.set('end', dayjs.utc(newRow.end).format('YYYY-MM-DDTHH:mm:ss'))
				
				voyage = await fetch('http://localhost:8080/voyages/ajouter', {method: 'POST', cache: 'no-store', 'Content-Type': 'application/x-www-form-urlencoded', body: voyage})

				if(voyage.ok) {
					const updatedRow = { ...newRow, isNew: false }
					setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
					setSnackbar({children: 'Voyage ajouté !', severity: 'success'})
					return updatedRow
				}

				if (!voyage.ok) {
				// TODO : passer erreur dans le bon type
					setSnackbar({children: "Erreur", severity: 'error'})
					throw new Error(voyage.body)
				}

			} catch (error) {
				console.error(error)
			}
		}

		if(!newRow.isNew) {
			try {
				const test = new URLSearchParams()
				test.set('id', newRow.id)
				test.set('number', newRow.number)
				test.set('start', dayjs.utc(newRow.start).format('YYYY-MM-DDTHH:mm:ss'))
				test.set('end', dayjs.utc(newRow.end).format('YYYY-MM-DDTHH:mm:ss'))

				//const response = await fetch('http://localhost:8080/voyages/modifier/' + newRow.id, {method: 'POST', cache: 'no-store', 'Content-Type': 'application/x-www-form-urlencoded', body: test})
				const response = await fetch('http://localhost:8080/voyages/modifier', {method: 'POST', cache: 'no-store', 'Content-Type': 'application/x-www-form-urlencoded', body: test})

				if(response.ok) {
					const updatedRow = { ...newRow, isNew: false }
					setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
					setSnackbar({children: 'Voyage modifié !', severity: 'success'})
					return updatedRow
				}

				if (!response.ok) {
					throw new Error("Erreur SQL")
				}

			} catch (error) {
				console.error("Impossible de joindre l'API : ", error)
			}
		}
	}

	const handleProcessRowUpdateError = async (newRow: GridRowModel) => {
		
	}

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel)
	}

	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: 'Id',
			width: 180,
			headerAlign: 'center',
			align: 'center',
			editable: true
		},
		{
			field: 'number',
			headerName: 'Voyage',
			width: 120,
			headerAlign: 'center',
			align: 'center',
			editable: true
		},
		{
			field: 'start',
			headerName: 'Début',
			width: 180,
			headerAlign: 'center',
			align: 'center',
			editable: true,
			type: 'date',
			valueGetter: (value) => {
				const date = new Date(value)
				return date
			}
		},
		{
			field: 'end',
			headerName: 'Fin',
			width: 180,
			headerAlign: 'center',
			align: 'center',
			editable: true,
			type: 'date',
			valueGetter: (value) => {
				const date = new Date(value)
				return date
			}
		},
		{
		  field: 'actions',
		  type: 'actions',
		  headerName: 'Actions',
		  width: 100,
		  cellClassName: 'actions',
		  getActions: ({id}) => {
			const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

			if (isInEditMode) {
			  return [
				<GridActionsCellItem
				  icon={<SaveIcon />}
				  label="Save"
				  sx={{
					color: 'primary.main',
				  }}
				  onClick={handleSaveClick(id)}
				/>,
				<GridActionsCellItem
				  icon={<CancelIcon />}
				  label="Cancel"
				  className="textPrimary"
				  onClick={handleCancelClick(id)}
				  color="inherit"
				/>,
			  ];
			}

			return [
			  <GridActionsCellItem
				icon={<EditIcon />}
				label="Edit"
				className="textPrimary"
				onClick={handleEditClick(id)}
				color="inherit"
			  />,
			  <GridActionsCellItem
				icon={<DeleteIcon />}
				label="Delete"
				onClick={handleDeleteClick(id)}
				color="inherit"
			  />,
			];
		  },
		},
	];

	function customFooter(props: CustomFooterProps) {
		return(
			<Box sx={{display: 'flex', borderTop: '1px solid #e0e0e0'}}>
				<Box sx={{display: 'flex', position: 'relative'}}>
					<Button
						startIcon={<AddIcon />}
						onClick={nouveauVoyage}
						disabled={loading}
					>
						Nouveau voyage
					</Button>
					{loading && (
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
				</Box>
				<GridFooter sx={{flexGrow: 1, border: 0}}/>
			</Box>
		)
	}

	async function nouveauVoyage() {
		let voyage
		setLoading(true)

		try {
			let prochain = await fetch("http://localhost:8080/voyages/prochain")
			if (prochain.ok) {
				voyage = await prochain.json()
				setLoading(false)
			}
			else {
				throw new Error(prochain.status)
			}

		} catch (error) {
			setSnackbar({children: "Erreur. Consultez la console pour plus d'informations.", severity: 'error'})
			console.error(error)
		}

		setRows((oldRows) => [...oldRows, {id: voyage.id, number: voyage.number, start: voyage.start, end: voyage.end, isNew: true }])
		setRowModesModel((oldModel) => ({...oldModel, [voyage.id]: { mode: GridRowModes.Edit, fieldToFocus: 'number' }}))
	}

	return (
		<Paper
			sx={{
				minHeight: '0',
				flexGrow: 1,
				'& .actions': {color: 'text.secondary'},
				'& .textPrimary': {color: 'text.primary'}
			}}
		>
			<DataGrid
				rows={rows}
				columns={columns}
				editMode="row"
				rowModesModel={rowModesModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				onProcessRowUpdateError={handleProcessRowUpdateError}
				slots={{footer: customFooter, noRowsOverlay: CustomNoRowsOverlay}}
				initialState={{sorting: {sortModel: [{field: 'id', sort: 'asc'}]}}}
				loading={loadRows}
			/>
			{!!snackbar && (
				<Snackbar
					open
					anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
					onClose={handleClose}
					autoHideDuration={2000}
				>
					<Alert {...snackbar} variant="filled" />
				</Snackbar>
			)}
		</Paper>
	)
}
