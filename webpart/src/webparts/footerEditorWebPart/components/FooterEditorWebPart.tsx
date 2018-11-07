import * as React from 'react';
import styles from './FooterEditorWebPart.module.scss';
import { IFooterEditorWebPartProps } from './IFooterEditorWebPartProps';
import InputData from "./InputData";

export default class FooterEditorWebPart extends React.Component<IFooterEditorWebPartProps, {}> {
  public render(): React.ReactElement<IFooterEditorWebPartProps> {
    return (
      <div>
        {
          this.props.displayMode === 2 ? <div className={styles.footerEditorWebPart}>
            <InputData
              data={this.props.data} 
              groupProperties={this.props.groupProperties}
            />
          </div> : <div className={styles.footerEditorWebPart}></div>
        }
      </div>

    );
  }
}
