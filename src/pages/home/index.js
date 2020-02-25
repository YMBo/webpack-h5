
// 引入less
import './css/a.less';
import {setHref} from '@/static/js/common'
setHref('/about.html')
function get(){
    console.log(2)
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve('触发')
        }, 3000);
    })
}
async function b(){
    let m =await get()
    console.log(m)
}
b()