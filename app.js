var koa = require('koa');
//打印消息的中间件
var logger = require('koa-logger');
//将表单进行解析
var parse = require('co-body');
//规定了使用的模板引擎，支持‘ejs’,'jade','swig'这三种
var render = require('./lib/render');

//用来对专门的url进行权限管理
var mount = require('koa-mount');
//权限管理
var auth = require('koa-basic-auth');

//代替数据库
var posts = [];

//初始化App
var app = koa();


//用来得到路径的中间件
var route = require('koa-route');


//处理没有页面的情况
app.use(pageNotFound);

////处理没有页面的情况
//app.use(pageNotFound);
//授权失败
//这个必须放在上面
app.use(function *(next){
    try {
        yield next;
    } catch (err) {
        if (401 == err.status) {
            this.status = 401;
            this.set('WWW-Authenticate', 'Basic');
            this.body = 'cant haz that';
        } else {
            throw err;
        }
    }
});
////对需求页面进行授权
app.use(mount('/post/new', auth({ name: 'tobi', pass: 'ferret' })));
//处理简单的授权
//app.use(auth({ name: 'tj', pass: 'tobi' }));







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
    console.log(22);
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
    //重定位语句
    this.redirect('/');
}

function *pageNotFound(next){
    yield next;
    if (404 != this.status) return;
    this.status = 404;
    //判断需要的结果是页面还是json
    switch (this.accepts('html', 'json')) {
        case 'html':
            this.type = 'html';
            this.body = '<p>Page Not Found</p>';
            break;
        case 'json':
            this.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            this.type = 'text';
            this.body = 'Page Not Found';
    }
}

//监听3000端口,这里是可以监听多个端口的
app.listen(3000);
console.log('listening on port 3000');