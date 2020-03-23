import Mock from "mockjs";
export default {
    //秘钥
    getPublicKey: config=>{
        return {
            data:'a222',   
            msg: "操作成功",
            respTime: "2019-11-14 16:38:31",
            status: 1000
        }
    },
    doLogin: config=>{
        return {
            status:1000,
            data:{
                token: "ed5402ca-cbf7-4d8f-a9c3-d7c5065b29b4",
                userId: 1,
                userName: "admin"
            },
            msg:"操作成功",
            respTime:"2019-11-08 11:46:00"
        }   
    },
    logout: config=>{
        return {
            data:'',   
            msg: "操作成功",
            respTime: "2019-11-14 16:38:31",
            status: 1000
        }
    }
}

// export default {

//     "status":1000,
//     "data":{
//         "token": "a02a894a-4bd7-4e39-9a59-3ae0952ec84b",
//         "userName": "ljtest009@ynt.ai"
//     },
//     "msg":"操作成功",
//     "respTime":"2019-11-08 11:46:00"
//   }