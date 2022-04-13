import React from 'react';
import { Tag, Badge } from 'antd';
import { constants } from '@/utils';

const { TRACK_VIEW_STATUS } = constants;

const RequestViewState = ({ enumName }) => {
  const status = 'INIT';
  if (status) {
    if (enumName === 'INIT') {
      return (
        <Tag color={status.color}>
          <>
            <Badge status="processing" />
            初始化
          </>
        </Tag>
      );
    }
    if(enumName === 'INPROCESS'){
      return <Tag color={'yellow'}>{'执行中'}</Tag>;
    }
    return <Tag color={'green'}>{'审批完成'}</Tag>;
  }
  return null;
};

export default RequestViewState;
