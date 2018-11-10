import * as React from 'react';
import styles from './FooterStyles.module.scss';
import { IGroupProps } from './interfaces/IGroupProps';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class Group extends React.Component<IGroupProps, {}> {
    public render(): React.ReactElement<IGroupProps> {
        return (
            <div className={styles.column}>
                <h5>{this.props.group.title}</h5>
                <ul >
                    {
                        this.props.group.links.map(link => {
                            return (
                                <li>
                                    <a
                                        target={link.newTab ? "_blank" : ""}
                                        title={link.hoverText}
                                        href={"https://" + link.url}
                                    >
                                        {
                                            link.fabricIcon !== undefined && <Icon iconName={link.fabricIcon} />
                                        }
                                        {link.title !== undefined && link.title !== "" ? link.title : link.url}
                                    </a>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}