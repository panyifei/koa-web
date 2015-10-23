var koa = require('koa');
//打印消息的中间件
var logger = require('koa-logger');
//将表单进行解析
var parse = require('co-body');
//规定了使用的模板引擎，支持‘ejs’,'jade','swig'这三种
var render = require('./lib/render');

//代替数据库
var posts = [];

//初始化App
var app = koa();


//用来得到路径的中间件
var route = require('koa-route');


//打印访问的log
app.use(logger());

//路由配置
//一旦触发了/这个路径，就会调用list
app.use(route.get('/', list));
app.use(route.get('/post/new', add));
//冒号代表着传入的参数
app.use(route.get('/post/:id', show));
app.use(route.post('/post', create));

function *list() {
    //对body进行设置就是返回的内容了
    this.body = yield render('list', { posts: posts });
}

function *add() {
    this.body = yield render('new');
}

//直接就可以拿到访问的id
function *show(id) {
    var post = posts[id];
    //没有就直接返回错误页
    if (!post) this.throw(404, 'invalid post id');
    //有的话就直接展示就行了
    this.body = yield render('show', { post: post });
}

function *create() {
    //先将表单的内容进行解析
    var post = yield parse(this);
    //创建一个id
    var id = posts.push(post) - 1;
    post.created_at = new Date;
    post.id = id;
    //然后直接重定位到主页
    this.redirect('/');
}

//监听3000端口,这里是可以监听多个端口的
app.listen(3000);
console.log('listening on port 3000');