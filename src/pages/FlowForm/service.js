/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
*/
import { utils } from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

const { request } = utils;

/** 保存 */
export async function save (data) {
  const url = `${PROJECT_PATH}/flowForm/save`;

  return request.post(url, data);
}

/** 删除 */
export async function del (params) {
  const url = `${PROJECT_PATH}/flowForm/delete/${params.id}`
  return request.delete(url);
}


/** 查询明细 */
export async function  getDetail(params) {
  const url = `${PROJECT_PATH}/flowForm/findOne?id=${params.id}`
  return request.get(url);
}

