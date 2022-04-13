import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { Col, Form, Input, Row, Radio, DatePicker } from 'antd';
import { ComboList, ComboTree } from 'suid';
import moment from 'moment';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH, PROJECT_PATH } = constants;

const FormItem = Form.Item;
const formItemLayout = {
  style: { margin: '0 auto' },
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};

@Form.create()
class Head extends Component {
  constructor(props) {
    super(props);
    this.state = {
      corporationCode: (props.editData || {}).corporationCode,
      brmTypesData: [],
      type: 'PROJECT',
    };
  }

  componentDidMount() {
    const { onHeadRef, showBrmDetail, getBudgetTypes, editData } = this.props;
    if (onHeadRef) {
      onHeadRef(this);
    }
    if (showBrmDetail) {
      getBudgetTypes(editData.corporationBrmId).then(res => {
        if (res.success) {
          this.setState({ brmTypesData: res.data.filter(item => (item.available = true)) });
        }
      });
    }
  }

  getHeaderData = () => {
    const { form, editData } = this.props;
    let isValid = false;
    let data = null;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      isValid = true;
      data = {};
      Object.assign(data, editData || {});
      Object.assign(data, formData);
    });
    return { isValid, data };
  };

  handleTypeChnage = ({ target }) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({
      refId: null,
      projectName: null,
      applyUser: null,
      wbsNo: null,
      organizationId: null,
      organizationCode: null,
      organizationName: null,
    });
    this.setState({ type: target.value });
  };

  handleCorChange = item => {
    const { corporationCode } = this.state;
    if (corporationCode === item.code) {
      return;
    }
    const { form, onChangeCompanyId } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({
      refId: null,
      projectName: null,
      wbsNo: null,
      applyUser: null,
      organizationId: null,
      organizationCode: null,
      organizationName: null,
    });
    if (onChangeCompanyId) {
      onChangeCompanyId(item);
    }
    this.setState({ corporationCode: item.code });
  };

  render() {
    const { form, editData, readOnly, editCodeFlag } = this.props;
    const { getFieldDecorator } = form;

    const { type } = this.state;


    const organizationProps = {
      placeholder: '请选择组织机构',
      form,
      name: 'organizationName',
      field: ['organizationId', 'organizationCode', 'organizationName'],
      store: {
        url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
      },
      allowClear: true,
      reader: {
        name: 'name',
        field: ['id', 'code', 'name'],
      },
    };

    return (
      <div className={cls(styles['head-box'])}>
        <Form {...formItemLayout} layout="horizontal">
          {
            editCodeFlag ? <FormItem label="简称">
              {getFieldDecorator('shortName', {
                initialValue: get(editData, 'shortName'),
              })(<Input disabled={readOnly} />)}
            </FormItem>
              :
              null
          }
          <Row>
            <Col span={8}>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('organizationCode', {
                  initialValue: get(editData, 'organizationCode'),
                })(<Input />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('organizationId', {
                  initialValue: get(editData, 'organizationId'),
                })(<Input />)}
              </FormItem>
              <FormItem label="申请部门">
                {getFieldDecorator('organizationName', {
                  initialValue: get(editData, 'organizationName'),
                })(<ComboTree disabled={readOnly} {...organizationProps} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={6} className="row-item">
            <Col span={8}>
              <FormItem label="项目名称">
                {getFieldDecorator('projectName', {
                  initialValue: get(editData, 'projectName'),
                })(<Input disabled={readOnly} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="简称">
                {getFieldDecorator('shortName', {
                  initialValue: get(editData, 'shortName'),
                })(<Input disabled={readOnly} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Head;
