import * as React from 'react';
import styles from './FooterStyles.module.scss';
import { IFooterProps } from './IFooterProps';
import Group from "./Group";
import * as strings from 'FooterEditorAppCustomizerApplicationCustomizerStrings';

export default class Footer extends React.Component<IFooterProps, {}> {
    public render(): React.ReactElement<IFooterProps> {
        return (
            <div className={styles.footerStyles}>
                <div className={styles.container}>
                    <ul className={styles.row}>
                        {
                            this.props.data !== undefined && this.props.data.length > 0 ? 
                            this.props.data.map(group => {
                                return (
                                    <li>
                                        <Group group={group} />
                                    </li>
                                );
                            }) :
                            <li>{strings.NothingToShow}</li>
                        }
                    </ul>
                </div>
            </div>
        );
    }
}