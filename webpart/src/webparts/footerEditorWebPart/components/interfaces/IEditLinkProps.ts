import { IGroup } from "../../FooterEditorWebPartWebPart";

export interface IEditLinkProps {
    editingLinkIndex: number;
    group: IGroup;
    index: number;
    handleSaveEditLinkButton: any;
    resetEditingLinkIndex: any;
}
