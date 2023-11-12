import { NavLink as Link } from 'react-router-dom'
import styled from 'styled-components'
import { FaBars, FaSearch, FaTrash } from 'react-icons/fa'

export const NavBar = styled.nav`
    background:#34a0ff;
    height:${props => props.show ? 'auto !important' : '85px'};
    display:flex;
    justify-content:space-between;
    padding:0.2rem calc((100vw - 1000px)/2);
    // @media screen and (max-width:768px){
       
    // }
`
export const NavLogo = styled(Link)`
    display:flex;
    align-items:center;
    text-decoration:none;
    font-size:1.5rem;
    font-weight:bold;
    color:#fff;
    @media screen and (max-width:768px){
        display:none;
    }
`
export const NavMenu = styled.ul`
    display:flex;
    align-items:center;
    list-style-type:none;
    height:auto;
    @media screen and (max-width:768px){
        display:${props => props.show ? 'block' : 'none'};
    }
`
export const NavLogout = styled.span`
    color:#fff;
    cursor:pointer;
`

export const NavList = styled.li`
    @media screen and (max-width:768px){
        padding:2rem 0;
    }
`
export const NavLink = styled(Link)`
    color:#fff;
    display:flex;
    align-items:center;
    text-decoration:none;
    padding: 0 1rem;
    cursor:pointer;
    &.active {
        color:#000;
    }
`

export const Bars = styled(FaBars)`
    color:#fff;
    display:none;
    @media screen and (max-width:768px){
        display:${props => props.show ? 'none' : 'block'};
        position:absolute;
        top:0;
        right:0;
        cursor:pointer;
        font-size:1.8rem;
        transform:translate(-100%,100%);
    }
`
export const FaSearchs = styled(FaSearch)`
`
export const FaTrashs = styled(FaTrash)`
`

export const Body = styled.div`
    display:flex;
    height:100%;
`

export const LeftMenu = styled.div`
    width:12.5rem;
    background:#fff;
    color:black;
    border-right: 1px solid #d9d9d9;
    @media screen and (max-width:768px){
        // display:none;
        width:5rem;
    }
`
export const LeftMenuItem = styled.li`
    list-style-type:none;
    padding:1rem 0 1rem 1rem;
    border-bottom:1px solid #ddd;
    cursor:pointer;
    color:rgb(75 75 75);
    transition:all .5s ease;
    &:hover {
        color:white;
        font-weight:bold;
        background:rgb(52 160 255 / 85%);
        padding-left:2rem;
    }
    // @media screen and (max-width:768px){
    //     display:none;
    // }
`

export const ImgUser = styled.img`
    width:35px;
    height:35px;
    border-radius:50%;
    cursor:pointer;
`

