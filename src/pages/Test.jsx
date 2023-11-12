import React, { useEffect, useState } from 'react'

function Test() {
    const [data, setData] = useState({
        checked: true
    });
    const handleData = (checked) => {
        var item = data;
        item.checked = checked;
        setData({...data,checked:checked});

    }
    return (
        <div>
            {
                JSON.stringify(data)
            }
            <input type='checkbox' defaultChecked={true} onChange={(e) => handleData(e.target.checked)} />
            {
                data.checked && 'SHOW'
            }
        </div>
    )
}

export default Test