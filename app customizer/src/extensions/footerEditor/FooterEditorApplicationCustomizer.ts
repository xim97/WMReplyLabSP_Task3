import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { IGroup } from "./components/interfaces/IGroupProps";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as strings from 'FooterEditorApplicationCustomizerStrings';
import styles from './components/FooterStyles.module.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IFooterProps } from './components/interfaces/IFooterProps';
import Footer from "./components/Footer";

export interface IFooterEditorApplicationCustomizerProperties {}

export default class FooterEditorApplicationCustomizer
  extends BaseApplicationCustomizer<IFooterEditorApplicationCustomizerProperties> {
  private bottomPlaceholder: PlaceholderContent | undefined;
  private data: Array<Array<IGroup>> = [];
  @override
  public onInit(): Promise<void> {

    this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/sitepages/home.aspx/_api/web/GetClientSideWebParts`,
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON: any) => {
          let content: any = JSON.parse(responseJSON.page.Content.CanvasContent1);
          let webparts: Array<any> = content.filter(item => item.webPartId === "9738428e-ead4-42f8-a420-f7d2467761a8");
          webparts.forEach((webpart: any) => {
            this.data.push(webpart.webPartData.properties.groups);
          });          
          this.context.placeholderProvider.changedEvent.add(this, this.renderFooter);
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
        if (this.bottomPlaceholder.domElement && document.getElementsByClassName(styles.footerStyles).length === 0) {
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
