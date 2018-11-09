import * as React from 'react';
import styles from './FooterEditorWebPart.module.scss';
import { IInputDataProps } from './interfaces/IInputDataProps';
import { IInputDataState, IInput } from './interfaces/IInputDataState';
import { IGroup, ILink } from '../FooterEditorWebPartWebPart';
import NewGroupInput from "./NewGroupInput";
import SelectionGroupProperties from "./SelectionGroupProperties";
import NewLinkInput from "./NewLinkInput";
import Links from "./Links";

export default class InputData extends React.Component<IInputDataProps, IInputDataState> {
    constructor(props) {
        super(props);
        this.state = {
            newGroupTitle: "",
            data: this.props.data,
            inputs: []
        };

        this.handleClickAddGroupButton = this.handleClickAddGroupButton.bind(this);
        this.handleClickAddLinkButton = this.handleClickAddLinkButton.bind(this);
        this.handleClickDeleteLinkButton = this.handleClickDeleteLinkButton.bind(this);
        this.handleClickSaveEditButton = this.handleClickSaveEditButton.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeInputNewGroupName = this.handleChangeInputNewGroupName.bind(this);

        this.handleClickUpButton = this.handleClickUpButton.bind(this);
        this.handleClickDownButton = this.handleClickDownButton.bind(this);

        this.handleClickPropertyCheckbox = this.handleClickPropertyCheckbox.bind(this);

        this.setNewInput = this.setNewInput.bind(this);

        this.removeUnnesesaryProperties = this.removeUnnesesaryProperties.bind(this);
    }

    private handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        let target = event.target;
        let property: string;
        let index: string;
        [property, index] = target.id.split(":");
        let inputs: Array<IInput> = this.state.inputs;
        inputs[parseInt(index, 10)][property] = target.type !== "checkbox" ? target.value : target.checked;
        this.setState({ inputs: inputs });
    }

    private handleChangeInputNewGroupName(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ newGroupTitle: event.target.value.trim() });
    }

    private handleClickAddGroupButton(): void {
        if (this.state.newGroupTitle.trim() !== "") {
            let data: Array<IGroup> = this.state.data;
            data.push({
                title: this.state.newGroupTitle,
                properties: [],
                links: []
            }
            );
            this.setState({ data: data, newGroupTitle: "" });
        }
    }

    private handleClickAddLinkButton(event: React.MouseEvent<HTMLButtonElement>): void {
        let target = event.currentTarget;
        let data: Array<IGroup> = this.state.data;
        let inputs: Array<IInput> = this.state.inputs;
        let index: number = parseInt(target.id);
        let input: IInput = inputs[index];
        data[index].links.push({
            url: input.url,
            title: input.title,
            hoverText: input.hoverText,
            fabricIcon: input.fabricIcon,
            newTab: input.newTab
        });
        inputs[index] = {
            url: "",
            title: "",
            hoverText: "",
            fabricIcon: "",
            newTab: false
        };
        this.setState({ data: data, inputs: inputs });
    }

    private handleClickDeleteLinkButton(event: React.MouseEvent<HTMLButtonElement>): void {
        let target = event.currentTarget;
        let data: Array<IGroup> = this.state.data;
        let groupIndex: string;
        let linkIndex: string;
        [groupIndex, linkIndex] = target.id.split(":");
        data[groupIndex].links.splice(linkIndex, 1);
        this.setState({ data: data });
    }

    private handleClickSaveEditButton(event: React.MouseEvent<HTMLButtonElement>, newLinkValue: IInput): void {
        let target = event.currentTarget;
        let data: Array<IGroup> = this.state.data;
        let groupIndex: string;
        let linkIndex: string;
        [groupIndex, linkIndex] = target.id.split(":");
        let edittingLink: ILink = data[groupIndex].links[linkIndex];
        for (var property in data[groupIndex].properties) {
            edittingLink[data[groupIndex].properties[property]] = newLinkValue[data[groupIndex].properties[property]];
        }
        this.setState({ data: data });
    }

    private handleClickUpButton(event: React.MouseEvent<HTMLButtonElement>): void {
        let target = event.currentTarget;
        let data: Array<IGroup> = this.state.data;
        let groupIndex: string;
        let linkIndex: string;
        [groupIndex, linkIndex] = target.id.split(":");
        let group: IGroup = data[groupIndex];
        let temp: ILink = group.links[linkIndex];
        group.links[linkIndex] = group.links[parseInt(linkIndex) - 1];
        group.links[parseInt(linkIndex) - 1] = temp;
        this.setState({ data: data });
    }

    private handleClickDownButton(event: React.MouseEvent<HTMLButtonElement>): void {
        let target = event.currentTarget;
        let data: Array<IGroup> = this.state.data;
        let groupIndex: string;
        let linkIndex: string;
        [groupIndex, linkIndex] = target.id.split(":");
        let group: IGroup = data[groupIndex];
        let temp: ILink = group.links[linkIndex];
        group.links[linkIndex] = group.links[parseInt(linkIndex) + 1];
        group.links[parseInt(linkIndex) + 1] = temp;
        this.setState({ data: data });
    }

    private handleClickPropertyCheckbox(event: React.MouseEvent<HTMLInputElement>): void {
        let target = event.currentTarget;
        let data: Array<IGroup> = this.state.data;
        let groupIndex: string;
        let property: string;
        [groupIndex, property] = target.id.split(":");
        if (target.checked) {
            data[groupIndex].properties.push(property);
        } else {
            data[groupIndex].properties.splice(data[groupIndex].properties.indexOf(property), 1);
            this.removeUnnesesaryProperties(groupIndex);
        }
        this.setState({ data: data });
    }

    private setNewInput(index: number): void {
        let inputs: Array<IInput> = this.state.inputs;
        if (inputs[index] === undefined) {
            inputs[index] = {
                title: "",
                url: "",
                hoverText: "",
                newTab: false,
                fabricIcon: ""
            };
            this.setState({ inputs: inputs });
        }
    }

    private removeUnnesesaryProperties(groupIndex: string): void {
        let data: Array<IGroup> = this.state.data;
        for (let linkIndex = 0;
            linkIndex < data[groupIndex].links.length;
            linkIndex++) {
            let currentLink: ILink = data[groupIndex].links[linkIndex];
            for (var currentLinkProperty in currentLink) {
                if (currentLink[currentLinkProperty] !== undefined &&
                    currentLink[currentLinkProperty] !== "" &&
                    data[groupIndex].properties.indexOf(currentLinkProperty) === -1) {
                    delete currentLink[currentLinkProperty];
                }
            }
        }
        this.setState({ data: data });
    }

    public render(): React.ReactElement<IInputDataProps> {
        return (
            <div>
                <NewGroupInput
                    value={this.state.newGroupTitle}
                    onInputChange={this.handleChangeInputNewGroupName}
                    onClickAddGroup={this.handleClickAddGroupButton}
                />
                <ul>
                    {
                        this.state.data.map((group, index) => {
                            return (
                                <li>
                                    <h4>{group.title}</h4>
                                    <SelectionGroupProperties
                                        properties={this.props.groupProperties}
                                        index={index}
                                        group={group}
                                        handleClickPropertyCheckbox={this.handleClickPropertyCheckbox}
                                    />
                                    <NewLinkInput
                                        index={index}
                                        group={group}
                                        inputs={this.state.inputs}
                                        handleInputChange={this.handleInputChange}
                                        setNewInput={this.setNewInput}
                                    />
                                    <button
                                        id={index.toString()}
                                        onClick={this.handleClickAddLinkButton}
                                    >Add link</button>
                                    <Links
                                        group={group}
                                        index={index}
                                        handleClickEditLinkButton={this.handleClickSaveEditButton}
                                        handleClickDeleteLinkButton={this.handleClickDeleteLinkButton}
                                        handleClickUpButton={this.handleClickUpButton}
                                        handleClickDownButton={this.handleClickDownButton}
                                        handleSaveEditLinkButton={this.handleClickSaveEditButton}
                                    />
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}
