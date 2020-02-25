# h5页面开发脚手架
开发h5页面时，为了能更方便的使用es6/7、less、模块机制、方便处理静态资源等写了这个webpack配置

## 使用
npm install or cnpm install

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
