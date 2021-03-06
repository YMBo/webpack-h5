# h5页面开发脚手架
开发h5页面时，为了能更方便的使用es6/7、less、模块机制、方便处理静态资源等写了这个webpack配置

## 使用
1. npm install or cnpm install    
2. `config/config.js` 设置好PSWD设计稿的宽度即可

## 模式    
``` javascript
1. npm run build (默认，提取js和css)    
2. npm run buildInline（内嵌，js和css内嵌到html且压缩）
3. npm run buildInlinecss（内嵌css，提取js文件，内嵌css）
4. npm run buildInlinejs（内嵌js，提取css文件，内嵌js）
```    
tip:不论哪种模式`setSize`这个包都会插入到html，原因是为了让html页面初始化更快速度    


## 开发注意
因为html-webpack-plugin和html-withimg-loader冲突，所以在使用页面模板和引入图片时有以下注意：    

* 如果页面是html(下面两种功能都是用的html-withimg-loader的功能)
    * 如果想使用html模板功能：  

        ``` html
        #include("../../template/header/head.html")
        ```
    *  引入图片：   
            
        按正常html引入图片方式写即可    
         ``` html
         <img src="./img/a.jpg" alt="" width="300">
        ```    
            
* 如果页面ejs(下面两种功能都是用的html-webpack-plugin的功能)    
    * 如果想使用页面模板功能    
        按照ejs的语法写即可    
        ``` javascript
        <% for(var k in htmlWebpackPlugin.files.chunks){ %>
                    <%=htmlWebpackPlugin.files.chunks[k].entry%>
        <% } %>
        ```    
    * 引入图片    
        ``` html
        <img src="<%= require('./img/a.jpg')%>" alt="" width="300">
        ```
