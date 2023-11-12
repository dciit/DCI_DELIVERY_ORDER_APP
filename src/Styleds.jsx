import { styled } from "styled-components";

export const ToolbarTitle = styled.div`
    font-size:2rem;
    font-family: 'Josefin Sans', cursive;
    color:#fff;
`
export const selectStyle = {
    height: '1.75rem',
    color: 'white',
    fontSize: '14px',
    lineHeight: 2,
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#4effca60'
    },
    '& .MuiSvgIcon-root': {
        color: '#4effca'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#4effca',
    },
    "&:hover": {
        "&& fieldset": {
            border: "1px solid #4effca50"
        }
    }
}