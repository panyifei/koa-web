# koa-web
后台使用koajs的一个例子服务器，备注写的很详细，包括中间件的使用情况

注意运行需要参数`--harmony`来开启es6的语法。node本身也需要0.11.7以上的版本。

就像这样`node --harmony app.js`

## koajs和express的差别
koa将更多的中间件交给开发者自己扩展了，当然koa本身也在支持者一套官方的中间件

koa支持了generator语法