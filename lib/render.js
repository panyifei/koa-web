var views = require('co-views');


// 这里使用了 swig 引擎

module.exports = views(__dirname + '/../views', {
    map: { html: 'swig' }
});