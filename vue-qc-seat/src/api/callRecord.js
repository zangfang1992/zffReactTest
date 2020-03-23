
import { fetch } from '@/libs/api'
import site from '@@/js/config'

export const getCallRecordList = (params) => fetch(site.base + 'callRecord/query', {
    type: 'get',
    params
});
export const getCallRecordInfo = (params) => fetch(site.base + 'callRecord/getCallRecordInfo', {
    type: 'get',
    params
}); 
// 删除通话记录
export const delCallRecord = (params) => fetch(site.base + 'callRecord/deleteCallRecord', {
    type: 'get',
    params
}); 
export const updateRemark = (params) => fetch(site.base + 'callRecord/updateRemark', {
    type: 'post',
    params
}); 
