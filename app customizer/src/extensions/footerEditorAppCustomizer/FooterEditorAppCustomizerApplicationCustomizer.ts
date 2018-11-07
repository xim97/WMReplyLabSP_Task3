import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import * as strings from 'FooterEditorAppCustomizerApplicationCustomizerStrings';
import { IFooterProps } from './components/IFooterProps';
import Footer from "./components/Footer";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IGroup } from "./components/IGroupProps";
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
//import pnp from "sp-pnp-js";
export interface IFooterEditorAppCustomizerApplicationCustomizerProperties {
  testMessage: string;
}
import {
  sp,
  ClientSideWebpart,
  ClientSideWebpartPropertyTypes,
} from "@pnp/sp";

export default class FooterEditorAppCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<IFooterEditorAppCustomizerApplicationCustomizerProperties> {
  private bottomPlaceholder: PlaceholderContent | undefined;
  private data: Array<IGroup> = [];
  @override
  public onInit(): Promise<void> {
    let data: Array<any> = [
      {
        title: "gr1",
        properties: ["title", "url"],
        links: [
          { title: "3", url: "3.com" },
          { title: "2", url: "2.com" },
          { title: "1", url: "1.com" }]
      },
      {
        title: "gr2",
        properties: ["hoverText", "url"],
        links: [
          { hoverText: "2", url: "2.com" },
          { hoverText: "1", url: "1.com" }
        ]
      }
    ];
    this.data = data;
    this.context.placeholderProvider.changedEvent.add(this, this.renderFooter);     

    this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/GetClientSideWebParts`,
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON: any) => {          
          let webpart: any = responseJSON.value.filter(item => item.Id === "{9738428e-ead4-42f8-a420-f7d2467761a8}".toUpperCase())[0];
          const part = ClientSideWebpart.fromComponentDef(webpart);
          console.log(part.getProperties());        
        });
      });   
    return Promise.resolve();
  }

  private renderFooter(): void {

    if (!this.bottomPlaceholder) {
      this.bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this.onDispose }
      );

      if (!this.bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }

      if (this.properties) {
        if (this.bottomPlaceholder.domElement) {
          const footer: React.ReactElement<IFooterProps> = React.createElement(
            Footer,
            {
              data: this.data
            }
          );
          ReactDOM.render(footer, this.bottomPlaceholder.domElement);
        }
      }
    }
  }
}
