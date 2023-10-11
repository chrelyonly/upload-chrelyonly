/**
 * 全站http配置
 * axios参数说明
 */
import axios from 'axios';
import {serialize} from '@/util/util';
import {Message} from 'element-plus';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// 加密解密工具,加密代替加签
import myCrypto from "@/util/crypto";

//默认超时时间
axios.defaults.timeout = 60000;
//返回其他状态码
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500;
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress 配置
NProgress.configure({
  showSpinner: false
});
//http request拦截
axios.interceptors.request.use(config => {
  //开启 progress bar
  NProgress.start();

  const meta = (config.meta || {});
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});
//http response 拦截
axios.interceptors.response.use(res => {
  //******************************************************************加解密处理开始
  //取出缓存判断是否需要打印日志
  let item = window.localStorage.getItem("myLogType");
  if (item === "1"){
    console.log(res.config.url);
    window.console.log("响应拦截器")
    window.console.log(res.data)
  }
  try {
    if (res.data) {
      let decrypt = myCrypto.decrypt(res.data);
      if (item === "1"){
        console.log("解密后的数据");
        console.log(decrypt);
      }
      if(decrypt){
        // 解密成功返回解密的对象
        let md5shaObject = JSON.parse(decrypt);
        if (item === "1"){
          console.log("转换对象");
          console.log(md5shaObject);
        }
        res.data = md5shaObject;
      }else{
        if (item === "1"){
          console.log("解密失败,返回原数据");
        }
      }
    }
  }catch (e) {
    console.log(e)
  }
  //******************************************************************加解密处理结束

  //关闭 progress bar
  NProgress.done();
  //获取状态码
  const status = res.data.code || res.status;
  const message = res.data.msg || res.data.error_description || '未知错误';
  // 如果请求为非200否者默认统一处理
  if (status !== 200) {
    Message({
      message: message,
      type: 'error'
    });
    return Promise.reject(new Error(message))
  }
  return res;
}, error => {
  NProgress.done();
  return Promise.reject(new Error(error));
});

export default axios;
