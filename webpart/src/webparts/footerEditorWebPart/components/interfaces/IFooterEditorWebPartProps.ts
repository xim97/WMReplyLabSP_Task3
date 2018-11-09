import { IGroup } from "../../FooterEditorWebPartWebPart";
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export interface IFooterEditorWebPartProps {
  displayMode: number;
  data: Array<IGroup>;
  groupProperties: Array<IDropdownOption>;
}
