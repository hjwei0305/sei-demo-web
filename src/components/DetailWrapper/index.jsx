import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import cls from 'classnames';
import styles from './index.less';

class DetailWrapper extends PureComponent {
  render() {
    const { visible } = this.props;

    const modalProps = {
      mask: false,
      closable: false,
      keyboard: false,
      wrapClassName: styles['request-order-box'],
      visible,
      fullScreen: true,
      footer: null,
      destroyOnClose: true,
    };

    return (
      <Modal {...modalProps}>
        <div className={cls('order-content-wapper')}>
          {React.Children.map(this.props.children, child => {
            return child;
          })}
        </div>
      </Modal>
    );
  }
}

export default DetailWrapper;
