import styled from "@emotion/styled";

export const BoxInput = styled.div`
    display:flex;
    flex-direction:column;
    transition: width 2s;
    width:50%;
    @media screen and (min-width:768px){
        width:50%;
    }
    @media screen and (min-width:1024px){
        width:35%;
    }
    @media screen and (min-width:1280px){
        width:25%;
    }
    @media screen and (min-width:1700px){
        width:20%;
    }
`
