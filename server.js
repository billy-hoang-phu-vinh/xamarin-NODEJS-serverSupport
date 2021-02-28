
/*********************************************************************************
*  WEB422 – Assignment 5
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Phu Vinh Hoang Student ID: 157238189 Date: November 27, 2020
*
********************************************************************************/

require("dotenv").config({ path: "./config/keys.env" });

const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const bodyParser = require('body-parser');

const cors = require("cors");
const dataService = require("./modules/data-service.js");
const productService = require("./modules/dataProduct-service");

const data = dataService(process.env.pvhoang_atlas);
const data_product = productService(process.env.pvhoang_atlas);

const app = express();

app.use(bodyParser.json());
app.use(cors());
//TEST
const authorization = "Basic ZTUyOWUxZjhiYWM4NDE1MzliM2U0YTBkYTRmYWE0MWQ6N2FhYThjNmJjNzRiNDUxYzlhM2MwNjk5OWFmMzg3MjU=";
var clientId = 'e529e1f8bac841539b3e4a0da4faa41d',
    clientSecret = '7aaa8c6bc74b451c9a3c06999af38725';
var SpotifyWebApi = require('spotify-web-api-node');
// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

app.get("/token", (req, res) => {
    //app in app
    var token;
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            token = data.body['access_token'];
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
            res.json({
                result: {
                    token: token,
                    success: 1
                }
            })
        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
});
//voi moi lenh. -> token -> search

app.get("/sample", (req, res) => {
    //app in app
    var token;
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            token = data.body['access_token'];
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
            //token successfully
            /**get data */
            //test voi specific api
            //get elvis album
            spotifyApi.getArtistAlbums(
                '43ZHCT0cAZBISjO8DG9PnE',
                { limit: 10, offset: 20 },
                function (err, data) {
                    if (err) {
                        console.error('Something went wrong!');
                    } else {
                        console.log(data.body);
                        //data.body la 
                        var number_item = data.body.items.length;

                        var simple_res = data.body.items[0];
                        //test lay het data
                        var result_filter = []
                        //dung cach add 
                        data.body.items.forEach(element => {
                            result_filter.push({
                                id: element.id,
                                name: element.name,
                                uri: element.uri,
                                image: element.images[2].url
                            })
                        });
                        // var result = [{
                        //     id: simple_res.id,
                        //     name: simple_res.name
                        // }]


                        res.json({
                            result_sample: result_filter
                        })
                    }
                }
            );

        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
});
app.get("/artistrecommend/:id", (req, res) => {
    //app in app
    if (req.params.id) {
        var token;
        spotifyApi.clientCredentialsGrant().then(
            function (data) {
                token = data.body['access_token'];
                console.log('The access token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);

                // Save the access token so that it's used in future calls
                spotifyApi.setAccessToken(data.body['access_token']);
                //token successfully
                /**get data */
                //test voi specific api
                //get elvis album
                spotifyApi.getArtistAlbums(
                    req.params.id,
                    { limit: 10, offset: 20 },
                    function (err, data) {
                        if (err) {
                            console.error('Something went wrong!');
                        } else {
                            console.log(data.body);
                            //data.body la 
                            var number_item = data.body.items.length;

                            var simple_res = data.body.items[0];
                            //test lay het data
                            var result_filter = []
                            //dung cach add 
                            data.body.items.forEach(element => {
                                result_filter.push({
                                    id: element.id,
                                    name: element.name,
                                    uri: element.uri,
                                    image: element.images[2].url
                                })
                            });
                            // var result = [{
                            //     id: simple_res.id,
                            //     name: simple_res.name
                            // }]


                            res.json({
                                result_sample: result_filter
                            })
                        }
                    }
                );

            },
            function (err) {
                console.log('Something went wrong when retrieving an access token', err);
            }
        );
    } else {
        res.json({ error: "please provide id" })
    }
});
app.get("/search/:id", (req, res) => {
    //app in app
    if (req.params.id) {
        var token;
        spotifyApi.clientCredentialsGrant().then(
            function (data) {
                token = data.body['access_token'];
                console.log('The access token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);
    
                // Save the access token so that it's used in future calls
                spotifyApi.setAccessToken(data.body['access_token']);
                //token successfully
                /**get data */
                //test voi specific api
                //get elvis album
                spotifyApi.searchPlaylists(req.params.id)
                    .then(function (data) {
                        var result_filter = []
                                //dung cach add 
                                data.body.playlists.items.forEach(element => {
                                    result_filter.push({
                                        id: element.id,
                                        name: element.description,
                                        uri: element.uri,
                                        image: element.images[0].url
                                    })
                                });
                                
                        console.log('Found playlists are', data.body);
                        res.json(result_filter)
                    }, function (err) {
                        console.log('Something went wrong!', err);
                    });
            },
            function (err) {
                console.log('Something went wrong when retrieving an access token', err);
            }
        );
    } else {
        res.json({ error: "please search key" })
    }

    

});
//get category
app.get("/category", (req, res) => {
    //app in app
    spotifyApi.getCategories({
        limit: 5,
        offset: 0,
        country: 'US',
        locale: 'sv_SE'
    })
        .then(function (data) {
            res.json(data)
        }, function (err) {
            console.log("Something went wrong!", err);
        });
});


//TEST

app.post("/api/posts", (req, res) => {
    data.addNewPost(req.body).then((msg) => {
        res.json({ message: msg });
    }).catch((err) => {
        res.json({ message: `Server throws, error: : ${err}` });
    });
});

app.post("/product/posts", (req, res) => {
    data_product.addNewProduct(req.body).then((msg) => {
        res.json({ message: msg });
    }).catch((err) => {
        res.json({ message: `Server throws, error: : ${err}` });
    });
});

app.get("/api/posts", (req, res) => {
    data.getAllPosts(req.query.page, req.query.perPage, req.query.category, req.query.tag).then((data) => {
        res.json(data);
    })
        .catch((err) => {
            res.json({ message: `Server throws, error: : ${err}` });
        })
});
// get all furni product
app.get("/products", (req, res) => {
    data_product.getAll().then((data) => {
        res.json(data);
    })
        .catch((err) => {
            res.json({ message: `Server throws, error: : ${err}` });
        })
});

app.get("/products/best", (req, res) => {
    data_product.getBest().then((data) => {
        res.json(data);
    })
        .catch((err) => {
            res.json({ message: `Server throws, error: : ${err}` });
        })
});

app.get("/api/categories", (req, res) => {
    data.getCategories().then((data) => {
        res.json(data);
    })
        .catch((err) => {
            res.json({ message: `Server throws, error: : ${err}` });
        })
});

app.get("/api/tags", (req, res) => {
    data.getTags().then((data) => {
        res.json(data);
    })
        .catch((err) => {
            res.json({ message: `Server throws, error: : ${err}` });
        })
});

app.get("/api/posts/:id", (req, res) => {
    data.getPostById(req.params.id).then(data => {
        res.json(data);
    }).catch((err) => {
        res.json({ message: `Server throws, error: : ${err}` });
    });
});

app.put("/api/posts/:id", (req, res) => {
    data.updatePostById(req.body, req.params.id).then((msg) => {
        res.json({ message: msg });
    }).catch((err) => {
        res.json({ message: `Server throws, error: : ${err}` });
    });
});

app.delete("/api/posts/:id", (req, res) => {
    data.deletePostById(req.params.id).then((msg) => {
        res.json({ message: msg });
    }).catch((err) => {
        res.json({ message: `Server throws, error: : ${err}` });
    });
});

// mongoDB connection

data_product.connect().then(() => {
    app.listen(HTTP_PORT, () => { console.log("Server is running on Port: " + HTTP_PORT) });
})
    .catch((err) => {
        console.log("Unable to run the server: " + err);
        process.exit();
    });
