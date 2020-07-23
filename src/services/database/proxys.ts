import * as http from 'http'
import * as iconv from 'iconv-lite'; 
import * as BufferHelper from 'bufferhelper';
import * as GlobalTunnel from 'global-tunnel-ng';
import * as request from 'request'
import * as Polyfills from '../../polyfills'
import * as Modules from '../../modules'


export class Proxys {
    static CheckIndex: number = -1;
    static CheckProxyHosts: string[]
    static CheckProxys: {}
    static FinishCount: number = 0;
    static ProxyValids: {} = {};

    static async checkProxy1(host: string, port: number): Promise<boolean>  {
        return new Promise((resolve, reject) => {
            GlobalTunnel.initialize({ host: host, port: port });    
    
            var options = {
                host: "www.baidu.com"
            };  
    
        
            var callback = (response) => {
                var bufferHelper = new BufferHelper();
                response.on('data', function (chunk) {
                    bufferHelper.concat(chunk);
                });
            
                response.on('end', function () {
                    var strBuffer =  iconv.decode(bufferHelper.toBuffer(),'GBK');
                    if (strBuffer) {
                        GlobalTunnel.end();
                        resolve(true);
                    } else {
                        GlobalTunnel.end();
                        resolve(false);
                    }                    

                });
    
                response.on('error', function(err) {
                    GlobalTunnel.end();
                    reject(err)
                })
    
                response.on('close', function() {                    
                    // console.log('response close')
                })
                
            }
        
            var request = http.request(options, callback);
            request.on('error', function(err) {
                GlobalTunnel.end();
                reject(err);
            })
            
            request.end(()=> {});
        })
    }    


    static async checkProxy(host: string, port: number): Promise<boolean>  {
        return new Promise((resolve, reject) => {
            request({
              'url':'http://www.baidu.com',
              'method': "GET",
              'proxy':`http://${host}:${port}`
            },function (error, response, body) {
              if (!error && response.statusCode == 200) {
                resolve(true)
              } else {
                  if (!error && response) {
                      reject(new Error(response.statusCode))
                  } else {
                      reject(error)
                  }
              }
            })        
        })    
    }

    static async checkValid(proxys: Modules.Database.Proxys): Promise<{[host: string]: number}> {
        let count = this.CheckProxyHosts.length;
        while(count > 0 && this.CheckIndex < count) {
            this.CheckIndex++;
            let checkIndex = this.CheckIndex;
            let host = this.CheckProxyHosts[checkIndex];
            let port = this.CheckProxys[host] as number;
            // console.log(`${checkIndex} / ${count}`)
            try {
                await this.checkProxy(host, port); 
                this.FinishCount++;
                this.ProxyValids[host] = port;
                proxys.addValid(host, port)
                // proxys.db.set(`proxys.${host}`, port).write();
                console.log(`-----------------------------${checkIndex} / ${count}----- ${host} : ${port}`)      
            } catch (error) {
                this.FinishCount++;
                // console.error(`${checkIndex} / ${count} :` + error.message)                
            }
            console.log(`${Object.keys(this.ProxyValids).length} / ${this.FinishCount} / ${this.CheckProxyHosts.length}`);
        }
        return this.ProxyValids;
    }    

    static async checkValids(proxys: Modules.Database.Proxys, threadCount?: number): Promise<{[host: string]: number}> {
        this.FinishCount = 0;
        this.ProxyValids = {};
        this.CheckIndex = -1;
        this.CheckProxys = proxys.db.get("proxys").value() as {}
        this.CheckProxyHosts = Object.keys(this.CheckProxys);



        threadCount = threadCount || 200;
        let promises = []
        for (let i = 0; i < threadCount; i++) {
            let promise = this.checkValid(proxys);                        
            promises.push(promise);
            await Polyfills.sleep(200);
        }
        await Promise.all(promises);

        return this.ProxyValids;

        // let valids = {};
        // let hosts = proxys.db.keys().value();
        // console.log('checking proxys')
        // for (let index = 0; index < hosts.length; index++) {
        //     let host = hosts[index];
        //     let port = proxys.db.get(host).value() as number;
        //     try {
        //         let valid = await this.checkProxy(host, port);
        //         if (valid) {
        //             console.log(`11111111  ${host}:${port}`)
        //             valids[host] = port;
        //         } else {
        //             console.log(`22222222  ${host}:${port}`)
        //         }
        //     } catch (error) {
        //         console.log(`333333333  ${host}:${port} ` + error.message)
                
        //     }
        // }
        // console.log(`checking proxys end, ${Object.keys(valids).length} valid`)
    
        // return valids;

    }

    static async _collectProxyFromKDL(proxys: Modules.Database.Proxys, url: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            request({
              'url': url,
              'method': "GET"
            },function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  let hosts = {}
                  let lines = (body as string).split('\n');
                  let hostPrefix = '<td data-title="IP">';
                  let portPrefix = '<td data-title="PORT">';
                  let hostSubfix = '</td>';
                  let portSubfix = '</td>';
                  for (let i = 0; i < lines.length; i++) {
                      let hostLine = lines[i] || '';
                      let portLine = lines[i + 1] || '';
                      let hostIndex = hostLine.indexOf(hostPrefix);
                      let portIndex = portLine.indexOf(portPrefix);
                      if ( hostIndex >= 0 && portIndex >= 0) {
                          let hostTDIndex = hostLine.indexOf(hostSubfix , hostIndex);
                          let portTDIndex = portLine.indexOf(portSubfix , portIndex);
                          let host = hostLine.substr(hostIndex + hostPrefix.length, hostTDIndex - hostIndex - hostPrefix.length);
                          let port = portLine.substr(portIndex + portPrefix.length, portTDIndex - portIndex - portPrefix.length);
                          proxys.addProxy(host, parseInt(port));
                          hosts[host] = port;
                      }
                      
                  }
                  
                  
                // <td data-title="IP">

                resolve(hosts)
              } else {
                  if (!error && response) {
                      reject(new Error(response.statusCode))
                  } else {
                      reject(error)
                  }
              }
            })        
        })  
        return;
    }

    static async collectProxyFromKDL(proxys: Modules.Database.Proxys): Promise<any> {
        let URL =  "http://www.kuaidaili.com/free/inha/{page}/";
        let startCount = 200;
        let endCount = 2000;
        let count = 0;
        let page = startCount;
        while(page <= endCount) {
            try {
                let url = URL.replace('{page}', page as any);
                let hosts = await this._collectProxyFromKDL(proxys, url);
                count = count + Object.keys(hosts).length;
                console.log(`${count} / ${page} / ${endCount}`);
                // Polyfills.sleep(1000);
                page++;                    
            } catch (error) {
                console.error(error.message);                
            }
        }
    }
}