import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Layout, message, Tabs } from 'antd';
import { ListLoader, Attachment, Money, ScrollBar } from 'suid';
import { get, isEmpty } from 'lodash';
import Banner from './Banner';
import Head from './Head';
import styles from './index.less';
import { constants } from '@/utils';

const { SERVER_PATH } = constants;

const { Content } = Layout;
const { TabPane } = Tabs;

@connect(({ flowForm, loading }) => ({ flowForm, loading }))
class Apply extends Component {
  static headRef;

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'attachment',
    };
  }

  componentDidMount() {
    if (this.props.onApplyRef) {
      this.props.onApplyRef(this);
    }
    this.getRequestData();
  }

  getRequestData = () => {
    const { id, dispatch, action } = this.props;
    if (id) {
      dispatch({
        type: 'flowForm/getDetail',
        payload: {
          id,
          action,
        },
      });
    }
  };

  handlerHeadRef = ref => {
    this.requestHeadRef = ref;
  };

  defaultCallBack = res => {
    if (!res.success) {
      message.warning(res.message);
    }
  };

  handlerFlowStartComlete = res => {
    if (res.success) {
      const { onClose } = this.props;
      if (onClose) {
        onClose(true);
      }
    }
  };

  approveSaveOrder = flowCallBack => {
    this.save(flowCallBack);
  };

  save = (flowCallBack = this.defaultCallBack) => {
    const { flowForm, dispatch } = this.props;
    const { isValid, data } = this.requestHeadRef.getHeaderData();
    if (isValid) {
      const docIdList = [];
      if (this.attachmentRef) {
        const status = this.attachmentRef.getAttachmentStatus();
        const { fileList, ready } = status;
        if (!ready) {
          flowCallBack({
            success: false,
            message: '附件正在上传中，请等待上传完成后操作，否则会导致附件丢失',
          });
          return;
        }
        if (fileList && fileList.length > 0) {
          fileList.forEach(item => {
            if (item.id && !docIdList.includes(item.id)) {
              docIdList.push(item.id);
            }
          });
        }
      }
      Object.assign(data, { attachmentIdList: docIdList });
      dispatch({
        type: 'flowForm/save',
        payload: {
          ...data,
        },
      }).then(res => flowCallBack(res));
    } else {
      flowCallBack({
        success: false,
        message: '数据校验未通过，请检查数据',
      });
    }
  };


  handlerTabChange = activeKey => {
    this.setState({ activeKey });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowForm/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };




  render() {
    const { loading, flowForm, onClose } = this.props;
    const {
      editData,
      currentViewType,
      flowFormItem,
      action,
    } = flowForm;
    const { activeKey } = this.state;
    const { wbsNo } = editData || {};

    const bannerProps = {
      editData,
      action,
      currentViewType,
      extAction: {
        action,
        onClose,
        editData,
        beforeStartFlow: () =>
          new Promise(resolve => {
            this.approveSaveOrder(res => resolve(res));
          }),
        onFlowStartComlete: this.handlerFlowStartComlete,
        onSave: this.save,
        loading:
          loading.effects['flowForm/save'],
      },
    };
    const readOnly = action !== 'add' && action !== 'edit' && action !== 'approveEdit';

    const editCodeFlag = action === 'approveEditCode'

    const requestHeadProps = {
      editCodeFlag,
      readOnly,
      currentViewType,
      onHeadRef: this.handlerHeadRef,
      editData,
    };

    const attachmentProps = {
      serviceHost: `${SERVER_PATH}/edm-service`,
      multiple: true,
      customBatchDownloadFileName: true,
      onAttachmentRef: ref => (this.attachmentRef = ref),
      allowUpload: !readOnly || action === 'finalEdit',
      allowDelete: !readOnly,
      entityId: get(editData, 'id'),
    };


    const orderLoading = loading.effects['flowForm/getDetail'];

    return (
      <>
        <ScrollBar className="wapper" ref={ref => (this.scrollBarRef = ref)}>
          <Layout className={cls(styles['order-box'], 'flow-order-box')}>
            <Content className="order-content-box">
              {orderLoading ? (
                <ListLoader />
              ) : (
                <>
                  <Banner {...bannerProps} />
                  <Head {...requestHeadProps} />
                  <Tabs
                    activeKey={activeKey}
                    onChange={this.handlerTabChange}
                    className={cls(styles['item-box'])}
                  >
                    <TabPane tab="附件" key="attachment" forceRender>
                      <Attachment {...attachmentProps} />
                    </TabPane>
                  </Tabs>
                </>
              )}
            </Content>
          </Layout>
        </ScrollBar>
      </>
    );
  }
}

export default Apply;
