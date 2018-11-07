import * as React from 'react';
import { INewGroupInputProps } from "./INewGroupInputProps";

export default class NewGroupInput extends React.Component<INewGroupInputProps, {}> {
    public render(): React.ReactElement<INewGroupInputProps> {
        return (
            <div>
                <label>
                    Name of new group
                    <input
                        type="text"
                        value={this.props.value}
                        onChange={(event) => this.props.onInputChange(event)}
                    />
                    <button
                        onClick={(event) => this.props.onClickAddGroup(event)}
                    >
                        Add group
                    </button>
                </label>
            </div>
        );
    }
}