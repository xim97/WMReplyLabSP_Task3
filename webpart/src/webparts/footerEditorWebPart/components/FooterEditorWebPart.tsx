import * as React from 'react';
import styles from './FooterEditorWebPart.module.scss';
import { IFooterEditorWebPartProps } from './IFooterEditorWebPartProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class FooterEditorWebPart extends React.Component<IFooterEditorWebPartProps, {}> {
  public render(): React.ReactElement<IFooterEditorWebPartProps> {
    return (
      <div className={ styles.footerEditorWebPart }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>             
            </div>
          </div>
        </div>
      </div>
    );
  }
}
