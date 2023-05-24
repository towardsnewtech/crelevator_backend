const db = require('../model/index');
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;
const fs = require('fs');
const path = require('path');

const Product = db.Product;
const Category = db.Category;
const SubCategory = db.SubCategory;

// Category

exports.addCategory = async (req, res) => {
  const { name, imagedata } = req.body;

  let base64Image = imagedata.split(';base64,').pop();
	let buf = Buffer.from(base64Image, 'base64');
  const imageName = crypto.randomBytes(16).toString("hex");
  
  fs.writeFile(path.join(__dirname, '../public/images/category/', imageName + ".png"), buf, function(error) {
    if (error) {
      throw error;
    } else {
      Category.create({
        name: name,
        image: imageName + ".png",
      }).then(category => {
        res.status(200).json({ success: true, imageUrl: 'images/category/' + imageName + ".png", id: category.id });
      });
    }
  });
}

exports.getCategories = async (req, res) => {
  Category.findAll({
      include: [{
          model: db.SubCategory,
          required: false // use left join
      }]
  }).then(categories => {
    res.status(200).json({ success: true, categories: categories });
  }).catch(err => {
      console.log(err);
  });
}

exports.updateCategory = async (req, res) => {
  const { id, name, imagedata } = req.body;

  if(imagedata === "") {
    Category.update(
      { name: name },
      { where: { id: id } }
    )
    .then((result) => {
      Category.findByPk(id).then((updatedCategory) => {
        res.status(200).json({ success: true, imageUrl: 'images/category/' + updatedCategory.image });
      });
    })
  } else {
    let base64Image = imagedata.split(';base64,').pop();
    let buf = Buffer.from(base64Image, 'base64');
    const imageName = crypto.randomBytes(16).toString("hex");
    
    Category.findOne({
      where: {
        id: id
      }
    }).then(category => {
      if(category) {
        fs.unlink(path.join(__dirname, '../public/images/category/', category.image), (err) => {
          if (err) throw err;
          fs.writeFile(path.join(__dirname, '../public/images/category/', imageName + ".png"), buf, function(error) {
            if (error) {
              throw error;
            } else {
              Category.update(
                { name: name,
                  image: imageName + ".png"
                },
                { where: { id: id } }
              )
              .then((result) => {
                Category.findByPk(id).then((updatedCategory) => {
                  res.status(200).json({ success: true, imageUrl: 'images/category/' + updatedCategory.image });
                });
              })
            }
          });
        });
      }
    });
  }
}

exports.deleteCategory = async (req, res) => {
  const { id } = req.body;

  Category.findOne({
    where: {
      id: id
    }
  }).then(category => {
    if(category) {
      fs.unlink(path.join(__dirname, '../public/images/category/', category.image), (err) => {
        if (err) throw err;
        Category.destroy({
          where: {
            id: id
          }
        }).then(result => {
          res.status(200).json({ success: true });
        })
      });
    }
  });
}

// Sub Category

exports.addSubCategory = async (req, res) => {
  const { name, imagedata, category_id } = req.body;

  let base64Image = imagedata.split(';base64,').pop();
	let buf = Buffer.from(base64Image, 'base64');
  const imageName = crypto.randomBytes(16).toString("hex");
  
  fs.writeFile(path.join(__dirname, '../public/images/subcategory/', imageName + ".png"), buf, function(error) {
    if (error) {
      throw error;
    } else {
      SubCategory.create({
        category_id: category_id,
        name: name,
        image: imageName + ".png",
      }).then(subcategory => {
        res.status(200).json({ success: true, imageUrl: 'images/subcategory/' + imageName + ".png", id: subcategory.id });
      });
    }
  });
}

exports.addProduct = async (req, res) => {
  const {
    product_name,
    product_price,
    contact_no,
    selected_sub_category,
    availability,
    imagedata,
    features,
    specifications
  } = req.body;

  let base64Image = imagedata.split(';base64,').pop();
	let buf = Buffer.from(base64Image, 'base64');
  const imageName = crypto.randomBytes(16).toString("hex");

  fs.writeFile(path.join(__dirname, '../public/images/products/', imageName + ".png"), buf, function(error) {
    if (error) {
      throw error;
    } else {
      Product.create({
        name : product_name,
        price : product_price,
        contact_no,
        sub_category_id: selected_sub_category.id,
        availability,
        features,
        specifications,
        image : imageName + ".png",
      }).then(product => {
        res.status(200).json({success : true, imageUrl: 'images/products/' + imageName + ".png", id : product.id});
      })
    }
  });
  
}

exports.getSubCategories = async (req, res) => {
  SubCategory.findAll().then(subcategories => {
    res.status(200).json({ success: true, categories: subcategories });
  });
}

exports.getProductList = async (req, res) => {
  Product.findAll().then(products => {
    res.status(200).json({success: true, products: products});
  })
}

exports.updateSubCategory = async (req, res) => {
  const { id, name, imagedata } = req.body;

  if(imagedata === "") {
    SubCategory.update(
      { name: name },
      { where: { id: id } }
    )
    .then((result) => {
      SubCategory.findByPk(id).then((updatedSubCategory) => {
        res.status(200).json({ success: true, imageUrl: 'images/subcategory/' + updatedSubCategory.image });
      });
    })
  } else {
    let base64Image = imagedata.split(';base64,').pop();
    let buf = Buffer.from(base64Image, 'base64');
    const imageName = crypto.randomBytes(16).toString("hex");
    
    SubCategory.findOne({
      where: {
        id: id
      }
    }).then(category => {
      if(category) {
        fs.unlink(path.join(__dirname, '../public/images/subcategory/', category.image), (err) => {
          if (err) throw err;
          fs.writeFile(path.join(__dirname, '../public/images/subcategory/', imageName + ".png"), buf, function(error) {
            if (error) {
              throw error;
            } else {
              SubCategory.update(
                { name: name,
                  image: imageName + ".png"
                },
                { where: { id: id } }
              )
              .then((result) => {
                SubCategory.findByPk(id).then((updatedSubCategory) => {
                  res.status(200).json({ success: true, imageUrl: 'images/subcategory/' + updatedSubCategory.image });
                });
              })
            }
          });
        });
      }
    });
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { id, name, imagedata, availability, specifications, features, price, contact_no } = req.body;

    if(!imagedata) {
      Product.update(
        { 
          name,
          availability,
          specifications,
          features,
          price,
          contact_no
        },
        { where: { id } }
      )
      .then((result) => {
        Product.findByPk(id).then((updatedProduct) => {
          res.status(200).json({ ...updatedProduct.dataValues, success: true, imageUrl: 'images/products/' + updatedProduct.image  });
        });
      })
    } else {
      let base64Image = imagedata.split(';base64,').pop();
      let buf = Buffer.from(base64Image, 'base64');
      const imageName = crypto.randomBytes(16).toString("hex");
      
      Product.findOne({
        where: {
          id: id
        }
      }).then(product => {
        if(product) {
          fs.unlink(path.join(__dirname, '../public/images/products/', product.image), (err) => {
            if (err) throw err;
            fs.writeFile(path.join(__dirname, '../public/images/products/', imageName + ".png"), buf, function(error) {
              if (error) {
                throw error;
              } else {
                Product.update(
                  { 
                    name,
                    image: imageName + ".png",
                    availability,
                    features,
                    specifications,
                    price,
                    contact_no
                  },
                  { where: { id: id } }
                )
                .then((result) => {
                  Product.findByPk(id).then((updatedProduct) => {
                    res.status(200).json({  ...updatedProduct.dataValues , success: true, imageUrl: 'images/products/' + updatedProduct.image });
                  });
                })
              }
            });
          });
        }
      });
    }
  } catch(err) {
    console.log(err);
  }
}

exports.getProductById = async (req, res) => {
  const { id } = req.body;

  try {
    Product.findOne({
      include: [{
        model: db.SubCategory,
        required: false // use left join
      }],
      where: {id}
    }).then((product) => {
      res.status(200).json({ success: true, product : product });
    });
  } catch(err) {
    console.log(err);
    return;
  }
}

exports.getProductListBySubCategoryId = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    let tmp = await SubCategory.findOne({where: {id}});
    if ( tmp == null ) {
      return res.json({ success: false })
    }
    let category_id = tmp.dataValues.category_id;
    let category = await Category.findOne({where: {id : category_id}});
    let category_name = category.dataValues.name;
    
    Product.findAll({
      where : {
        sub_category_id : id
      }
    }).then(products => {
      res.status(200).json({ success: true, products: products, category_name: category_name });
    }).catch(err => {
        console.log(err);
    });
  } catch(err) {
    console.log(err) ;
    return ;
  }
}
exports.deleteProduct = async (req, res) => {
  try {
    const {id} = req.body;

    Product.findOne({
      where: {
        id: id.id
      }
    }).then(product => {
      if(product) {
        fs.unlink(path.join(__dirname, '../public/images/products/', product.image), (err) => {
          if (err) throw err;
          Product.destroy({
            where: {
              id: id.id
            }
          }).then(result => {
            res.status(200).json({ success: true });
          })
        });
      }
    })
  } catch(err) {
    console.log(err)
  }
}

exports.deleteSubCategory = async (req, res) => {
  const { id } = req.body;

  SubCategory.findOne({
    where: {
      id: id
    }
  }).then(category => {
    if(category) {
      fs.unlink(path.join(__dirname, '../public/images/subcategory/', category.image), (err) => {
        if (err) throw err;
        SubCategory.destroy({
          where: {
            id: id
          }
        }).then(result => {
          res.status(200).json({ success: true });
        })
      });
    }
  });
}