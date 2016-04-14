var request = require('request'),
    cheerio = require('cheerio'),
    URL_ISS = 'http://www.ishadowsocks.net/',
    CONF_PATH="d:/bin/gui-config.json",   //shadowsocks 配置文件位置
    TPL_PATH="d:/bin/gui-config.tpl.json"; //shadowsocks 配置文件模板位置



/* 数据请求 */
function dataRequest(dataUrl)
{
  request({
    url: dataUrl,
    method: 'GET'
  }, function(err, res, body) {
    if (err) {
      console.log(dataUrl);
      console.error('[ERROR]Collection' + err);
      return;
    }
    dataParseSs(body);


  });
}

/* 数据解析 */
function dataParseSs(body)
{
  var $ = cheerio.load(body);

  var articles = $('#free > div > div:nth-child(2) > div').text();
  var reg=/密码:(.*)/g;
  var m=articles.match(reg);
  var fs=require("fs");
  fs.readFile(TPL_PATH,{encoding:"utf-8",flag:"r"}, function (err, data) {
    if (err) throw err;
	
	for(var pw in m){
      data=   data.replace ("$"+pw,m[pw].replace("密码:",""));
    }

    fs.writeFile(CONF_PATH, data,{encoding:"utf-8"}, function (err) {
      if (err) throw err;
      console.log('shadowsocks config update success!'); //文件被保存
    });
	
  }); 
  //console.log(m);return;
}

dataRequest(URL_ISS);