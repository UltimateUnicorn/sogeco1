'use client'

import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import {login} from '@/lib/actions'
import {useFormState} from 'react-dom'

export default function SignInSide() {
	//const [formState, formAction] = useFormState(login, loginInitialState)
	const [formState, formAction] = useFormState(login, undefined)

	return (
		<Grid container component="main" sx={{height: '100vh'}}>
			<Grid
				item
				xs={false}
				sm={4}
				md={7}
				sx={{
					bgcolor: '#e1e1e1',
					backgroundImage: 'url("/login/papillon_aranui.png")',
					backgroundSize: '80%',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat'
				}}
			/>

			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<Box
					sx={{
						my: 8,
						mx: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>

					<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
						<LockOutlinedIcon />
					</Avatar>

					<Box component="form" noValidate action={login} sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							name="username"
							label="Nom d'utilisateur"
							autoFocus
						/>
						
						<TextField
							margin="normal"
							required
							fullWidth
							id="password"
							name="password"
							label="Mot de passe"
							type="password"
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Se connecter
						</Button>

					</Box>
				</Box>
			</Grid>
		</Grid>
	)
}
