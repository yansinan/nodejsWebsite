const util = require('util');
const Transport = require('egg-logger').Transport;

class RemoteErrorTransport extends Transport {
    constructor(options, ctx) {
        super(options);
        this.ctx = ctx; // 得到每次请求的上下文
    }
    // 定义 log 方法，在此方法中把日志上报给远端服务
    log(level, args, meta) {
        let message = super.log(level, args, meta);
        let title=level;
        if (args[0] instanceof Error) {
            const err = args[0];
            // if(msg){
            //     message = msg;//util.format('[-/%s/- %s %s][user-agent:%s]\n',context.ip,context.method,context.href,context["user-agent"]);
            // }
            title = util.format('%s: %s',err.name, err.message);//\n%s\npid: %s\n, err.stack, process.pid
        } else {
            title = util.format(...args);
        }
        let data={
            token : "aghbcg4vyconcpu3gtxxu3bk8jxihz",
            user:"uosp91cqak687d5zvmnj6k99s3vp68",
            message,
            // optional
            title,
            timestamp:Date.now(),
            device:"rubyeye.taihe.com"
        }
        this.options.app.curl('https://api.pushover.net/1/messages.json', {
            data,
            method: 'POST',
            // 是否开启本地 DNS 缓存，默认关闭，开启后有两个特性
            // 1. 所有的 DNS 查询都会默认优先使用缓存的，即使 DNS 查询错误也不影响应用
            // 2. 对同一个域名，在 dnsCacheLookupInterval 的间隔内（默认 10s）只会查询一次
            enableDNSCache: true,
            httpAgent: {
                // 默认开启 http KeepAlive 功能
                keepAlive: false,
            },
            // 自动解析 JSON response
            dataType: 'json',
        }).then(res=>{ //{"status":1,"request":"647d2300-702c-4b38-8b2f-d56326ae460b"}
            console.info("[RemoteErrorTransport]res from pushover:",res.status,res.data);
        }).catch(console.error);
    }
}

module.exports = RemoteErrorTransport;
