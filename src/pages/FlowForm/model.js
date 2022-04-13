/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, getDetail } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'flowForm',

  state: {
    showFilter: false,
    filterData: {},
    editData: null,
    modalVisible: false,
    viewTypeData: [{ key: 'ALL', title: '全部' }, { key: 'INIT', title: '初始化' }, { key: 'INPROCESS', title: '执行中' }, { key: 'COMPLETED', title: '已完成' }],
    currentViewType: { key: 'ALL', title: '全部' },
    action: null,
  },
  effects: {
    *save({ payload }, { call }) {
      const result = yield call(save, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *del({ payload }, { call }) {
      const result = yield call(del, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },

    *getDetail({ payload }, { call, put }) {
      const result = yield call(getDetail, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            editData: result.data,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
  },
});
