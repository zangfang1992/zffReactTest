import { fetch } from '@/libs/api'
import site from '@@/js/config'

export const getSceneName = (data) => fetch(site.base + 'scene/getSceneName', {
    type: 'post',
    data
});
export const initialNaturalFlow = (data) => fetch(site.base + 'scene/initialNaturalFlow', {
    type: 'post',
    data
});
export const getGrabInfoBySceneId = (data) => fetch(site.base + 'scene/getGrabInfoBySceneId', {
    type: 'post',
    data
});
export const knowledgeSearchInfo = (data) => fetch(site.base + 'core/search/info', {
    type: 'post',
    data
});
export const getSceneUserSelected = (data) => fetch(site.base + 'scene/getSceneUserSelected', {
    type: 'post',
    data
});
export const saveAnalysis = (data) => fetch(site.base + 'scene/saveCustomerAnalysisResult', {
    type: 'post',
    data
});
// 切换场景时，修改用户绑定的场景
export const updateSelectedScene = (data) => fetch(site.base + 'scene/updateSelectedScene', {
    type: 'post',
    data
});

