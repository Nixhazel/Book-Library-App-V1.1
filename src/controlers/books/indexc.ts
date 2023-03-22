
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { creatData, getAllData} from "../../utils/users/indexU";

// C-O-N-T-R-O-L-E-R FUNCTION
//
//HOME PAGE

export const getHomePage = (req: Request, res: Response, next: NextFunction) => { 
  res.render("landingpage")
}


//FUNCTION FOR GET ALL BOOKS COMING FROM THE getAllData Function IN UTILITY
export const getAllBooks = (req: Request, res: Response, next: NextFunction) =>
{
  const allBooks = getAllData("books.json");
    res.render("home", {checkings: allBooks})
}

export const bookDetails = (req: Request, res: Response, next: NextFunction) => {
  const allBooks = getAllData("books.json");
  const id = req.body.bookID;
    const currentBook = allBooks.find((book:any) => book.id === id)
  res.render("videtails", {book: currentBook})
}

//FUNCTION FOR CREATING BOOKS COMING FROM THE creatData Function UTILITY
export const createBokoForm = (req: Request, res: Response, next: NextFunction) => {
res.render("createUser")
  
}

export const createBook = (req: Request, res: Response, next: NextFunction) => {
  const allBooks = getAllData("books.json");
    const {
    title,
    author,
    datePublished,
    Description,
    pageCount,
    genre,
    publisher
  } = req.body
  const existingBook = allBooks.find((e: any) => e.Title === title)
  if (existingBook) {
    return res.send({
      message: `Book with the title ${title} already exists` 
    });
  }
  const newChunk = {
    "id": uuidv4(),
    "Title": title,
    "Author": author,
    "datePublished": datePublished,
    "Description": Description,
    "pageCount": pageCount,
    "Genre": genre,
    "Publisher": publisher,
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
  allBooks.push(newChunk)
  creatData("books.json", allBooks);
  res.redirect("/book/getAllBooks");

}

//FUNCTION FOR UPDATING BOOKS COMING FROM THE creatData Function IN UTILITY

export const updateBookForm = (req: Request, res: Response, next: NextFunction )=> {
  const allBooks = getAllData("books.json");
  const id = req.body.bookID;
  const currentBook = allBooks.find((book: any) => book.id === id)
  // console.log(currentBook);
  res.render("edithUser", {book: currentBook})
}

export const updateBook = (req: Request, res: Response, next: NextFunction) => {
  try {
    const allBooks = getAllData("books.json");
  const id = req.body.bookID;
  // console.log(req.body);
  const existingBook = allBooks.find((book:any) => book.id === id)
  console.log({existingBook, allBooks, id});
  if (!existingBook) {
    return res.send({
      message: `Book with the ID ${id} dose not exists` 
    });
  }
  allBooks.forEach((book: any) => {
    if (book.id === id) {
      for (let fild in req.body){
        book[fild] = req.body[fild]
            }
            book.updatedAt = new Date()
          }
  });
  creatData("books.json", allBooks);
  res.redirect("/book/getAllBooks");
  } catch (error) {
    console.log("UpdateBookError",error);
  }
  
  // res.send(allBooks)
}

//FUNCTION FOR DELETING BOOKS COMING FROM THE creatData Function IN UTILITY

export const deleteBook = (req: Request, res: Response, next: NextFunction) => {
  const allBooks = getAllData("books.json");
  const id = req.body.bookID;

  const existingBook = allBooks.find((book:any) => book.id === id)
    if (!existingBook) {
      return res.send({
      message: `Book with the ID ${id} dose not exists` 
    });
    }
  
  const filteredBooks = allBooks.filter((e: any) => e.id !== id);

  creatData("books.json", filteredBooks);
  res.redirect("/book/getAllBooks");
}


  