import { IGroup } from "../../FooterEditorWebPartWebPart";
import { IInput } from "./IInputDataState";

export interface INewLinkInputProps {
    group: IGroup;
    inputs: Array<IInput>;
    index: number;
    handleInputChange: any;
    setNewInput: any;
}
