import * as React from 'react';
import { INewLinkInputProps } from "./interfaces/INewLinkInputProps";
import styles from './FooterEditorWebPart.module.scss';

export default class NewLinkInput extends React.Component<INewLinkInputProps, {}> {

    private getPropertyLayout(property: string) {
        switch (property) {
            case "title": {
                return (
                    <div className={styles.row}>
                        <h5>Input title</h5>
                        <input
                            type="text"
                            value={this.props.inputs[this.props.index].title}
                            onChange={(event) => this.props.handleInputChange(event)}
                            id={"title:" + this.props.index}
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
                            value={this.props.inputs[this.props.index].url}
                            onChange={(event) => this.props.handleInputChange(event)}
                            id={"url:" + this.props.index}
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
                            value={this.props.inputs[this.props.index].hoverText}
                            onChange={(event) => this.props.handleInputChange(event)}
                            id={"hoverText:" + this.props.index}
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
                            checked={this.props.inputs[this.props.index].newTab}
                            onChange={(event) => this.props.handleInputChange(event)}
                            id={"newTab:" + this.props.index}
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
                            value={this.props.inputs[this.props.index].fabricIcon}
                            onChange={(event) => this.props.handleInputChange(event)}
                            id={"fabricIcon:" + this.props.index}
                        />
                    </div>
                );
            }
        }
    }

    public render(): React.ReactElement<INewLinkInputProps> {
        return (
            <div>
                {
                    this.props.group.properties.map(property => {
                        this.props.setNewInput(this.props.index);
                        return (
                            this.getPropertyLayout(property))
                        ;
                    })
                }
            </div>
        );
    }
}