import React from 'react';

import './styles.scss';

const CheckModal = ({phrase, check, cancel}) =>
    <div id = "checkModal" name = "CheckModal">
        <div id = "check">
            <h4>{phrase}</h4>
            <div id = "buttons">
                <button className = "level1" id = "delete" onClick = {check}>Delete</button>
                <button className = "level3" id = "cancel" onClick = {cancel}>Cancel</button>  
            </div>
        </div>
    </div>

export default CheckModal;