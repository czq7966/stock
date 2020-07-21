import * as fs from 'fs'
import * as path from 'path'
  
  
// 递归创建目录 异步方法  
export function mkdirs(dirname, callback) {  
    fs.exists(dirname, function (exists) {  
        if (exists) {  
            // 是个目录则执行callback方法
            callback();  
        } else { 
            // 递归调用mkdirs
            /*console.log(dirname);  
            console.log(path.dirname(dirname)); */ 
            mkdirs(path.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
            });  
        }  
    });  
}  
// 递归创建目录 同步方法
export function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
}