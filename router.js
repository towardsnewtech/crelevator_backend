const server = require('express');
const router = server.Router();

// Require controller modules.
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const productController = require('./controllers/productController');

//user route
router.post('/api/user/signup', userController.signUP);
router.post('/api/user/signin', userController.signIn);
router.post('/api/user/updateInfo', userController.updateInfo);
router.post('/api/user/changePassword', userController.changePassword);
router.post('/api/user/getAddress', userController.getAddress);
router.post('/api/user/updateAddress', userController.updateAddress);
router.post('/api/user/forgotpassword', userController.forgotPassword);
router.post('/api/user/resetPassword', userController.resetPassword);
router.get('/api/user/getAll', userController.getUsers);
router.post('/api/user/delete', userController.deleteUsers);

//admin user route
router.post('/api/admin/signup', adminController.signUP);
router.post('/api/admin/signin', adminController.signIn);
router.post('/api/admin/updateInfo', adminController.updateInfo);
router.post('/api/admin/changePassword', adminController.changePassword);

//product user route
router.post('/api/category/add', productController.addCategory);
router.get('/api/category/getAll', productController.getCategories);
router.post('/api/category/update', productController.updateCategory);
router.post('/api/category/delete', productController.deleteCategory);
router.post('/api/subcategory/add', productController.addSubCategory);
router.get('/api/subcategory/getAll', productController.getSubCategories);
router.post('/api/subcategory/update', productController.updateSubCategory);
router.post('/api/subcategory/delete', productController.deleteSubCategory);
router.get('/api/product/getAll', productController.getProductList);
router.post('/api/product/deleteProduct', productController.deleteProduct);
router.post('/api/product/addProduct', productController.addProduct);


module.exports = router;
