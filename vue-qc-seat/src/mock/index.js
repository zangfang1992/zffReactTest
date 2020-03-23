import Mock from 'mockjs'
/**
 * @module callRecord table列表
 * @module loginApi 登录
 * @module callAssitanceApi 通话辅助
 */
import getListApi from './callRecord.js'
import loginApi from './loginApi'
import callAssistanceApi from './callAssistanceApi'

Mock.mock(/assistance\/callRecord\/query/,getListApi);

Mock.mock(/assistance\/login\/getPublicKey/,loginApi.getPublicKey);
Mock.mock(/assistance\/login\/doLogin/,loginApi.doLogin);
Mock.mock(/assistance\/login\/logout/,loginApi.logout);

Mock.mock(/assistance\/scene\/getSceneName/,callAssistanceApi.getSceneName);
Mock.mock(/assistance\/scene\/initialNaturalFlow/,callAssistanceApi.initialNaturalFlow);
Mock.mock(/assistance\/scene\/getGrabInfoBySceneId/,callAssistanceApi.getGrabInfoBySceneId);
