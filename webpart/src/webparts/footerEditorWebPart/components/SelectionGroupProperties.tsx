import * as React from 'react';
import { ISelectionGroupPropertiesProps } from "./ISelectionGroupPropertiesProps";
import styles from './FooterEditorWebPart.module.scss';

export default class SelectionGroupProperties extends React.Component<ISelectionGroupPropertiesProps, {}> {
    public render(): React.ReactElement<ISelectionGroupPropertiesProps> {        
        return (
            <div>
                {
                    this.props.index > 1 && this.props.properties.map(property => {
                        return (
                            <label>
                                <input
                                    type="checkbox"
                                    id={this.props.index + ":" + property.key}
                                    checked={this.props.group.properties.indexOf(property.key.toString()) !== -1}
                                    onClick={(event) => this.props.handleClickPropertyCheckbox(event)}
                                />
                                {property.text}
                            </label>
                        );
                    })
                }                
            </div>
        );
    }
}