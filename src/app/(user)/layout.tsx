'use client'
import * as React from 'react';

import Box from '@mui/material/Box'
import CssBaseLine from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'

import BarreSuperieure from "./ui/barreSuperieure.tsx"
import DrawerNavigation from "./ui/drawerNavigation.tsx"

export default function userLayout({children}: Readonly<{children: React.ReactNode}>) {
	return (
		<Box sx={{display: 'flex', direction: 'column', height: '100vh'}}>
			<CssBaseLine />
			<BarreSuperieure />
			<DrawerNavigation />
			<Box component="main" sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}>
				<Toolbar />
				{children}
			</Box>
		</Box>
	)
}
