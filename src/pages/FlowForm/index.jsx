import React, { Component, Fragment, Suspense } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button } from 'antd';
import { ExtTable, PageLoader } from 'suid';
import { get } from 'lodash';
import PageWrapper from '@/components/PageWrapper';
import BaseView from '@/components/BaseView';
import ExtAction from '@/components/ExtAction';
import FilterIcon from '@/components/FilterIcon';
import DetailWrapper from '@/components/DetailWrapper';
import RequestViewState from './RequestViewState';
import Apply from './Apply';
import FilterView from './FilterView';
import styles from './index.less';
import { constants } from '@/utils';

const { PROJECT_PATH, SERVER_PATH } = constants;

@withRouter
@connect(({ flowForm, loading }) => ({ flowForm, loading }))
class FlowForm extends Component {
  state = {
    delId: null,
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleEvent = type => {
    const { dispatch } = this.props;
    switch (type) {
      case 'add':
        dispatch({
          type: 'flowForm/updateState',
          payload: {
            modalVisible: true,
            action: 'add',
          },
        });
        break;
      default:
        break;
    }
  };

  handleClose = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowForm/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
    if (flag) {
      this.reloadData();
    }
  };

  handlerAction = (key, recordItem) => {
    const { dispatch } = this.props;

    switch (key) {
      case 'edit':
        dispatch({
          type: 'flowForm/getDetail',
          payload: {
            id: recordItem.id,
            action: 'edit',
          },
        });
        break;
      case 'view':
        dispatch({
          type: 'flowForm/getDetail',
          payload: {
            id: recordItem.id,
            action: 'view',
          },
        });
        break;
      case 'del':
        this.setState(
          {
            delId: recordItem.id,
          },
          () => {
            dispatch({
              type: 'flowForm/del',
              payload: {
                id: recordItem.id,
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

  getFilters = () => {
    const { flowForm } = this.props;
    const { filterData, currentViewType } = flowForm;
    const filters = { filter: [], hasFilter: false };
    const opration = {
      projectName: 'LK',
      wbsNo: 'LK',
    };
    if (currentViewType.key !== 'ALL') {
      filters.filter.push({ fieldName: 'flowStatus', value: currentViewType.key, operator: 'EQ' });
    }
    Object.keys(filterData || {}).forEach(key => {
      const value = get(filterData, key, null);
      if (value) {
        filters.hasFilter = true;
        filters.filter.push({
          fieldName: key,
          value,
          operator: get(opration, key, 'EQ'),
          fieldType: 'string',
        });
      }
    });

    return filters;
  };

  handlerViewTypeChange = a => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowForm/updateState',
      payload: {
        currentViewType: a,
      },
    });
    this.reloadData();
  };

  filterMenusData = item => {
    const useThis = this;
    const menusData = [
      {
        title: '修改',
        key: 'edit',
        canClick: item.flowStatus === 'INIT',
      },
      {
        title: '删除',
        key: 'del',
        canClick: item.flowStatus === 'INIT',
      },
      {
        title: '查看',
        key: 'view',
        icon: 'file-search',
        canClick: true,
      },
      {
        title: '审核历史',
        key: 'flowHistory',
        canClick: item.flowStatus !== 'INIT',
        props: {
          businessId: item.id,
          store: {
            baseUrl: SERVER_PATH,
          },
        },
      },
      {
        title: '提交审批',
        key: 'flow',
        canClick: item.flowStatus === 'INIT',
        props: {
          businessKey: item.id,
          startComplete: () => useThis.reloadData(),
          businessModelCode: 'com.changhong.sei.demo.entity.FlowForm',
          store: {
            baseUrl: SERVER_PATH,
          },
        },
      },
    ];
    return menusData.filter(a => a.canClick);
  };

  getExtableProps = () => {
    const { flowForm } = this.props;
    const { currentViewType, viewTypeData } = flowForm;
    const filters = this.getFilters();
    const columns = [
      {
        key: 'operation',
        width: 80,
        align: 'center',
        dataIndex: 'id',
        title: '操作',
        className: 'action',
        fixed: 'left',
        required: true,
        render: (id, record) => (
          <span className={cls('action-box')}>
            <ExtAction
              key={id}
              onAction={this.handlerAction}
              menusData={this.filterMenusData(record)}
              recordItem={record}
            />
          </span>
        ),
      },
      {
        title: '申请单号',
        dataIndex: 'code',
        width: 180,
        required: true,
        render: t => t || '-',
      },
      {
        title: '流程状态',
        dataIndex: 'flowStatus',
        width: 100,
        render: t => {
          return <RequestViewState enumName={t} />;
        },
      },
      {
        title: '名称',
        dataIndex: 'projectName',
        width: 180,
        required: true,
        render: t => t || '-',
      },
      {
        title: '短名称',
        dataIndex: 'shortName',
        width: 220,
        required: true,
      },
      {
        title: '申请部门',
        dataIndex: 'organizationName',
        width: 320,
      },
      {
        title: '申请人',
        dataIndex: 'creatorName',
        width: 120,
      },
      {
        title: '申请时间',
        dataIndex: 'createdDate',
        width: 120,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <BaseView
            title="流程状态"
            currentViewType={currentViewType}
            menusData={viewTypeData}
            onAction={this.handlerViewTypeChange}
            hasAll={false}
          />
          <Button
            key="addNonAssets"
            type="primary"
            onClick={() => {
              this.handleEvent('add', null);
            }}
            ignore="true"
          >
            新建申请
          </Button>
          <Button onClick={this.reloadData}>刷新</Button>
          <Button onClick={this.reloadData}>导出</Button>
          <Button onClick={this.reloadData}>导入</Button>
        </Fragment>
      ),
      right: (
        <Fragment>
          <BaseView
            title="流程状态"
            currentViewType={currentViewType}
            menusData={viewTypeData}
            onAction={this.handlerViewTypeChange}
            hasAll={false}
          />
          <Button
            key="addNonAssets"
            type="primary"
            onClick={() => {
              this.handleEvent('add', null);
            }}
            ignore="true"
          >
            新建申请
          </Button>
        </Fragment>
      ),
      extra: (
        <>
          <span
            className={cls('filter-btn', 'icon-btn-item', { 'has-filter': filters.hasFilter })}
            onClick={this.handlerShowFilter}
          >
            <FilterIcon onClear={e => this.clearFilter(e)} showClear={filters.hasFilter} />
          </span>
        </>
      ),
    };
    return {
      columns,
      lineNumber: false,
      searchProperties: ['code', 'projectName'],
      searchPlaceHolder: 'code、项目名称',
      refreshButton: 'empty',
      toolBar: toolBarProps,
      remotePaging: true,
      cascadeParams: {
        filters: filters.filter,
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/flowForm/findByPage`,
      },
      sort: {
        field: {
          createdDate: 'desc',
          flowStatus: null,
          wbsNo: null,
        },
      },
    };
  };

  getProjectProps = () => {
    const { loading, flowForm } = this.props;
    const { editData, currentViewType } = flowForm;
    return {
      onClose: this.handleClose,
      editData,
      currentViewType,
      saving: loading.effects['flowForm/save'],
    };
  };

  /** 过滤 */
  handlerFilterSubmit = filterData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowForm/updateState',
      payload: {
        showFilter: false,
        filterData,
      },
    });
  };

  handlerCloseFilter = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowForm/updateState',
      payload: {
        showFilter: false,
      },
    });
  };

  handlerShowFilter = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowForm/updateState',
      payload: {
        showFilter: true,
      },
    });
  };

  clearFilter = e => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'flowForm/updateState',
      payload: {
        filterData: {},
      },
    });
  };

  render() {
    const { flowForm } = this.props;
    const { modalVisible, showFilter, filterData, currentViewType } = flowForm;

    const filterViewProps = {
      showFilter,
      filterData,
      currentViewType,
      onFilterSubmit: this.handlerFilterSubmit,
      onCloseFilter: this.handlerCloseFilter,
    };

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        <FilterView {...filterViewProps} />
        {modalVisible ? (
          <Suspense fallback={<PageLoader />}>
            <DetailWrapper visible={modalVisible}>
              <Apply title="申请信息" action="add" {...this.getProjectProps()} />
            </DetailWrapper>
          </Suspense>
        ) : null}
      </PageWrapper>
    );
  }
}

export default FlowForm;
