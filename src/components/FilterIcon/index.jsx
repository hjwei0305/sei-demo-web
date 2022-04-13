import React from 'react';
import { Space, ExtIcon } from 'suid';
import cls from 'classnames';

import styles from './index.less';

const FilterIcon = props => {
  const { showClear, onClear } = props;

  return (
    <Space
      className={cls({
        [styles['filter-icon']]: true,
        [styles.filter]: showClear,
      })}
    >
      <span>
        <ExtIcon type="filter" style={{ fontSize: 16 }} />
        <span>过滤</span>
      </span>
      {showClear ? (
        <ExtIcon
          type="close"
          className="btn-clear"
          antd
          onClick={e => onClear && onClear(e)}
          tooltip={{ title: '清除过滤条件', placement: 'bottomRight' }}
          style={{ fontSize: 14 }}
        />
      ) : null}
    </Space>
  );
};

export default FilterIcon;
