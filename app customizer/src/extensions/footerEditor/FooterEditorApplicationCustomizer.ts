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
import * as Msal from "msal";

export interface IFooterEditorApplicationCustomizerProperties { }
const GTSet: string = "01ea0958-bc19-46c1-815d-35604a7d1e08";
export default class FooterEditorApplicationCustomizer
  extends BaseApplicationCustomizer<IFooterEditorApplicationCustomizerProperties> {
  private bottomPlaceholder: PlaceholderContent | undefined;
  private data: Array<Array<IGroup>> = [];
  private applicationConfig: any = {
    clientID: "cbcd3a24-ecda-4e97-8df6-9debe6a6da69",
    graphScopes: [
      "user.read",
      "mail.read"
    ],
    graphEndpoints: [
      "https://graph.microsoft.com/v1.0/me?$select=displayName,mail",
      "https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=isRead eq false"
    ]
  };
  private headers: Headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });
  private myMSALObj = new Msal.UserAgentApplication(this.applicationConfig.clientID,
    null,
    this.acquireTokenRedirectCallBack,
    { storeAuthStateInCookie: true, cacheLocation: "localStorage" });
  private name: string = "name";
  private email: string = "email";
  private numberOfUnreadMessages: number = 0;

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
            this.signIn(this);
          });
          this.getLinksFromTenant();
        });
      });

    return Promise.resolve();
  }  
  private signIn(context: any) {
    this.myMSALObj.loginPopup(this.applicationConfig.graphScopes).
      then(
        idToken => this.acquireTokenPopupAndCallMSGraph(context),
        error => console.log(error)
      );
  }

  private acquireTokenPopupAndCallMSGraph(context: any) {
    this.myMSALObj.acquireTokenSilent(this.applicationConfig.graphScopes).
      then(
        accessToken => this.callMSGraph(context, accessToken),
        error => {
          this.myMSALObj.acquireTokenPopup(this.applicationConfig.graphScopes).
            then(
              accessToken => this.callMSGraph(context, accessToken),
              anotherError => console.log(anotherError)
            );
        }
      );
  }

  private createRequestOptions(accessToken: any): RequestInit {
    let headers: Headers = new Headers();
    let bearer: string = "Bearer " + accessToken;
    headers.append("Authorization", bearer);
    let options: RequestInit = {
      method: "GET",
      headers: headers
    };
    return options;
  }

  private callMSGraph(context: any, accessToken: any) {
    const options = this.createRequestOptions(accessToken);    
    fetch(context.applicationConfig.graphEndpoints[0], options)
      .then(response => response.json())
      .then(data => {
        context.name = data.displayName;
        context.email = data.mail;
      });
    fetch(context.applicationConfig.graphEndpoints[1], options)
      .then(response => response.json())
      .then(data => {
        context.numberOfUnreadMessages = data.value.length;
        context.context.placeholderProvider.changedEvent.add(context, context.renderFooter);
      });

  }

  private acquireTokenRedirectCallBack(errorDesc, token, error, tokenType) {
    console.log("acquireTokenRedirectCallBack");
    if (tokenType === "access_token") {
      this.callMSGraph(null, "qgwAB2:(;ebujRKVVI1591(");
    } else {
      console.log("token type is:" + tokenType);
    }
  }

  private getLinksFromTenant(): void {
    const headers: Headers = this.headers;

    fetch(`https://myefdomain.sharepoint.com/_api/search/query?querytext='GTSet|%23${GTSet}'&trimduplicates=false&enablefql=false&clienttype='ContentSearchRegular'`, {
      method: 'GET',
      headers
    })
      .then(response => response.json())
      .then(responce => {

        let linksInfo: Array<any> = this.getLinksInfoFromResponse(responce);
        let requestsConfig: Array<any> = this.getRequestsConfig(linksInfo);
        let requests: Array<string> = this.createRequests(requestsConfig);
        this.getRequestsResults(requests).then(data => {
          this.data = this.data.concat([this.createGroupsForFooter(data)]);          
        });
      });
  }

  private createGroupsForFooter(data: Array<any>): Array<IGroup> {
    let groups: Array<any> = [];
    data.forEach(array => {
      array.forEach(item => {
        if (!groups.some(group => group.title === item.TaxCatchAll[0].Term)) {
          groups.push({
            title: item.TaxCatchAll[0].Term,
            properties: ["title", "hoverText", "url"],
            links: [{
              url: item.URL.Url,
              title: item.Title,
              hoverText: item.Description
            }]
          });
        } else {
          let groupIndex: number = -1;
          groups.forEach((group, index) => {
            if (group.title === item.TaxCatchAll[0].Term) {
              groupIndex = index;
            }
          });
          let links: Array<any> = groups[groupIndex].links;
          links.push({
            url: item.URL.Url,
            title: item.Title,
            hoverText: item.Description
          });
        }
      });
    });

    return groups;
  }

  private getRequestsResults(requests: Array<string>): Promise<any> {
    let headers: Headers = this.headers;
    return Promise.all(requests.map(async (request) => {
      const response = await fetch(request, {
        method: 'GET',
        headers
      });
      const responseJson = await response.json();
      if (response.ok) {
        return responseJson.value;
      }
    }
    )
    );

  }

  private createRequests(requestsConfig: Array<any>): Array<string> {
    let requests: Array<string> = [];
    let queryIds: string;
    for (let list in requestsConfig) {
      queryIds = "";
      requestsConfig[list].IDs.forEach(id => {
        if (queryIds === "") {
          queryIds = `(ID eq ${id})`;
        } else {
          queryIds += ` or (ID eq ${id})`;
        }
      });
      requests.push(`${requestsConfig[list].webURL}/_api/Web/lists/getbytitle('${requestsConfig[list].listName}')/items?$select=Title,Description,URL,Group,TaxCatchAll/ID,TaxCatchAll/Term&$expand=TaxCatchAll&$filter=${queryIds}`);
    }
    return requests;
  }

  private getLinksInfoFromResponse(responce: any): Array<any> {
    let linksInfo: Array<any> = [];
    responce.PrimaryQueryResult.RelevantResults.Table.Rows.forEach((link, index) => {
      linksInfo[index] = {};
      link.Cells.forEach(property => {
        switch (property.Key) {
          case 'SPWebUrl':
            linksInfo[index].webURL = property.Value;
            break;
          case 'Path':
            linksInfo[index].listName = property.Value.split('/')[6];
            linksInfo[index].id = property.Value.split('?ID=')[1];
            break;
        }
      });
    });
    return linksInfo;
  }

  private getRequestsConfig(linksInfo: Array<any>): any {
    let requestList = {};
    linksInfo.forEach(link => {
      if (requestList[link.listName] === undefined) {
        requestList[link.listName] = {
          IDs: [link.id],
          webURL: link.webURL,
          listName: link.listName
        };
      } else {
        requestList[link.listName].IDs.push(link.id);
      }
    }
    );
    return requestList;
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
              data: this.data,
              name: this.name,
              email: this.email,
              numberOfUnreadMessages: this.numberOfUnreadMessages
            }
          );
          ReactDOM.render(footer, this.bottomPlaceholder.domElement);
        }
      }
    }
  }
}
