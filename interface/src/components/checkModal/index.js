import React from 'react';

import './styles.scss';

const CheckModal = ({phrase, check, cancel, button1, button2}) =>
    <div id = "checkModal" name = "CheckModal">
        <div id = "check">
            <h4>{phrase}</h4>
            <div id = "buttons">
                <button className = "level1" id = "delete" onClick = {check}>{button1}</button>
                <button className = "level3" id = "cancel" onClick = {cancel}>{button2}</button>  
            </div>
        </div>
    </div>

export default CheckModal;