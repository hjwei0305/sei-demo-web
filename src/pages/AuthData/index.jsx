import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon, utils } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import styles from './index.less';
import { constants } from '@/utils';

const { authAction } = utils;
const { PROJECT_PATH } = constants;

@withRouter
@connect(({ authData, loading }) => ({ authData, loading }))
class AuthData extends Component {
  state = {
    delId: null,
  };

  reloadData = () => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  };

  handleEvent = (type, row) => {
    const { dispatch } = this.props;

    switch (type) {
      case 'add':
      case 'edit':
        dispatch({
          type: 'authData/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
        break;
      case 'del':
        this.setState(
          {
            delId: row.id,
          },
          () => {
            dispatch({
              type: 'authData/del',
              payload: {
                id: row.id,
              },
            }).then(res => {
              if (res.success) {
                this.setState(
                  {
                    delId: null,
                  },
                  () => this.reloadData(),
                );
              }
            });
          },
        );
        break;
      default:
        break;
    }
  };

  handleSave = data => {
    const { dispatch } = this.props;

    dispatch({
      type: 'authData/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'authData/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authData/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['authData/del'] && delId === row.id) {
      return <ExtIcon className="del-loading" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon className="del" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => (
          <span className={cls('action-box')}>
            <ExtIcon
              key="edit"
              className="edit"
              onClick={() => this.handleEvent('edit', record)}
              type="edit"
              ignore="true"
              tooltip={{ title: '编辑' }}
              antd
            />
            {authAction(<Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗？"
              authCode="PXYS-PXYS-SC"
              onConfirm={() => this.handleEvent('del', record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>)}
          </span>
        ),
      },
      {
        title: '代码',
        dataIndex: 'code',
        width: 120,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.handleEvent('add', null);
            }}
            ignore="true"
          >
            新建
          </Button>
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      // cascadeParams: {
      //   filters: [
      //     {
      //       fieldName: 'corporationCode',
      //       value: '',
      //       operator: 'EQ',
      //       fieldType: 'String',
      //     },
      //     {
      //       fieldName: 'status',
      //       value: 1,
      //       operator: 'EQ',
      //       fieldType: 'java.lang.Integer',
      //     },
      //   ],
      // },
      searchProperties: ['code', 'name'],
      store: {
        type: 'POST',
        url:
          `${PROJECT_PATH}/authdata/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, authData } = this.props;
    const { modalVisible, editData } = authData;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['authData/save'],
    };
  };

  render() {
    const { authData } = this.props;
    const { modalVisible } = authData;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default AuthData;
