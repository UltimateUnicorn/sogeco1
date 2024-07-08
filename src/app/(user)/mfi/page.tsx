'use client'

import React from 'react'
import {MuiFileInput} from 'mui-file-input'

export default function mfi() {
	const [file, setFile] = React.useState(null)

	const handleChange = (newFile) => {
		setFile(newFile)
	}

	return(
		<MuiFileInput
			value={file}
			onChange={handleChange}
			label="File"
			sx={{pt: 2}}
		/>
	)
}
