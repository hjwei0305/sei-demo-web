import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { findIndex, isEqual, isEmpty } from 'lodash';
import { Dropdown, Menu } from 'antd';
import { utils, ExtIcon } from 'suid';
import styles from './index.less';

const { getUUID } = utils;
const { Item } = Menu;

const allValue = { key: 'ALL', title: '全部' };
const menuHandle = (menusData = [], hasAll = true) => {
  const newList = [];
  menusData.forEach(i => {
    newList.push({
      key: i.code || i.key,
      title: i.name || i.title,
    });
  });
  if (hasAll) newList.unshift(allValue);
  return newList;
};

class BaseView extends PureComponent {
  static propTypes = {
    onAction: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { menusData, propViewType, hasAll = true } = this.props;
    const menuList = menuHandle(menusData, hasAll);
    this.state = {
      menuShow: false,
      menusData: menuList,
      currentViewType: propViewType,
      selectedKey: findIndex(menuList, propViewType),
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const menuList = menuHandle(nextProps.menusData, nextProps.hasAll);
    if (!isEqual(menuList, prevState.menusData) || isEmpty(prevState.currentViewType)) {
      return {
        menusData: menuList,
        currentViewType: nextProps.currentViewType,
        selectedKey: findIndex(menuList, nextProps.currentViewType),
      };
    }
    return prevState;
  }

  componentDidUpdate(preProps) {
    const { propViewType, menusData, hasAll = true } = this.props;
    if (!isEqual(preProps.menusData, menusData)) {
      const menuList = menuHandle(menusData, hasAll);
      this.setState({
        menusData: menuList,
        currentViewType: propViewType,
        selectedKey: findIndex(menuList, propViewType),
      });
    }
  }

  onActionOperation = e => {
    e.domEvent.stopPropagation();
    const { menusData = [] } = this.state;
    const currentViewType = menusData[e.key];
    this.setState({
      selectedKey: e.key,
      menuShow: false,
      currentViewType,
    });
    const { onAction } = this.props;
    if (onAction) {
      onAction(currentViewType);
    }
  };

  getMenu = menus => {
    const { selectedKey } = this.state;
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e)}
        selectedKeys={[`${selectedKey}`]}
      >
        {menus.map((m, index) => {
          return (
            <Item key={index.toString()}>
              {index.toString() === selectedKey.toString() ? (
                <ExtIcon type="check" className="selected" antd />
              ) : null}
              <span className="view-popover-box-trigger">{m.title}</span>
            </Item>
          );
        })}
      </Menu>
    );
  };

  onVisibleChange = v => {
    const { selectedKeys } = this.state;
    this.setState({
      menuShow: v,
      selectedKeys: !v ? '' : selectedKeys,
    });
  };

  render() {
    const { title = '视图' } = this.props;
    const { menusData = [], menuShow, currentViewType = {} } = this.state;
    return (
      <>
        <Dropdown
          trigger={['click']}
          overlay={this.getMenu(menusData)}
          className="action-drop-down"
          placement="bottomLeft"
          visible={menuShow}
          onVisibleChange={this.onVisibleChange}
          overlayStyle={{ maxHeight: '80vh', overflow: menusData.length > 10 ? 'auto' : null }}
        >
          <span className={cls(styles['view-box'])}>
            <span className="view-label">
              <ExtIcon type="eye" antd />
              <em>{title}</em>
            </span>
            <span className="view-content">{currentViewType.title}</span>
            <ExtIcon type="down" antd />
          </span>
        </Dropdown>
      </>
    );
  }
}

export default BaseView;
