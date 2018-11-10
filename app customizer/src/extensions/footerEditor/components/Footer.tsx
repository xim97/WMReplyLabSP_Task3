import * as React from 'react';
import styles from './FooterStyles.module.scss';
import { IFooterProps } from './IFooterProps';
import { IFooterState } from './IFooterState';
import Group from "./Group";
import * as strings from 'FooterEditorApplicationCustomizerStrings';

export default class Footer extends React.Component<IFooterProps, IFooterState> {
    constructor(props) {
        super(props);

        this.state = {
            pageNumber: 0
        };

        this.handleClickPrevButton = this.handleClickPrevButton.bind(this);
        this.handleClickNextButton = this.handleClickNextButton.bind(this);
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
                    </ul>
                    {
                        this.props.data[this.state.pageNumber] !== undefined && this.props.data[this.state.pageNumber].length > 0 &&
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