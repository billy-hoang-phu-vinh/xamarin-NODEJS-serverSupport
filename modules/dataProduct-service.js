//resolve request from client
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; 
const productSchema = require('./furni-schema');

module.exports = function(mongoDBConnectionString){

    let Product; 

    return {
        connect: function(){
            return new Promise(function(resolve,reject){
                let db = mongoose.createConnection(mongoDBConnectionString,{ useNewUrlParser: true, useUnifiedTopology: true });
                
                db.on('error', (err)=>{
                    reject(err);
                });
        
                db.once('open', ()=>{
                    Product = db.model("Products", productSchema);
                    resolve();
                });
            });
        },
        addNewProduct: function(data){
            return new Promise((resolve,reject)=>{

                let newProduct = new Product(data);

                newProduct.save((err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(`new Product: ${newProduct._id} successfully added`);
                    }
                });
            });
        },
        getAllProducts: function(page, perPage, category, tag){
            return new Promise((resolve,reject)=>{
                if(+page && +perPage){
                    
                        let filter = {}; 
                        if(category) filter.category = category;
                        if(tag) filter.tags = {$in: ["#" + tag]};

                        page = (+page) - 1;                      
                        Product.find(filter).sort({ProductDate: -1}).skip(page * +perPage).limit(+perPage).exec().then(Products=>{
                            resolve(Products)
                        }).catch(err=>{
                            reject(err);
                        });
                }else{
                    reject('page and perPage query parameters must be present');
                }
            });
        },
        // get all product
        getAll: function(){
            return new Promise((resolve,reject)=>{
                Product.find().exec().then(Products=>{
                    resolve(Products)
                }).catch(err=>{
                    reject(err);
                });
            });
        },
        getBest: function(){
            return new Promise((resolve,reject)=>{
                Product.find({"best":true}).exec().then(Products=>{
                    resolve(Products)
                }).catch(err=>{
                    reject(err);
                });
            });
        },
        getCategories: function(){
            return new Promise((resolve,reject)=>{
                               
                Product.find({}, '-_id category').sort().exec().then(data => {

                    let categories = data.map(cat => cat.category).sort();

                    let result = [];

                    let i = 0;
                    while (i < categories.length) {
                        let start = i;
                        while (i < categories.length && (categories[i] == categories[start])) {
                            ++i;
                        }
                        let count = i - start;
                        result.push({ cat: categories[start], num: count });
                    }

                    resolve(result);
                }).catch(err => {
                    reject(err);
                });
             
            });
        },
        getTags: function(){
            return new Promise((resolve,reject)=>{
                               
                Product.find({}, '-_id tags').exec().then(data => {
            
                    let result = [];

                    data.forEach(tagsObj => {
                        result = result.concat(tagsObj.tags)
                    });

                    let filteredResult = result.filter(function(item, pos){
                        return result.indexOf(item)== pos; 
                    });

                    resolve(filteredResult);
                }).catch(err => {
                    reject(err);
                });
             
            });
        },
        getProductById: function(id){
            return new Promise((resolve,reject)=>{
                Product.findOne({_id: id}).exec().then(Product=>{
                    resolve(Product)
                }).catch(err=>{
                    reject(err);
                });
            });
        },

        updateProductById: function(data, id){
            return new Promise((resolve,reject)=>{
                Product.updateOne({_id: id}, {
                    $set: data
                }).exec().then(()=>{
                    resolve(`Product ${id} successfully updated`)
                }).catch(err=>{
                    reject(err);
                });
            });
        },
        deleteProductById: function(id){
            return new Promise((resolve,reject)=>{
                Product.deleteOne({_id: id}).exec().then(()=>{
                    resolve(`Product ${id} successfully deleted`)
                }).catch(err=>{
                    reject(err);
                });
            });
        }
    }
}