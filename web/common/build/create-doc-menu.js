var fs = require('fs');
var webtools = require('../module/webtools');
var docMenus = [];

var getPathLev = function(title) {
    var c = 0;
    for (var i = 0; i < title.length; i++) {
        if (title[i] == "#") c++;
    }
    return c;
};

console.log('开始遍历 markdown 文件');
var docPath = __dirname + "/../../areas/home/doc/";
var _files = fs.readdirSync(docPath);
for (var i = _files.length - 1; i >= 0; i--) {
    if (_files[i] == "index.md") {
        _files.splice(i, 1);
    }
}



console.log(_files);
//docMenus.push({ "ID": "00000000", "Title": "首页", "FileName": "index.md", "Lev": 1, "ParentID": "", "IsParent": false });
for (var i = 0; i < _files.length; i++) {
    var fileName = _files[i];
    console.log("开始解析 " + fileName);

    if (fileName.indexOf(".md") > -1) {

        var content = fs.readFileSync(docPath + "/" + fileName, { encoding: 'utf-8' });
        var arr = content.match(/#.*/g); //获取标题数组
        var curFileMenus = [];

        arr.map((t) => {
            curFileMenus.push({
                ID: webtools.myuuid.uuid(8, 16),
                Title: t
            });
        });

        for (var j = 0; j < curFileMenus.length; j++) {
            var preMenu = curFileMenus[j - 1];
            var curMenu = curFileMenus[j];
            var Title = curMenu.Title;
            curMenu.Title = curMenu.Title.replace(/#/g, "").replace(/ /g, "");
            curMenu.FileName = fileName;
            curMenu.Lev = getPathLev(Title);
            if (!preMenu) {
                curMenu.ParentID = "";
                curMenu.IsParent = true;
            } else {
                if (preMenu.Lev == curMenu.Lev) {
                    curMenu.ParentID = preMenu.ParentID;
                    curMenu.IsParent = false;
                }
                if (preMenu.Lev < curMenu.Lev) {
                    curMenu.ParentID = preMenu.ID;
                    preMenu.IsParent = true;
                    curMenu.IsParent = false;
                }
                if (preMenu.Lev > curMenu.Lev) {
                    for (var c = j - 1; c > -1; c--) {
                        if (curMenu.Lev == curFileMenus[c].Lev) {
                            curMenu.ParentID = curFileMenus[c].ParentID;
                            curFileMenus[c].IsParent = true;
                            break;
                        }
                    }
                }
            }

        }

        docMenus = docMenus.concat(curFileMenus);
        console.log(fileName + " 解析成功");
    }
}
var outFiltPath = __dirname + "/../../areas/home/static/script/doc-menus.json";
var fileContent = " " + JSON.stringify(docMenus) + "";
fs.writeFileSync(outFiltPath, fileContent);
