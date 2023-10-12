import request from '@/util/axios-util';
const httpUrl = import.meta.env.VITE_APP_BASE_URL;
/**
 * 用法
 * 自定义全局通用方法传入
 * @param url 请求地址
 * @param method 方法  get post
 * @param params 参数 a={} 或者 {a:1},{b:2]
 * @param type 类型   1 参数放params      2 参数放body 3参数放params并返回文件流
 * @param headers 请求头{}
 * @returns {*}
 */
export const http = (url,method, params,type,headers = {}) => {
  url = httpUrl + url;
  if(type === 1){
    return requestApi(url,method,params,type,headers)
  }else if(type === 2){
    return requestApi2(url,method,params,type,headers)
  }else if(type === 3){
    return requestApi3(url,method,params,type,headers)
  }
}
/**
 * 请求提交接口
 * 作为一个对象传输
 * 带页码
 */
function requestPageApi(url,method,current, size, params,headers){
  return request({
    url: url,
    method: method,
    headers: headers,
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
 * 请求提交接口
 * 作为一个对象传输
 */
function requestApi(url,method,params,type,headers){
  return request({
    url: url,
    method: method,
    headers: headers,
    params: {
      ...params
    }
  })
}
/**
 * 请求提交接口
 * 作为多个对象
 */
function requestApi2(url,method,params,type,headers){
  return request({
    url: url,
    method: method,
    headers: headers,
    data: params
  })
}

/**
 * 文件流
 */
function requestApi3(url,method,params,type,headers){
  // 需调用 downloadXls(流数据,文件名)
  return request({
    url: url,
    method: method,
    headers: headers,
    params: {
      ...params
    },
    responseType: 'blob'
  })
}
