import styled from "styled-components";
import { ListItemButton, Paper,TableCell,TableRow } from '@mui/material'
export const Item = styled(Paper)`
    background:red;
`
export const PaperMaster = styled(Paper)`
    padding:1rem;
    width:100%;
`
export const Buttons = styled.div`
    
`
export const Cell = styled(TableCell)`
    font-weight:'bold';
    text-align:center;
    color:red;
`

export const Li = styled.li`
    &.active {
        color:red;
    }
`
export const SubMenuItem = styled.div`
    padding:4px 8px;
    font-size:12px;
    color:#434343;
    cursor:pointer;
    border-left-color:#2196f3;
    transition: background 0.5s ease-out;
    &:hover,&.selected {
        background:#ececec;
        color:black;
        border-left-width:2px;
    }
`

export const MenuItem = styled.div`
    display:flex;
    flex-direction:column;
    // gap:8px;
    align-items:center;
    padding:8px 16px;
    color:#434343;
    cursor:pointer;
    border-left-color:#2196f3;
    transition: background 0.5s ease-out;
    transition: border 0.1s ease-out;
    border-radius:4px;
    &:hover,&.selected {
        background:#ececec;
        color:black;
        // border-left-width:4px;
    }
`

// export const SubMenuItem = styled(ListItemButton)`
//     color:red;
//     &.active {
//         color:white !important;
//     }
//     &.selected {
//         color:white !important;
//     }
// `