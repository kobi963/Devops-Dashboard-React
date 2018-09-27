import React from "react";
import Popup from "reactjs-popup";
import '../css/Popup.css'
export default (title) => (
    <div
        className={'tooltipBoundary'}
    >
        <Popup
            trigger={<button className="popup-container"> click for logs </button>}
            position={["top center", "bottom right", "bottom left"]}
            closeOnDocumentClick
            keepTooltipInside=".tooltipBoundary"
         children={title}/>
    </div>
);