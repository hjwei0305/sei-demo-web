import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { get, isEqual, omit } from 'lodash';
import { Drawer, Form, Button, Input } from 'antd';
import { ScrollBar, ComboList, ComboTree } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { PROJECT_PATH, SERVER_PATH } = constants;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class FilterView extends PureComponent {
  static propTypes = {
    showFilter: PropTypes.bool,
    filterData: PropTypes.object,
    onFilterSubmit: PropTypes.func,
    onCloseFilter: PropTypes.func,
    onResetFilter: PropTypes.func,
  };

  static defaultProps = {
    showFilter: false,
  };

  constructor(props) {
    super(props);
    const { filterData } = props;
    this.state = {
      filterData,
    };
  }

  componentDidUpdate(preProps) {
    const { filterData } = this.props;
    if (!isEqual(preProps.filterData, filterData)) {
      if (Object.keys(filterData).length === 0) {
        this.handlerReset();
      } else {
        this.setState({
          filterData,
        });
      }
    }
  }

  handlerFilter = () => {
    const { filterData } = this.state;
    const { form, onFilterSubmit } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const submitData = omit({ ...filterData, ...formData });
      onFilterSubmit(submitData);
    });
  };

  handlerReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      filterData: {},
    });
  };

  handlerClose = () => {
    const { onCloseFilter } = this.props;
    if (onCloseFilter) {
      onCloseFilter();
    }
  };

  initFieldDecorator = () => {
    const { filterData } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('projectManagerCode', {
      initialValue: get(filterData, 'projectManagerCode', null),
    });
  };

  getFields() {
    const { filterData } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    this.initFieldDecorator();

    const projectManagerComboListProps = {
      placeholder: '选择申请人',
      form,
      allowClear: true,
      name: 'creatorName',
      field: ['employNo'],
      cascadeParams: {
        filters: [
          {
            fieldName: 'consultantType',
            value: 0,
            operator: 'EQ',
            fieldType: 'java.lang.Integer',
          },
        ],
      },
      searchProperties: ['name', 'employNo'],
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/consultant/findByPage`,
      },
      reader: {
        name: 'name',
        description: 'employNo',
        field: ['employNo'],
      },
    };

    const organizationProps = {
      placeholder: '请选择申请部门',
      form,
      name: 'organizationName',
      field: ['organizationName'],
      store: {
        url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
      },
      allowClear: true,
      reader: {
        name: 'name',
        field: ['name'],
      },
    };

    return (
      <>
        <FormItem label="wbs号">
          {getFieldDecorator('wbsNo', {
            initialValue: get(filterData, 'wbsNo'),
          })(<Input maxLength={20} />)}
        </FormItem>
        <FormItem label="项目名称">
          {getFieldDecorator('projectName', {
            initialValue: get(filterData, 'projectName'),
          })(<Input maxLength={20} />)}
        </FormItem>
        <FormItem label="申请人">
          {getFieldDecorator('creatorName', {
            initialValue: get(filterData, 'creatorName'),
          })(<ComboList {...projectManagerComboListProps} />)}
        </FormItem>
        <FormItem label="申请部门">
          {getFieldDecorator('organizationName', {
            initialValue: get(filterData, 'organizationName'),
          })(<ComboTree {...organizationProps} />)}
        </FormItem>
      </>
    );
  }

  render() {
    const { showFilter } = this.props;
    return (
      <Drawer
        width={650}
        getContainer={false}
        placement="right"
        visible={showFilter}
        title={formatMessage({ id: 'global.filter', defaultMessage: '过滤' })}
        className={cls(styles['filter-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <ScrollBar>
          <div className={cls('content')}>
            <Form {...formItemLayout} layout="vertical">
              {this.getFields()}
            </Form>
          </div>
        </ScrollBar>
        <div className="footer">
          <Button onClick={this.handlerReset}>
            <FormattedMessage id="global.reset" defaultMessage="重置" />
          </Button>
          <Button type="primary" onClick={e => this.handlerFilter(e)}>
            <FormattedMessage id="global.ok" defaultMessage="确定" />
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default FilterView;
