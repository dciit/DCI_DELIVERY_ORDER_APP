import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'

function TableComponent(props) {
    const { header, data, loading } = props;
    return (
        <TableContainer component={Paper}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        {/* <TableCell>#</TableCell>
                        <TableCell>รหัส</TableCell>
                        <TableCell>ชื่อ</TableCell>
                        <TableCell>จัดส่งขั้นต่ำ (กล่อง)</TableCell>
                        <TableCell>จัดส่งสูงสุด (กล่อง)</TableCell>
                        <TableCell>เครื่องมือ</TableCell> */}
                        {
                            header.map((item, key) => {
                                return <TableCell key={key}>{item.text}</TableCell>
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        loading ? <TableRow><TableCell><CircularProgress /></TableCell></TableRow> : data
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableComponent