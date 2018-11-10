import * as React from 'react';
import styles from './FooterStyles.module.scss';
import { IPageProps } from './IPageProps';
import Group from "./Group";

export default class Page extends React.Component<IPageProps, {}> {
    public render(): React.ReactElement<IPageProps> {
        return (
            <div>
                <Group
                    group={this.props.groups[this.props.index]}
                />
                <div className={styles.row}>
                    <input
                        type="button"
                        value="Previous page"
                    />
                    <input
                        type="button"
                        value="Next page"
                    />
                </div>
            </div>
        );
    }
}