import { IGroup } from "../../FooterEditorWebPartWebPart";

export interface IInputDataState {
    newGroupTitle: string;
    data: Array<IGroup>;
    inputs: Array<IInput>;    
}

export interface IInput {
    url: string;
    title?: string;
    hoverText?: string;
    newTab?: boolean;
    fabricIcon?: string;
}
