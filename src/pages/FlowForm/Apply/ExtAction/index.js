import React, { Fragment, PureComponent } from 'react';
import { Button, Icon, Popconfirm } from 'antd';
import { get } from 'lodash';
import { WorkFlow } from 'suid';

const { StartFlow } = WorkFlow;

const tip = (topic, description) => {
  return (
    <Fragment>
      <div style={{ color: 'rgba(0,0,0,0.85)' }}>{topic}</div>
      <div>{description}</div>
    </Fragment>
  );
};

class ExtAction extends PureComponent {
  renderExtActions = () => {
    const {
      action,
      loading = false,
      onSave,
      editData,
      onClose,
      beforeStartFlow,
      onFlowStartComlete,
    } = this.props;
    const businessKey = get(editData, 'id', null);
    const startFlowProps = {
      businessKey,
      businessModelCode: 'com.rcsit.prc.entity.BudgetApply',
      beforeStart: beforeStartFlow,
      startComplete: onFlowStartComlete,
      needStartConfirm: true,
    };
    const exitOrder = () => {
      if (onClose) {
        onClose(true);
      }
    };
    switch (action) {
      case 'add':
        return (
          <Fragment>
            <StartFlow {...startFlowProps}>
              {sLoading => (
                <Button disabled={loading || sLoading} loading={loading || sLoading}>
                  提交审批
                </Button>
              )}
            </StartFlow>
            <Popconfirm
              icon={<Icon type="question-circle-o" />}
              placement="left"
              trigger="click"
              title={tip('确定要退出创建吗？', '未保存的数据将会丢失!')}
              onConfirm={exitOrder}
            >
              <Button onClose={onClose}>{businessKey ? '退出编辑' : '退出创建'}</Button>
            </Popconfirm>
            <Button
              type="primary"
              loading={loading}
              onClick={e => {
                e.stopPropagation();
                onSave();
              }}
            >
              保存
            </Button>
          </Fragment>
        );
      case 'edit':
        return (
          <Fragment>
            <StartFlow {...startFlowProps}>
              {sLoading => (
                <Button disabled={loading || sLoading} loading={loading || sLoading}>
                  提交审批
                </Button>
              )}
            </StartFlow>
            <Popconfirm
              icon={<Icon type="question-circle-o" />}
              placement="left"
              trigger="click"
              title={tip('确定要退出编辑吗？', '未保存的数据将会丢失!')}
              onConfirm={exitOrder}
            >
              <Button disabled={loading}>退出编辑</Button>
            </Popconfirm>
            <Button
              type="primary"
              loading={loading}
              onClick={e => {
                e.stopPropagation();
                onSave();
              }}
            >
              保存
            </Button>
          </Fragment>
        );
      case 'approvalMoney':
        return null;
      default:
        return (
          <Fragment>
            <Button onClick={exitOrder}>退出查看</Button>
          </Fragment>
        );
    }
  };

  render() {
    return <Fragment>{this.renderExtActions()}</Fragment>;
  }
}

export default ExtAction;
