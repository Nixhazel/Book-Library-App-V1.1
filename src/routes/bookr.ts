import express from 'express';
import { bookDetails, createBokoForm, createBook, deleteBook, getAllBooks, getHomePage, updateBook, updateBookForm } from '../controlers/books/indexc';
const router = express.Router();

router.use(express.static("public"));

// ROUTER FUNCTIONS

/* GET home page. */
router.get('/', getHomePage)

router.get('/getAllBooks', getAllBooks);
router.post("/bookDetails", bookDetails);

router.get('/createBook', createBokoForm);
router.post('/createBook', createBook);

router.post("/updateBookdetail", updateBook);
router.post("/updateBook", updateBookForm);

router.post("/deleteBook", deleteBook);



export default router;
