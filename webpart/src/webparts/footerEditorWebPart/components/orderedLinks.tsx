import * as React from 'react';

export const orderedLinks = (item:any, index:number): JSX.Element => {    
    return (
        <span>            
            {item.url}{" "}{item.title}{" "}{item.hoverText}
        </span>
    );
};