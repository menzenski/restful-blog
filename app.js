var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/blogapp');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

var blogSchema = new mongoose.Schema({
    title: String,
    image: {
        type: String,
        default: "https://farm4.staticflickr.com/3077/2889870211_90265821a2.jpg"
    },
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

app.get('/', function(request, response) {
    response.redirect('/blogs');
});

app.get('/blogs', function(request, response) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            response.render('index', {blogs: blogs});
        }
    });
});

app.get('/blogs/new', function(request, response) {
    response.render('new');
});

app.post('/blogs', function(request, response) {
    Blog.create(request.body.blog, function(err, newPost) {
        if (err) {
            console.log(err);
        } else {
            response.redirect('/blogs');
        }
    });
});

app.get('/blogs/:id', function(request, response) {
    Blog.findById(request.params.id, function(err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            response.render('show', {blog: foundPost});
        }
    });
});

app.get('/blogs/:id/edit', function(request, response) {
    Blog.findById(request.params.id, function(err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            response.render('edit', {blog: foundPost});
        }
    });
});

app.put('/blogs/:id', function(request, response) {
    Blog.findByIdAndUpdate(request.params.id, request.body.blog,
        function(err, updatedPost) {
            if (err) {
                console.log(err);
            } else {
                response.redirect('/blogs/' + request.params.id);
            }
        });
});

app.delete('/blogs/:id', function(request, response) {
    Blog.findByIdAndRemove(request.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            response.redirect('/blogs');
        }
    });
});

app.listen(3000, function() {
    console.log('Listening for app on port 3000.');
});
