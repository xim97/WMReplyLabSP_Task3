import * as React from 'react';
import styles from './FooterStyles.module.scss';
import { IFooterProps } from './interfaces/IFooterProps';
import { IFooterState } from './interfaces/IFooterState';
import Group from "./Group";
import * as strings from 'FooterEditorApplicationCustomizerStrings';
import * as Msal from "msal";

export default class Footer extends React.Component<IFooterProps, IFooterState> {
    constructor(props) {
        super(props);

        this.state = {
            pageNumber: 0,
            name: "name",
            email: "email",
            numberOfUnreadMessages: 0
        };

        this.handleClickPrevButton = this.handleClickPrevButton.bind(this);
        this.handleClickNextButton = this.handleClickNextButton.bind(this);

        this.setData = this.setData.bind(this);
    }

    private handleClickPrevButton(): void {
        if (this.state.pageNumber > 0) {
            this.setState({ pageNumber: this.state.pageNumber - 1 });
        }
    }

    private handleClickNextButton(): void {
        if (this.state.pageNumber < this.props.data.length - 1) {
            this.setState({ pageNumber: this.state.pageNumber + 1 });
        }
    }

    public componentDidMount(): void {
        let applicationConfig = this.props.applicationConfig;
        let myMSALObj = new Msal.UserAgentApplication(applicationConfig.clientID,
            null,
            acquireTokenRedirectCallBack,
            { storeAuthStateInCookie: true, cacheLocation: "localStorage" });
        signIn(this);
        function signIn(context: any) {
            myMSALObj.loginPopup(applicationConfig.graphScopes).
                then(
                    idToken => acquireTokenPopupAndCallMSGraph(context),
                    error => console.log(error)
                );
        }

        function acquireTokenPopupAndCallMSGraph(context: any) {
            myMSALObj.acquireTokenSilent(applicationConfig.graphScopes).
                then(
                    accessToken => callMSGraph(context, accessToken),
                    error => {
                        myMSALObj.acquireTokenPopup(applicationConfig.graphScopes).
                            then(
                                accessToken => callMSGraph(context, accessToken),
                                anotherError => console.log(anotherError)
                            );
                    }
                );
        }

        function createRequestOptions(accessToken: any): RequestInit {
            let headers: Headers = new Headers();
            let bearer: string = "Bearer " + accessToken;
            headers.append("Authorization", bearer);
            let options: RequestInit = {
                method: "GET",
                headers: headers
            };
            return options;
        }

        function callMSGraph(context: any, accessToken: any) {
            const options = createRequestOptions(accessToken);
            let name: string;
            let email: string;
            let numberOfUnreadMessages: number;
            fetch(applicationConfig.graphEndpoints[0], options)
                .then(response => response.json())
                .then(data => {
                    name = data.displayName;
                    email = data.userPrincipalName;
                });
            fetch(applicationConfig.graphEndpoints[1], options)
                .then(response => response.json())
                .then(data => {
                    numberOfUnreadMessages = data.value.length;                    
                    context.setData(name, email, numberOfUnreadMessages);
                });
        }

        function acquireTokenRedirectCallBack(errorDesc, token, error, tokenType) {
            console.log("acquireTokenRedirectCallBack");
            if (tokenType === "access_token") {
                callMSGraph(null, "qgwAB2:(;ebujRKVVI1591(");
            } else {
                console.log("token type is:" + tokenType);
            }
        }
    }

    private setData(name: string, email: string, numberOfUnreadMessages: number): void {
        this.setState({
            name: name,
            email: email,
            numberOfUnreadMessages: numberOfUnreadMessages
        });
    }

    public render(): React.ReactElement<IFooterProps> {
        return (
            <div className={styles.footerStyles}>
                <div className={styles.container}>
                    <ul className={styles.rowSpaceAround}>
                        {
                            this.props.data[this.state.pageNumber] !== undefined && this.props.data[this.state.pageNumber].length > 0 ?
                                this.props.data[this.state.pageNumber].map(group => {
                                    if (group.links.length !== 0) {
                                        return (
                                            <li>
                                                <Group group={group} />
                                            </li>
                                        );
                                    }

                                }) :
                                <li>{strings.NothingToShow}</li>
                        }
                        <li>
                            <p>
                                {this.state.name}({this.state.email}) has {this.state.numberOfUnreadMessages} unread messages
                            </p>
                        </li>
                    </ul>
                    {
                        this.props.data[this.state.pageNumber] !== undefined && this.props.data.length > 1 &&
                        <div className={styles.rowCenter}>
                            <button
                                onClick={this.handleClickPrevButton}
                            >
                                Previous page
                            </button>
                            <h2>{this.state.pageNumber}</h2>
                            <button
                                onClick={this.handleClickNextButton}
                            >
                                Next page
                            </button>
                        </div>
                    }

                </div>
            </div>
        );
    }
}