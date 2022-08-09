import React from 'react';
import { Tag, Badge } from 'antd';
import { constants } from '@/utils';

const RequestViewState = ({ enumName }) => {
  const status = 'INIT';
  if (status) {
    if (enumName === 'INPROCESS') {
      return <Tag color={'yellow'}>{'执行中'}</Tag>;
    } else if (enumName === 'COMPLETED') {
      return <Tag color={'green'}>{'审批完成'}</Tag>;
    } else {
      return (
        <Tag color={status.color}>
          <>
            <Badge status="processing" />
            初始化
          </>
        </Tag>
      );
    }
  }
  return null;
};

export default RequestViewState;
