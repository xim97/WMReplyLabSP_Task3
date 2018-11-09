import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import * as strings from 'FooterEditorApplicationCustomizerStrings';
import { IFooterProps } from './components/IFooterProps';
import Footer from "./components/Footer";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IGroup } from "./components/IGroupProps";
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
export interface IFooterEditorAppCustomizerApplicationCustomizerProperties { }
import {
  sp,
  ClientSideWebpart,
  ClientSideWebpartPropertyTypes,
} from "@pnp/sp";
import styles from './components/FooterStyles.module.scss';

require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

export default class FooterEditorAppCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<IFooterEditorAppCustomizerApplicationCustomizerProperties> {
  private bottomPlaceholder: PlaceholderContent | undefined;
  private data: Array<IGroup> = [];
  @override
  public onInit(): Promise<void> {
    this.data = [
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
    this.context.placeholderProvider.changedEvent.add(this, this.renderFooter);
    
    this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/GetClientSideWebParts`,
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON: any) => {debugger;
          //let webpart: any = responseJSON.value.filter(item => item.Id === "E7F4BC18-CD8B-4563-BFFF-F8E8A775AF95".toLowerCase())[0];
          let webpart: any = responseJSON.value.filter(item => item.Name === "FooterEditorWebPart")[0];
          const part = ClientSideWebpart.fromComponentDef(webpart);
          console.log(part.getProperties());
        });
      });
    /*var currentCtx = SP.ClientContext.get_current();        
    var pageFile = currentCtx.get_web().getFileByServerRelativeUrl(this.context.pageContext.site.serverRequestPath);
    var webPartManager = pageFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
    var webPartDefs = webPartManager.get_webParts();
    currentCtx.load(webPartDefs, 'Include(WebPart.Properties)');
    currentCtx.executeQueryAsync(
    function () {
        if (webPartDefs.get_count()) {
            for (var i = 0; i < webPartDefs.get_count() ; i++) {
                var webPartDef = webPartDefs.getItemAtIndex(i);
                var webPart = webPartDef.get_webPart();
                var properties = webPart.get_properties();
    
                console.log(JSON.stringify(properties.get_fieldValues())); //print all properties
            }
        }
        else {
            console.log("No web parts found.");
        }
    },
    function (sender, args) {
        console.log(args.get_message());
    });*/    
    /*var ctx = SP.ClientContext.get_current();
    var pageFile = ctx.get_web().getFileByServerRelativeUrl(this.context.pageContext.web.serverRelativeUrl);
    var webPartManager = pageFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
    var webPartDef = webPartManager.get_webParts().getById("9738428e-ead4-42f8-a420-f7d2467761a8");
    var webPart = webPartDef.get_webPart();
    ctx.load(webPart, 'Properties');
    ctx.executeQueryAsync(
      function () {
        var properties = webPart.get_properties();
        console.log(properties.get_fieldValues()['Title']);
      },
      function (sender, args) {
        console.log(args.get_message());
      });*/
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