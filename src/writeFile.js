const fs = require('fs');
const iconv = require('iconv-lite');

function writeFile(filePath, fileContent) {
    wfiles(filePath, fileContent);
}

function wfiles(file, fileContent='hello world'){  
    // 测试用的中文  
    var str = fileContent;  
    // 把中文转换成字节数组  
    var arr = iconv.encode(str, 'utf-8');  
    console.log(arr);  
      
    // appendFile，如果文件不存在，会自动创建新文件  
    // 如果用writeFile，那么会删除旧文件，直接写新文件  
    fs.writeFile(file, arr, function(err){  
        if(err)  
            console.log("fail " + err);  
        else  
            console.log("写入文件ok");  
    });  
} 

module.exports = writeFile;