// 引入less
import '@/static/css/index.css';
import './css/a.less';
import './css/home.css';
import { setHref } from '@/static/js/common'

setHref('/about.html')
console.log($, '全局jquery')

function get() {
    console.log(2)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('async')
        }, 3000);
    })
}
async function b() {
    let m = await get()
    console.log(m)
}
b()
