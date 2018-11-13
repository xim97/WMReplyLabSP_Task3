import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPanePage,
  IPropertyPanePageHeader,
  PropertyPaneButton,
  PropertyPaneButtonType,
  IPropertyPaneDropdownOption,
  IPropertyPaneField
} from '@microsoft/sp-webpart-base';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import { PropertyFieldCollectionData, CustomCollectionFieldType, ICustomCollectionField } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { PropertyFieldOrder } from '@pnp/spfx-property-controls/lib/PropertyFieldOrder';
import { orderedLinks } from "./components/orderedLinks";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as strings from 'FooterEditorWebPartWebPartStrings';
import FooterEditorWebPart from './components/FooterEditorWebPart';
import { IFooterEditorWebPartProps } from './components/interfaces/IFooterEditorWebPartProps';
import * as $ from 'jquery'

export interface IFooterEditorWebPartWebPartProps {
  newGroupTitle: string;
  groups: Array<IGroup>;
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
  fabricIcon?: string;
  newTab?: boolean;
}

export default class FooterEditorWebPartWebPart extends BaseClientSideWebPart<IFooterEditorWebPartWebPartProps> {
  private groupProperties: Array<IPropertyPaneDropdownOption> = [
    {
      key: "title",
      text: strings.Title
    },
    {
      key: "url",
      text: strings.Link
    },
    {
      key: "hoverText",
      text: strings.HoverText
    },
    {
      key: "newTab",
      text: strings.NewTab
    },
    {
      key: "fabricIcon",
      text: strings.FabricIcon
    }
  ];

  public render(): void {
    const element: React.ReactElement<IFooterEditorWebPartProps> = React.createElement(
      FooterEditorWebPart,
      {
        displayMode: this.displayMode,
        data: this.properties.groups,
        groupProperties: this.groupProperties
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected removeUnnesesaryProperties(): void {
    for (let groupIndex = 0;
      groupIndex < this.properties.groups.length;
      groupIndex++) {
      for (let linkIndex = 0;
        linkIndex < this.properties.groups[groupIndex].links.length;
        linkIndex++) {
        let currentLink: ILink = this.properties.groups[groupIndex].links[linkIndex];
        for (var currentLinkProperty in currentLink) {
          if (currentLink[currentLinkProperty] !== undefined &&
            currentLink[currentLinkProperty] !== "" &&
            this.properties.groups[groupIndex].properties.indexOf(currentLinkProperty) === -1) {
            delete currentLink[currentLinkProperty];
          }
        }
      }
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    let generatedPages: Array<IPropertyPanePage> = [];
    this.removeUnnesesaryProperties();
    generatedPages.push(this.renderMainPageInPropertyPaneConfiguration());
    generatedPages.push(...this.renderGroupsPages());

    return {
      pages: generatedPages
    };
  }

  private renderMainPageInPropertyPaneConfiguration(): IPropertyPanePage {
    let header: IPropertyPanePageHeader = {
      description: strings.MainPage
    };
    let page: IPropertyPanePage = {
      header: header,
      groups: [{
        groupFields: [
          PropertyPaneTextField("newGroupTitle", {
            label: strings.AddGroupInputLabel,
            onGetErrorMessage: this.validateInputNewGroup.bind(this)
          }),
          PropertyPaneButton("groups", {
            text: strings.AddGroupButton,
            buttonType: PropertyPaneButtonType.Normal,
            onClick: this.handleClickAddButton.bind(this)
          })
        ]
      }]
    };
    return page;
  }

  private validateInputNewGroup(value: string): string {
    if (value === null || value.trim() === "") {
      return "Name should be not empty";
    }
    if (!this.isUniqueName(value)) {
      return "Name isn't unique";
    }
    return "";
  }

  private handleClickAddButton(): Array<IGroup> {
    if (this.properties.newGroupTitle.trim() !== "") {
      if (this.isUniqueName(this.properties.newGroupTitle)) {
        if (this.properties.groups !== undefined) {
          this.properties.groups.push({
            title: this.properties.newGroupTitle,
            properties: [],
            links: []
          });
        } else {
          this.properties.groups = [{
            title: this.properties.newGroupTitle,
            properties: [],
            links: []
          }];
        }
        this.onDispose();
      }

    }
    return this.properties.groups;
  }

  private isUniqueName(newName: string): boolean {
    if (this.properties.groups !== undefined) {
      return this.properties.groups.filter(group => group.title === newName.trim()).length === 0;
    }
  }

  private renderGroupsPages(): Array<IPropertyPanePage> {
    let header: IPropertyPanePageHeader;
    let page: IPropertyPanePage;
    let result: Array<IPropertyPanePage> = [];
    if (this.properties.groups !== undefined) {
      this.properties.groups.forEach((group, index) => {
        header = {
          description: group.title
        };
        page = {
          header: header,
          groups: [{
            groupFields: this.generateGroupFieldsForGroupPage(group, index)
          }]
        };
        result.push(page);
      });
    }

    return result;
  }

  private generateGroupFieldsForGroupPage(group: IGroup, index: number): Array<IPropertyPaneField<any>> {
    let fields: Array<IPropertyPaneField<any>> = [];
    if (index > 1) {
      fields.push(
        PropertyFieldMultiSelect(`groups[${index}].properties`, {
          key: `groups[${index}].properties`,
          label: "Multi select field",
          options: this.groupProperties,
          selectedKeys: this.properties.groups[index].properties
        })
      );
    }
    fields.push(
      PropertyFieldCollectionData(`groups[${index}].links`, {
        key: `groups[${index}].links`,
        label: strings.ListOfLinks,
        panelHeader: strings.ListOfLinks,
        manageBtnLabel: strings.AddLinksButton,
        value: this.properties.groups[index].links,
        fields: this.generateFieldForCollectionData(group.properties),
        disabled: false
      })
    );
    if (group.links !== undefined && group.links.length !== 0) {
      fields.push(
        PropertyFieldOrder("orderedLinks", {
          key: "orderedLinks",
          label: "Ordered Links",
          items: this.properties.groups[index].links,
          onRenderItem: orderedLinks,
          properties: this.properties,
          onPropertyChange: this.onPropertyPaneFieldChanged
        })
      );
    }
    return fields;
  }

  private generateFieldForCollectionData(properties: Array<string>): Array<ICustomCollectionField> {
    let fields: Array<ICustomCollectionField> = [];
    properties.sort().forEach(property => {
      switch (property) {
        case "title": {
          fields.push({
            id: "title",
            title: strings.Title,
            type: CustomCollectionFieldType.string,
            required: true
          });
          break;
        }
        case "url": {
          fields.push({
            id: "url",
            title: strings.Link,
            type: CustomCollectionFieldType.url,
            required: true
          });
          break;
        }
        case "hoverText": {
          fields.push({
            id: "hoverText",
            title: strings.HoverText,
            type: CustomCollectionFieldType.string,
            required: true
          });
          break;
        }
        case "newTab": {
          fields.push({
            id: "newTab",
            title: strings.NewTab,
            type: CustomCollectionFieldType.boolean
          });
          break;
        }
        case "fabricIcon": {
          fields.push({
            id: "fabricIcon",
            title: strings.FabricIcon,
            type: CustomCollectionFieldType.fabricIcon,
            required: true
          });
          break;
        }
      }
    });
    return fields;
  }

}
