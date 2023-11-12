import { Button, Card, Paper } from "@mui/material";
import styled from "styled-components";
export const Container = styled.div`
    padding:2rem 4rem;
    margin:0;
`

export const NavMenu = styled.div`
    width:200px;
    background:red;
`
export const TagFilter = styled(Card)`
    display:flex;
    align-items:center;
    margin-top:.5rem;
    margin-bottom:1rem;
    padding:.5rem 1rem;
    justify-content: space-between;
`
export const TagBodyDataHistory = styled(Card)`
    padding:1rem;
    margin-top:.75rem;
`

export const TagButton = styled.div`
    text-align:right;
    padding:0.15rem 0;
`

export const BodyAddQcStd = styled(Card)`
    border-bottom:1px solid #ddd;
    border-radius:4px;
    padding:2rem 2rem 1rem 2rem;
`