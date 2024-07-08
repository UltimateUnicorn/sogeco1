import React from 'react'
import Link from 'next/link'
//import {logOut} from '../../lib/authentification'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import HomeIcon from '@mui/icons-material/Home'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout';

export default function BarreSuperieure() {
	return (
		<AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
			<Toolbar>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{mr: 2}}
					component={Link}
					href="/"
				>
					<HomeIcon />
				</IconButton>
				<List>
					<ListItem key="nouvelleCommande" disablePadding>
						<ListItemButton sx={{textAlign: 'center'}} component={Link} to="/commandes/nouvelle">
							<ListItemText primary="Nouvelle commande" sx={{verticalAlign: 'middle'}} />
						</ListItemButton>
					</ListItem>
				</List>
				<Box sx={{flexGrow: 1}} />
				<IconButton
					edge="start"
					color="inherit"
					aria-label="logout"
				>
					<LogoutIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}
