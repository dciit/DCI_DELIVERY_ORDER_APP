import React, { useState } from 'react'
import { Box, Grid } from '@mui/material';

function Toolbar() {
    const [SystemName, SetSystemName] = useState('DELIVERY ORDER');
    return (
        // <Box height={75} >
        //     <Grid container style={{ height: '100%' }}>
                <div className='flex bg-red-500 justify-center items-center text-white'>
                    {SystemName}
                </div>
        //     </Grid>
        // </Box>
    )
}

export default Toolbar