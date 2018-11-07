export interface IGroupProps {
    group: IGroup;
}

export interface IGroup {
    title: string;
    properties: Array<string>;
    links: Array<ILink>;
}

export interface ILink {
    url: string;
    title?: string;
    hoverText?: string;
    newTab?: boolean;
    fabricIcon?: string;
}