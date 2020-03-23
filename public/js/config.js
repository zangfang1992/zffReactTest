const hostname = location.hostname.split('.')[0]

//内部测试的环境
const audioPathUrlArray = ['10', '127', 'localhost']

const host = audioPathUrlArray.includes(hostname) ? '/api/' : '/assistance/'

const audioPathUrl =audioPathUrlArray.includes(hostname) ?'http://192.168.88.71/':'https://file.ynt.ai/'//通话记录的音频

const siteConfig = {
	base: host,
	audioPathUrl
}

export default siteConfig