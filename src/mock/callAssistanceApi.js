export default {
    getSceneName: config=>{
        return {
            status: 1000,
            data: [
                {
                    id: "1",
                    sceneName: "一汽客户信息核实-1",
                },{
                    id: "2",
                    sceneName: "一汽客户信息核实-2",
                },{
                    id: "3",
                    sceneName: "一汽客户信息核实-3",
                }
            ]
        }
    },
    initialNaturalFlow: config=>{
        return {
            status: 1000,
            data: [
                {
                    id: 820,
                    name: "A",
                    orderBy: 1,
                    status: 2,
                    createTime: "2019-11-12 21:01:56",
                    updateTime: null,
                    content: "您好，请问您是##姓氏####性别##吗？"
                },
                {
                    id: 821,
                    name: "B",
                    orderBy: 2,
                    status: 3,
                    createTime: "2019-11-12 21:01:56",
                    updateTime: null,
                    content: "请问一下您购买的奔腾汽车型号是##型号##吗？"
                },
                {
                    id: 821,
                    name: "D",
                    orderBy: 2,
                    status: 1,
                    createTime: "2019-11-12 21:01:56",
                    updateTime: null,
                    content: "请问一下您购买的奔腾汽车型号是##型号##吗？"
                },
                {
                    id: 822,
                    name: "结束语4",
                    orderBy: 2,
                    status: 0,
                    createTime: "2019-11-12 21:01:56",
                    updateTime: null,
                    content: "非常感谢您的配合！在车辆使用过程中，如需帮助，请拨打我们的24小时客服电话，400-888-8080，感谢您的接听，再见！"
                }
            ],
            msg: "操作成功",
            respTime: "2019-11-15 17:40:42"
        }
    },
    getGrabInfoBySceneId:config=>{
        return {
            status: 1000,
            data:[
            ]
        }
    }
}