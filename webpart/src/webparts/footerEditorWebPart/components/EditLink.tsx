import * as React from 'react';
import { IEditLinkProps } from "./IEditLinkProps";
import { IEditLinkState } from "./IEditLinkState";
import styles from "./FooterEditorWebPart.module.scss";
import { IInput } from "./IInputDataState";
import { ILink } from '../FooterEditorWebPartWebPart';

export default class EditLink extends React.Component<IEditLinkProps, IEditLinkState> {

    constructor(props) {
        super(props);
        let editingLink: ILink = this.props.group.links[this.props.editingLinkIndex];
        this.state = {
            inputs: {
                url: editingLink.url,
                fabricIcon: editingLink.fabricIcon,
                title: editingLink.title,
                hoverText: editingLink.hoverText,
                newTab: editingLink.newTab
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    private handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        let target = event.target;
        let property: string;
        property = target.id
        let inputs: IInput = this.state.inputs;
        inputs[property] = target.type !== "checkbox" ? target.value : target.checked;
        this.setState({ inputs: inputs });
        this.forceUpdate();
    }

    private getPropertyLayout(property: string) {
        switch (property) {
            case "title": {
                return (
                    <div className={styles.row}>
                        <h5>Input title</h5>
                        <input
                            type="text"
                            value={this.state.inputs.title}
                            onChange={this.handleInputChange}
                            id={"title"}
                        />
                    </div>

                );
            }
            case "url": {
                return (
                    <div className={styles.row}>
                        <h5>Input url</h5>
                        <input
                            type="text"
                            value={this.state.inputs.url}
                            onChange={this.handleInputChange}
                            id={"url"}
                        />
                    </div>
                );
            }
            case "hoverText": {
                return (
                    <div className={styles.row}>
                        <h5>Input text on hover</h5>
                        <input
                            type="text"
                            value={this.state.inputs.hoverText}
                            onChange={this.handleInputChange}
                            id={"hoverText"}
                        />
                    </div>
                );
            }
            case "newTab": {
                return (
                    <div className={styles.row}>
                        <h5>If need to open in new tab</h5>
                        <input
                            type="checkbox"
                            checked={this.state.inputs.newTab}
                            onChange={this.handleInputChange}
                            id={"newTab"}
                        />
                    </div>
                );
            }
            case "fabricIcon": {
                return (
                    <div className={styles.row}>
                        <h5>Input class of fabric icon</h5>
                        <input
                            type="text"
                            value={this.state.inputs.fabricIcon}
                            onChange={this.handleInputChange}
                            id={"fabricIcon"}
                        />
                    </div>
                );
            }
        }
    }

    public render(): React.ReactElement<IEditLinkProps> {
        return (
            <div>
                {
                    this.props.group.properties.map(property => {
                        return (
                            this.getPropertyLayout(property)
                        );
                    })
                }
                <button
                    id={this.props.index + ":" + this.props.editingLinkIndex}
                    onClick={(event) => {
                        this.props.handleSaveEditLinkButton(event, this.state.inputs);
                        this.props.resetEditingLinkIndex();
                    }}
                >
                    Save changes
                </button>
            </div>
        );
    }
}