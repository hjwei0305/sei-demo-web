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
            {status.title}
          </>
        </Tag>
      );
    }
    return <Tag color={status.color}>{status.title}</Tag>;
  }
  return null;
};

export default RequestViewState;
