import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ExtModal, ComboList } from 'suid';
import { constants } from '@/utils';

const { SERVER_PATH } = constants;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };


  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    const corporationComboListProps = {
      placeholder: '选择权限公司',
      form,
      name: 'name',
      field: ['code', 'name'],
      cascadeParams: {
        filters: []
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/corporation/getUserAuthorizedEntities`,
      },
      reader: {
        name: 'name',
        description: 'code',
        field: ['code', 'name'],
      },
      allowClear: true,
    };

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="代码">
            {getFieldDecorator('code', {
              initialValue: editData && editData.code,
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
                {
                  max: 10,
                  message: '代码不能超过5个字符',
                },
              ],
            })(<Input disabled={!!editData} />)}
          </FormItem>
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: editData && editData.name,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<ComboList {...corporationComboListProps} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
