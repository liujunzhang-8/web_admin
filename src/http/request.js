import axios from 'axios'

const http = axios.create()

http.defaults.timeout = 3000

// 封装axios的post请求
export function fetch(url, params) {
    return new Promise ((resolve, reject) => {
        axios.post (url, params).then (response => {
            resolve(response.data)
        }).catch (error => {
            reject(error)
        })
    })
}

export default {
    // 暴露http_mock方法，即后面页面中用到的方法
    http_mock(url, params) {
        return fetch(url, params)
    }
}