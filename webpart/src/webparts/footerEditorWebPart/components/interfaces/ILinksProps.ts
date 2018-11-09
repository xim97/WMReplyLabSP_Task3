import { IGroup } from "../../FooterEditorWebPartWebPart";

export interface ILinksProps {
    group: IGroup;
    index: number;
    handleClickEditLinkButton: any;
    handleClickDeleteLinkButton: any;
    handleClickUpButton: any;
    handleClickDownButton: any;
    handleSaveEditLinkButton: any;
}
