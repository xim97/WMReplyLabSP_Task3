import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { IGroup } from "../FooterEditorWebPartWebPart";

export interface ISelectionGroupPropertiesProps {
    properties: Array<IDropdownOption>;
    index: number;
    group: IGroup;
    handleClickPropertyCheckbox: any;
}
