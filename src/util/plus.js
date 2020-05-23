import bus from './bus';
import { app } from "./index";

export const plusReady = (callback) => {
    if(window.plus){
        // 在这里调用5+ API
        callback();
    }else{// 兼容老版本的plusready事件
        document.addEventListener('plusready', () => {
            // 在这里调用5+ API
            callback();
        },false);
    }
};

//获取App版本
export const getAppVersion = () => {
    if(!window.plus) return;
    plus.runtime.getProperty( plus.runtime.appid, function ( wgtinfo ) {
        app.version = wgtinfo.version;
    });
};
//获取网络
export const getNetwork = () => {
    if(!window.plus) return;
    let type = plus.networkinfo.getCurrentType();
    switch (type) {
        case plus.networkinfo.CONNECTION_UNKNOW:
        case plus.networkinfo.CONNECTION_NONE:
            app.network = false;
            break;
    }
};
//获取手机类型
export const getPhoneType = () => {
    let ua = navigator.userAgent.toLocaleLowerCase();
    if(/android/.test(ua)){
        return app.phoneType = 2 //Android
    }
    if(/iphone|ipad|opod|ios/.test(ua)){
        return app.phoneType = 1 //IOS
    }
};
//监听手机返回按钮
export const listenBackButton = (firstBack) => {
    if(!window.plus) return;
    window.plus.key.addEventListener('backbutton', () => {
        let webview = plus.webview.currentWebview();
        webview.canBack(e => {
            //alert(e.canBack);
            if(e.canBack){
                history.back();
            }else{
                if(!firstBack){
                    firstBack = new Date().getTime();
                    plus.nativeUI.toast('再按一次退出应用');
                    setTimeout(() => {
                        firstBack = 0;
                    }, 2000);
                }else if(
                    new Date().getTime() - firstBack < 2000){
                    plus.runtime.quit();
                }
            }
        })
    })
};

//监听网络变化
export const listenNetChange = () => {
    document.addEventListener('netchange', () => {
        let type = plus.networkinfo.getCurrentType();
        switch(type){
            case plus.networkinfo.CONNECTION_ETHERNET: //2
                plus.nativeUI.toast("当前处于以太网环境");
                app.network = true;
                break;
            case plus.networkinfo.CONNECTION_WIFI: //3
                plus.nativeUI.toast("当前处于WIFI环境");
                app.network = true;
                break;
            case plus.networkinfo.CONNECTION_CELL2G: //4
                plus.nativeUI.toast("当前处于2G环境");
                app.network = true;
                break;
            case plus.networkinfo.CONNECTION_CELL3G: //5
                plus.nativeUI.toast("当前处于3G环境");
                app.network = true;
                break;
            case plus.networkinfo.CONNECTION_CELL4G: //6
                plus.nativeUI.toast("当前处于4G环境");
                app.network = true;
                break;
            default:
                plus.nativeUI.toast("请链接您的网络");
                app.network = false;
                break;
        }
    })
};
//应用进入前台
export const listenResume = (callback = () => {}) => {
    document.addEventListener('resume', () => {
        //plus.nativeUI.toast("应用进入前台");
        callback();
    })
}
//应用进入后台
export const listenPause = (callback) => {
    document.addEventListener('pause', () => {
        //plus.nativeUI.toast("应用进入后台");
        callback();
    })
};
//更新App
export const updateApp = (downloadUrl) => {
    if(!window.plus || !downloadUrl){
        return;
    }
    //let vm = new Vue();

    let download = plus.downloader.createDownload(downloadUrl,
        {
            filename: '_doc/update/'
        },
    );

    download.addEventListener('statechanged', (download, status) => {
        if(download.state === 3){
            let totalSize = download.totalSize;
            let downloadedSize = download.downloadedSize;

            let progress = (downloadedSize * 100 / totalSize).toFixed(0);
            bus.$download(progress);
        }
        if(download.state === 4 && status === 200){
            plus.nativeUI.alert('下载成功');
            bus.$downloadHide();
            plus.runtime.install(download.filename, {}, () => {
                plus.runtime.restart();
            }, (e) => {
                plus.nativeUI.alert("安裝失敗");
            })
        }
        /*else{
            plus.nativeUI.alert("下載失敗");
            plus.nativeUI.closeWaiting();
        }*/
    }, false);
    download.start();
};

//获取本地图片
export const getLocalImg = function(obj, folder, imgKey) {
    if(window.plus){
        plus.io.resolveLocalFileSystemURL('_downloads/',
            entry => {
                entry.getDirectory(folder, {
                    create: true,
                }, dir => {
                    let fileDir = '_downloads/' + folder;
                    let getFile = (obj) => {
                        let imgName = obj[imgKey].substring(
                            obj[imgKey].lastIndexOf("/") + 1);
                        dir.getFile(imgName, {
                            create: false,
                        }, file => {
                            obj[imgKey] = plus.io.convertLocalFileSystemURL(fileDir + file.name)
                        }, err => {
                            plus.downloader.createDownload(obj[imgKey], {
                                filename: fileDir
                            }, (download, status) => {
                                if(status == 200){
                                    obj[imgKey] = plus.io.convertLocalFileSystemURL(fileDir + imgName);
                                }else{

                                }
                            }).start();
                        })
                    }
                    if(Array.isArray(obj)){
                        for(let item of obj){
                            getFile(item)
                        }
                    }else{
                        getFile(obj)
                    }
                })
            })
    }
};

