'use client'
import * as React from 'react';

import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import Box from '@mui/material/Box'
import CssBaseLine from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'

import type {Metadata} from "next"
//export const metadata: Metadata = {
//	title: "Sogeco",
//	description: "Solution Open source de Gestion des Commandes",
//}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	
	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? 'dark' : 'light',
				},
			}),
			[prefersDarkMode],
		);

	return (
		<ThemeProvider theme={theme}>
			<html lang="fr">
				<body>
					<AppRouterCacheProvider>
						<CssBaseLine />
						{children}
					</AppRouterCacheProvider>
				</body>
			</html>
		</ThemeProvider>
	)
}
