import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { BarCode } from 'suid';
import moment from 'moment';
import styles from './index.less';
import RequestViewState from '../../RequestViewState';
import ExtAction from '../ExtAction';
import { userUtils } from '@/utils';

class Banner extends Component {
  renderStatus = () => {
    const { editData } = this.props;
    if (editData) {
      return <RequestViewState enumName={get(editData, 'flowStatus')} />;
    }
    return null;
  };

  render() {
    const { editData, extAction, action } = this.props;
    const user = userUtils.getCurrentUser();

    return (
      <div className={cls(styles['banner-box'], 'horizontal')}>
        <div className="banner-content row-start horizontal">
          <BarCode
            textAlign="left"
            height={42}
            text={get(editData, 'code') || '-'}
            width={1.1}
            wrapperClassName="bar-code"
          />
          <div className="banner-detail vertical">
            <div className="title">
              预算申请单
              <span className="status">{this.renderStatus()} </span>
            </div>
            <div className="sub-title">
              <span className="title-item">
                <span className="label">制单人</span>
                <span className="creator">{get(editData, 'creatorName', user.userName)}</span>
              </span>
              <span className="title-item">
                <span className="label">制单时间</span>
                <span className="creator-datetime">
                  {get(editData, 'createdDate', moment().format('YYYY-MM-DD'))}
                </span>
              </span>
            </div>
          </div>
        </div>
        {['approve', 'approveEdit', 'approveAddBrmDetail', 'detail'].includes(action) ? null : (
          <div className="banner-action">
            <ExtAction {...extAction} />
          </div>
        )}
      </div>
    );
  }
}

export default Banner;
