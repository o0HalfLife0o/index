var isNewTab = 1;

var NewTab = {
    init: function() {
        var table = document.getElementById("navtable");
        if (table.children.length > 0) {
            return;
        }

        navtableData.forEach(category => {
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            const span = document.createElement('span')
            span.innerHTML = category.type;
            th.appendChild(span);
            tr.appendChild(th);

            category.sites.forEach(site => {
                const td = document.createElement('td');
                const a = document.createElement('a');
                const img = document.createElement('img');
                const textNode = document.createTextNode(site.name);

                a.title = site.name;
                a.href = site.url;

                if (isNewTab) {
                    a.target = '_blank';
                }

                img.width = 16;
                img.height = 16;
                if ('iconX' in site) {
                    img.style.backgroundPosition = `-${site.iconX}px -${site.iconY}px`;
                    img.style.backgroundImage = "url('img/sprite.png')";
                    img.style.display = "inline-block";
                    img.style.backgroundRepeat = "no-repeat";
                    img.style.border = "none";
                } else {
                    img.src = site.icon
                }
                a.appendChild(img);
                a.appendChild(textNode);
                td.appendChild(a);
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
    },
    setAndSave: function(currentImage) {
        document.body.style.backgroundImage = 'url(' + currentImage + ')';
    }
};

NewTab.init();

function changeImg() {
    var currentImage = "https://bing.ioliu.cn/v1/rand?w=1920&h=1080";
    NewTab.setAndSave(currentImage);
}