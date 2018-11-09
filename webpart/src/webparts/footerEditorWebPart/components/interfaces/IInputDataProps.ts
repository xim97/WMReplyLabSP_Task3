import { IGroup } from "../../FooterEditorWebPartWebPart";
import {IDropdownOption} from 'office-ui-fabric-react/lib/Dropdown';

export interface IInputDataProps {
    data: Array<IGroup>;
    groupProperties: Array<IDropdownOption>;
}
