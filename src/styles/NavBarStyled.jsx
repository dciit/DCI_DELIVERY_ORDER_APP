import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";

export const NavLink = styled(Link)`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    cursor:pointer;
    color:rgb(112 111 111) !important;
    &:hover {
        background:#ddd;
    }
    &.active {
        background:#ddd;
    }
`
export const NavIcon = styled(FaBars)`
    display:none;
    @media screen and (max-width:768px){
        display:block;
    }
`
export const NavLinkHome = styled(Link)`
    display:block;
    @media screen and (max-width:768px){
        display:none;
    }
`

export const NavMenus = styled.ul`
    display:block;
    height:100%;
    @media screen and (max-width:768px){
        display:none;
    }
`