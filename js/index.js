var isNewTab = 1;  // 0：默认当前标签页打开导航链接或搜索结果  1：强制新标签页打开导航链接或搜索结果

var NewTab = {
	localLinkRegExp: /^[a-z]:\\[^ ]+$/i,  // windows 路径
	init: function() {
		var table = document.getElementById("navtable");
		if (table.children.lenth > 0) {
			return;
		}

		var siteData = this.parseDataText(Config.sites);
		// console.log(siteData);
		var tr, type;
		for(type in siteData) {
			tr = this.buildTr(type, siteData[type]);
			table.appendChild(tr);
		}
	},
	parseDataText: function (text) {
		var data = [],
			lines, line, arr, type;

		// 处理下，逗号修正为英文逗号
		text = text.replace(/，/g, ',');

		lines = text.split('\n');
		for (var i = 0, l = lines.length; i < l; i++) {
			line = lines[i].trim();
			if (!line) continue;
			arr = line.split(',');
			if (arr.length == 1) {
				type = arr[0];
				data[type] = [];
			} else {
				data[type].push({
					name: arr[0].trim(),
					url: arr[1] ? arr[1].trim() : null,
					imgSrc: "img/web" ? arr[2].trim() : null
				});
			}
		}
		return data;
	},
	buildTr: function (type, sites) {
		var tr = document.createElement('tr'),
			th = document.createElement('th'),
			span = document.createElement('span'),
			site, td, a, img, textNode, path;
		
		// 添加分类
		span.innerHTML = type;
		th.appendChild(span);
		tr.appendChild(th);

		// 添加站点
		for (var i = 0, l = sites.length; i < l; i++) {
			site = sites[i];

			td = document.createElement('td');
			a = document.createElement('a');
			img = document.createElement('img');
			textNode = document.createTextNode(site.name);

			a.setAttribute('title', site.name);
			path = this.handleUrl(site.url);
			if (path) {
				a.setAttribute('href', 'javascript:;');
				a.setAttribute('localpath', path);
				a.addEventListener('click', function(e){
					var fullpath = e.target.getAttribute('localpath');
					NewTab.exec(fullpath);
				}, false);

				site.exec = path;
			} else {
				a.setAttribute('href', site.url);
			}

			if (isNewTab) {
				a.setAttribute('target', '_blank');
			}
			
			// 设置图片的属性
			img.width = 16;
			img.height = 16;
			if (site.imgSrc) {
				img.src = site.imgSrc;
			} else {
				this.setIcon(img, site);
			}

			a.appendChild(img);
			a.appendChild(textNode);
			td.appendChild(a);
			tr.appendChild(td);
		}
		return tr;
	},
	handleUrl: function (urlOrPath) {
		if (this.localLinkRegExp.test(urlOrPath)) {
			return urlOrPath;
		}

		return false;
	},
	setIcon: function (img, obj) {
		var uri, iconURI;
		try {
		    uri = Services.io.newURI(obj.url, null, null);
		} catch (e) { }
		if (!uri) return;
	},
	// 设置背景图片并保存设置
	setAndSave: function(currentImage) {
		document.body.style.backgroundImage = 'url(' + currentImage + ')';
	},
};

NewTab.init();
//切换背景图
function changeImg() {
    var rand=Math.round(Math.random()*8+1);
    var currentImage = "https://bing.ioliu.cn/v1?w=1920&h=1080&d="+rand; 
    NewTab.setAndSave(currentImage);
}
