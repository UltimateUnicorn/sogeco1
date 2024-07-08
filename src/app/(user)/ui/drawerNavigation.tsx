import Link from 'next/link'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'

const drawerWidth = 240

const entete = [
	{nom: 'EPI', adresse: '/commandes/epi'},
	{nom: 'Papeterie', adresse: '/commandes/papeterie'}
]

const commandes = [
	{nom: 'Pont', adresse: '/commandes/pont'},
	{nom: 'Machine', adresse: '/commandes/machine'},
	{nom: 'Extérieur', adresse: '/commandes/exterieur'},
	{nom: 'Électro', adresse: '/commandes/electro'},
	{nom: 'Hôtellerie', adresse: '/commandes/hotellerie'}
]

const travaux = [
	{nom: 'Pont', adresse: '/commandes/pont'},
	{nom: 'Machine', adresse: '/commandes/machine'},
	{nom: 'Extérieur', adresse: '/commandes/exterieur'},
	{nom: 'Électro', adresse: '/commandes/electro'},
	{nom: 'Hôtellerie', adresse: '/commandes/hotellerie'}
]

const autres = [
	{nom: 'Voyages', adresse: '/voyages'},
	{nom: 'Commandes', adresse: '/commandes'},
	{nom: 'mfi', adresse: '/mfi'},
]

export default function DrawerNavigation() {
	return (
		<Drawer variant="permanent" sx={{width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'}}}>
			<Toolbar />
			<List>
				{entete.map((service) => (
					<ListItem key={service.nom} disablePadding>
						<ListItemButton component={Link} to={service.adresse}>
							<ListItemText primary={service.nom} />
						</ListItemButton>
					</ListItem>
				))}

				<Divider component="li">
					<Chip label="Commandes" />
				</Divider>

				{commandes.map((service) => (
					<ListItem key={service.nom} disablePadding>
						<ListItemButton component={Link} to={service.adresse}>
							<ListItemText primary={service.nom} />
						</ListItemButton>
					</ListItem>
				))}

				<Divider component="li">
					<Chip label="Travaux" />
				</Divider>

				{travaux.map((service) => (
					<ListItem key={service.nom} disablePadding>
						<ListItemButton component={Link} to={service.adresse}>
							<ListItemText primary={service.nom} />
						</ListItemButton>
					</ListItem>
				))}

				<Divider component="li">
					<Chip label="Autres" />
				</Divider>

				{autres.map((service) => (
					<ListItem key={service.nom} disablePadding>
						<ListItemButton component={Link} to={service.adresse}>
							<ListItemText primary={service.nom} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Drawer>
	)
}
