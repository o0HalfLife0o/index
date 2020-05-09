// 导航站点设置
var Config = getMStr(function(){
    var sites;
/*
资讯
	IT 资讯, https://go.ming92.cf/ithome/, img/web/ithome.ico
	CNBeta, https://www.cnbeta.com/, img/web/cnBeta.ico
	抽屉新热榜,  https://dig.chouti.com/, img/web/chouti.ico
	澎湃新闻, https://www.thepaper.cn/, img/web/thepaper.ico
	观察者, https://www.guancha.cn/, img/web/guancha.ico
社区
	Firefox吧, https://tieba.baidu.com/f?ie=utf-8&kw=firefox, img/web/tieba.png
	HalfLife吧, https://tieba.baidu.com/f?ie=utf-8&kw=halflife, img/web/tieba.png
	卡饭, https://bbs.kafan.cn/forum-215-1.html, img/web/kafan.ico
	果壳网,   https://www.guokr.com/, img/web/guokr.ico
	知乎网, https://www.zhihu.com/, img/web/zhihu.ico
娱乐
	哔哩哔哩, https://www.bilibili.com/, img/web/bilibili.ico
	看看屋, https://www.kankanwu.com/, img/web/kankanwu.ico
	TV6, https://www.tv6.com/, img/web/tv6.ico
	独播库, https://www.duboku.com/, img/web/duboku.ico
	BL解析, https://vip.bljiex.com/, img/web/bljiex.ico
资源
	腾讯视频, https://v.qq.com/, img/web/qqv.ico
	爱奇艺, https://www.iqiyi.com/, img/web/iqiyi.ico
	芒果TV, https://www.mgtv.com/, img/web/mgtv.ico
	优酷, https://www.youku.com/, img/web/youku.ico
	YouTube, https://www.youtube.com/, img/web/ytb.png
应用
	Dreamcast, http://dreamcast2.ys168.com/, img/web/ys168.png
	ED2000, https://www.ed2000.com/, img/web/ed2000.ico
	谷歌翻译, https://translate.google.cn, img/web/translate.jpg
	百度地图, https://map.baidu.com/, img/web/maps.ico
	百度网盘, https://pan.baidu.com/, img/web/pan.ico
综合
	Google, https://www.google.com/ncr, img/web/google.png
	淘宝, https://www.taobao.com/, img/web/taobao.ico
	京东, https://www.jd.com/, img/web/jd.ico
	网易云音乐, https://music.163.com/, img/web/music.ico
	新浪微博, https://weibo.com/, img/web/weibo.ico
*/
});

// 从函数中获取多行注释的字符串
function getMStr(fn) {
    var fnSource = fn.toString();
    var ret = {};
    fnSource = fnSource.replace(/^[^{]+/, '');
    // console.log(fnSource);
    var matched;
    var reg = /var\s+([$\w]+)[\s\S]*?\/\*([\s\S]+?)\*\//g;
    while (matched = reg.exec(fnSource)) {
        // console.log(matched);
        ret[matched[1]] = matched[2];
    };
    
    return ret;
}
