const server = require('express');
const router = server.Router();

// Require controller modules.
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const productController = require('./controllers/productController');
const extrasController = require('./controllers/extrasController');

//user route
router.post('/api/user/signup', userController.signUP);
router.post('/api/user/signin', userController.signIn);
router.post('/api/user/updateInfo', userController.updateInfo);
router.post('/api/user/changePassword', userController.changePassword);
router.post('/api/user/getAddress', userController.getAddress);
router.post('/api/user/updateAddress', userController.updateAddress);
router.post('/api/user/forgotpassword', userController.forgotPassword);
router.post('/api/user/verifyemailforpassword', userController.verifyEmailForPassword);
router.post('/api/user/resetPassword', userController.resetPassword);
router.get('/api/user/getAll', userController.getUsers);
router.post('/api/user/delete', userController.deleteUsers);
router.post('/api/user/verifyemail', userController.verifyEmail);
router.post('/api/user/updateemailinfo', userController.UpdateEmailInfo);
router.post('/api/user/loademailinfo', userController.LoadEmailInfo);
router.post('/api/user/loadsmtpinfo', userController.LoadSMTPInfo) ;

//admin user route
router.post('/api/admin/signup', adminController.signUP);
router.post('/api/admin/signin', adminController.signIn);
router.post('/api/admin/updateInfo', adminController.updateInfo);
router.post('/api/admin/changePassword', adminController.changePassword);
router.post('/api/admin/forgotpassword', adminController.forgotPassword);
router.post('/api/admin/getUserinfo', adminController.getUserinfo);
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
router.post('/api/product/update', productController.updateProduct);
router.post('/api/product/bySubCategory', productController.getProductListBySubCategoryId);
router.post('/api/product/byId', productController.getProductById);
//extras user route
router.post('/api/extras/video/add', extrasController.addTrainingVideo);
router.post('/api/extras/faq/add', extrasController.addFaq);
router.post('/api/extras/news/add', extrasController.addNews);
router.post('/api/extras/pdf/add', extrasController.addPdf);
router.post('/api/extras/video/get', extrasController.getTrainingVideos);
router.post('/api/extras/faq/get', extrasController.getFaqs);
router.post('/api/extras/news/get', extrasController.getNews);
router.post('/api/extras/pdf/get', extrasController.getPdfs);
router.post('/api/extras/video/delete', extrasController.deleteTrainingVideo);
router.post('/api/extras/faq/delete', extrasController.deleteFaq);
router.post('/api/extras/news/delete', extrasController.deleteNews);
router.post('/api/extras/pdf/delete', extrasController.deletePdf);
router.post('/api/extras/quote-request', extrasController.quoteRequest);
router.post('/api/extras/cres', extrasController.cresRequest);

module.exports = router;
