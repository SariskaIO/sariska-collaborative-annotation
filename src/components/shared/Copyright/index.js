import { Link, Typography } from '@material-ui/core'
import React from 'react'
import { SARISKA_COMPANY_NAME, SARISKA_WEBSITE } from '../../../config'

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={SARISKA_WEBSITE}>
        {SARISKA_COMPANY_NAME}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default Copyright