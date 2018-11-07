import * as React from 'react';
import { ILinksProps } from "./ILinksProps";
import { ILinksState } from "./ILinkState";
import EditLink from "./EditLink";

export default class Links extends React.Component<ILinksProps, ILinksState> {
    constructor(props) {
        super(props);

        this.state = {
            editingLinkIndex: -1
        };

        this.handleClickEditLinkButton = this.handleClickEditLinkButton.bind(this);
        this.resetEditingLinkIndex = this.resetEditingLinkIndex.bind(this);
    }

    private handleClickEditLinkButton(event: React.MouseEvent<HTMLButtonElement>): void {
        let target: any = event.currentTarget;
        let linkIndex: number;
        linkIndex = parseInt(target.id.split(":")[1]);
        if (this.state.editingLinkIndex === -1 || this.state.editingLinkIndex !== linkIndex) {
            this.setState({ editingLinkIndex: linkIndex });
        } else {
            this.setState({ editingLinkIndex: -1 });
        }
    }

    private resetEditingLinkIndex(): void {
        this.setState({ editingLinkIndex: -1 });
    }

    public render(): React.ReactElement<ILinksProps> {
        return (
            <div>
                <ol>
                    {
                        this.props.group.links.map((link, linkIndex) => {
                            return (
                                <li>
                                    <p>{link.title} {link.url} {link.hoverText} {link.fabricIcon}</p>
                                    <button
                                        id={this.props.index + ":" + linkIndex}
                                        onClick={this.handleClickEditLinkButton}
                                    >Edit</button>
                                    <button
                                        id={this.props.index + ":" + linkIndex}
                                        onClick={(event) => this.props.handleClickDeleteLinkButton(event)}
                                    >Delete</button>
                                    {
                                        linkIndex !== 0 && <button
                                            id={this.props.index + ":" + linkIndex}
                                            onClick={(event) => this.props.handleClickUpButton(event)}
                                        >Up</button>
                                    }
                                    {
                                        linkIndex !== this.props.group.links.length - 1 && <button
                                            id={this.props.index + ":" + linkIndex}
                                            onClick={(event) => this.props.handleClickDownButton(event)}
                                        >Down</button>
                                    }
                                </li>
                            );
                        })
                    }
                </ol>
                {
                    this.state.editingLinkIndex !== -1 && <EditLink
                        editingLinkIndex={this.state.editingLinkIndex}
                        group={this.props.group}
                        index={this.props.index}
                        handleSaveEditLinkButton={this.props.handleSaveEditLinkButton}
                        resetEditingLinkIndex={this.resetEditingLinkIndex}
                    />
                }
            </div>

        );
    }
}