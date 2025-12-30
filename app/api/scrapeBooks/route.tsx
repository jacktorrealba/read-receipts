import { BreadcrumbLink } from '@chakra-ui/react';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import { MdOutlineTextRotationAngleup } from 'react-icons/md';
import { VscDebugContinueSmall } from 'react-icons/vsc';


// define Book object
interface Book {
    username?: string,
    title: string;
    userRating: number,
    bookTotalRating: string,
    bookAvgRating?: string,
    author: string,
    genres: string[],
    alreadyRead: boolean
}


interface TopGenres {
    [key: string]: any,
    genreName: string,
    count: number
}

interface TopAuthors {
    [key: string]: any,
    author: string,
    countOfAuthorRead: number,
    totalAuthorRating: number
}

// define GenreCount object
// interface GenreCount {
//     name: string;
//     count: number;
// }

// define the resulting object to pass to the view
 interface ResultInfo {
    username: string,
    totalBooks: number,
    topBooks: string[],
    topAuthors: string[],
    topGenres: string[],
    displayName: string,
    fontColor: string,
    background: string
    // firstWord: string,
    // secondWord?: string,
    // avgRatings: number,
    // topGenreRead: string,
    // firstDesc: string,
    // secondDesc: string
}

// define genres we care about
const whitelistGenres = [
    "Art",
    "Music",
    "Poetry",
    "Comic",
    "Manga",
    "Graphic Novel",
    "Romance",
    "Romantasy",
    "Chick Lit",
    "Christian",
    "Religion",
    "Spirituality",
    "Contemporary",
    "Literary Fiction",
    "Classics",
    "Queer",
    "Historical Fiction",
    "History",
    "Nonfiction",
    "Philosophy",
    "Psychology",
    "Science",
    "Sci-Fi",
    "Self Help",
    "LGBT",
    "Biography",
    "Memoir",
    "Fantasy",
    "Children",
    "Young Adult",
    "Humor",
    "Comedy",
    "Crime",
    "Horror",
    "Thriller",
    "Mystery",
    "Paranormal",
    "Suspense",
    "Feminism",
    "Mental Health",
    "Dystopia",
    "Gothic",
    "Plays",
]



// define the different reader types and their related genres
// const readerTypes = {
//     Aesthete: ["Art", "Music", "Poetry", "Comic", "Manga", "Graphic Novel"],
//     Romantic: ["Romance", "Chick Lit"],
//     Logophile: ["Contemporary", "Literary", "Classics"],
//     MindExpander: ["Queer", "Historical Fiction", "History", "Nonfiction", "Philosophy", "Psychology", "Science", "Sci-Fi", "Self Help", "LGBT", "Feminism" ,"Mental Health", "Christian", "Religion", "Spirituality"],
//     Protagonist: ["Biography", "Memoir", "Fantasy" ,"Dystopia"],
//     FunLover: ["Children", "YA", "Young Adult", "Sports", "Humor", "Comedy"],
//     NailBiter: ["Crime", "Horror", "Thriller", "Mystery", "Paranormal", "Suspense"]
// }

// define reader type object
interface ReaderTypesObj {
    [key: string]: string[]
}

async function getMaxPage(username: string): Promise<number> {
    const firstPage = `https://www.goodreads.com/review/list/${username}?page=1&shelf=read`
    try {
        const response = await axios.get(firstPage);
        const $ = cheerio.load(response.data);

        // get the element that stores the pagination numbers
        const paginationElement = $('#reviewPagination')

       // get the last element
       const lastPaginationElem = $(paginationElement).find('a').last();

       // from the last element, get the prev as it will be the last page 
       const lastPage: number = +lastPaginationElem.prev().text()
        
       return lastPage
        
    } catch (error) {
        throw error
    }
    
}

// function for translating user rating
function getUserRatingAsNum(stringRating: string) {

    interface RatingDict {
        [key: string]: number,

    }
    const ratingMap: RatingDict = {
        "it was amazing" : 5,
        "really liked it" : 4,
        "liked it" : 3,
        "it was ok" : 2,
        "did not like it" : 1
    } 

    // if no rating provide -> default 09
    if (stringRating == '') {
        return 0;
    }

    return ratingMap[stringRating];
}



function getTopBooks(books: Book[]) {

    // filter out re-reads, sort desc by userRating, and return the top 5 elements
    const topBooksArray = books.filter((book) => book.alreadyRead == false).sort((a,b) => b.userRating  - a.userRating).slice(0,5)

    return topBooksArray

}

 function getTopAuthors(books: Book[]) {
    // initialize new array to hold the author info read by the user
    let authorsReadArray: TopAuthors[] = [];

    // loop through each book read by the user
    books.forEach((bookInfo) => {

        // get the string rating back as a number 0-5
        //let rating = getUserRatingAsNum(bookInfo.userRating ? bookInfo.userRating : "")
        
        // look for duplicate authors
        const foundDupe = authorsReadArray.find(obj => obj.author == bookInfo.author);

        // if a dupe was found...
        if (foundDupe != undefined) {

            // increment the count
            foundDupe.countOfAuthorRead += 1

            // if there was a rating provide, then increment the rating -> to be used later in sorting
            if (bookInfo.userRating != undefined) {
                foundDupe.totalAuthorRating += bookInfo.userRating
            }
        } else {
            // if no dupe is found, just push the item into the array
            authorsReadArray.push({author: bookInfo.author, countOfAuthorRead: 1, totalAuthorRating: bookInfo.userRating ? bookInfo.userRating: 0})
        }
    })

    // sort the array desc by count of read and then by rating
    authorsReadArray = authorsReadArray.slice().sort((a, b) => b.countOfAuthorRead - a.countOfAuthorRead || b.totalAuthorRating - a.totalAuthorRating)

    // get top 3 from sorted array
    const top3Authors = authorsReadArray.slice(0, 3)

    return top3Authors; 
}

// function for getting the genres that match the whitelist
async function getBookGenres(titleUrl: string): Promise<string[]> {

    // set up the url
    const bookUrl = `https://www.goodreads.com/${titleUrl}`

    try {

        // get the response
        const response = await axios.get(bookUrl);
        const $ = cheerio.load(response.data)

        // define empty array
        const genres: string[] = []
        
        // get the elements where we can find the genres
        const genreList = $('.BookPageMetadataSection__genreButton')

        // loop through and get the genre
        genreList.each((index, genre) => {

            
            const genreText = $(genre).text().trim()
            
            // check if the genre exists in our whitelist
            const goodGenre = whitelistGenres.includes(genreText)

            // if it does, push it to the array otherwise do nothing
            if (goodGenre)
            {
                genres.push(genreText)

            } 
            //genres.push(genreText)
        });

        return genres

    } catch (error) {
        throw(error)
    }
}

// function to check if a date string is valid
function isValidDateString(dateString: string): boolean {
    const dateObject = new Date(dateString);
    return !isNaN(dateObject.getTime());
}

// function for getting all the books per page
async function getBooksPerPage(username: string, page: number): Promise<Book[]> {

    const readBooksURL = `https://www.goodreads.com/review/list/${username}?page=${page}&shelf=read`
    let books: Book[] = [];

    try {
        const response = await axios.get(readBooksURL);
        const $ = cheerio.load(response.data);
        
        // from today's date, look back 12 months
        const today = new Date()
        today.setMonth(new Date().getMonth() - 12) // change the month
        const last12MonthsDate = today

        // format into ISO (yyyy-MM-dd)
        //const stringLast12Months = last12MonthsDate.toISOString().split('T')[0]
        
        // get the elements that hold the book review information
        const elements  = $('.bookalike.review')

            // loop through each book found on the page
            for (let j = 0; j < elements.length; j++) {
                
                // check if there are multiple dates within the "read" field -> indicates the user read the book more than once
                const multipleReads = $(elements[j]).find('.field.date_read').find('.date_read_value').length

                const userRating = $(elements[j]).find('.rating').find('.value').text().trim()
                // convert user rating into a number
                const userRatingNum = getUserRatingAsNum(userRating ? userRating : "")
                
                // if there are multiple reads
                if (multipleReads > 1) {
                    
                    const alreadyRead = true

                    // get the elements that hold the dates
                    const multipleElems = $(elements[j]).find('.field.date_read').find('.date_read_value')

                    // loop through each of those elements
                    for (let i = 0; i < multipleElems.length; i ++) {

                        // get the date value
                        const stringDateRead = $(multipleElems[i]).text().trim()

                        // call function to check if it's a valid date
                        if (isValidDateString(stringDateRead)) {

                            // convert string date to date type
                            const dateRead = new Date(stringDateRead)

                            if (dateRead > last12MonthsDate) {
                                const titleUrl = $(elements[j]).find('.title').find('a').attr('href')
                                const bookGenre = await getBookGenres(titleUrl as string);
                                const book : Book = {
                                    title: $(elements[j]).find('.title').find('.value').text().trim(),
                                    userRating: userRatingNum,
                                    bookTotalRating: $(elements[j]).find('.num_ratings').find('.value').text().trim(),
                                    bookAvgRating: $(elements[j]).find('.avg_rating').find('.value').text().trim(),
                                    author: $(elements[j]).find('.author').find('a').text().trim(),
                                    genres: bookGenre,
                                    alreadyRead: alreadyRead
                                }
                                books.push(book)
                            }
                        }
                    } 
                } else {
                    const stringDateRead = $(elements[j]).find('.field.date_read').find('.date_read_value').text().trim()
                    // check if we have 
                    if (isValidDateString(stringDateRead)) {
                        
                        // convert to date object
                        const dateRead = new Date(stringDateRead)
                        
                        //const referenceDate = new Date(stringLast12Months)
                        //const bookReadDate = new Date(formattedDateReadObj)

                        // check if the book is read within the last 12 months
                        if (dateRead > last12MonthsDate) {
                            
                            const titleUrl = $(elements[j]).find('.title').find('a').attr('href')
                            const bookGenre = await getBookGenres(titleUrl as string);
                            
                            const book : Book = {
                                title: $(elements[j]).find('.title').find('.value').text().trim(),
                                userRating: userRatingNum,
                                bookTotalRating: $(elements[j]).find('.num_ratings').find('.value').text().trim(),
                                bookAvgRating: $(elements[j]).find('.avg_rating').find('.value').text().trim(),
                                author: $(elements[j]).find('.author').find('a').text().trim(),
                                genres: bookGenre,
                                alreadyRead: false
                            }
                            books.push(book)
                        }
                    }
                }
            }
        return books

    } catch (error) {
        throw error;
    }
}

// function for getting the top genre of a user
function getTopGenre(books: Book[]): string[] {
    
    // initialize an object 
    const genreCounts: {[key: string]: number} = {};

    // loop through each book
    books.forEach(book => {

        // loop through each genre
        book.genres.forEach(genre => {

            // count the genre types
            if(genreCounts[genre]) {
                genreCounts[genre] += 1;
            } else {
                genreCounts[genre] = 1;
            }

        });
    });

    // convert object to an array of objects
    const genreArr: TopGenres[] = Object.keys(genreCounts).map(name => ({
        genreName: name,
        count: genreCounts[name],
    }));

    // sort the array based on count in descending order
    genreArr.sort((a, b) => b.count - a.count)

    return genreArr.map((genre) => genre.genreName).slice(0,3)

    // // get the genre name with the most counts
    // const userTopGenre = genreArr[0].name

    // return userTopGenre
}

// function to loop through an object to match the top genre of a user to a reading type
// function getReaderType(searchGenre: string, readerTypeArr: ReaderTypesObj): string | "" {

//     for (const key in readerTypeArr) {

//         if (readerTypeArr.hasOwnProperty(key)) {

//             const array = readerTypeArr[key];

//             if (array.includes(searchGenre)) {
            
//                 if (key == "MindExpander"){
//                     return "Mind-Expander";
//                 } else if (key == "FunLover"){
//                     return "Fun-Lover";
//                 } else if (key == "NailBiter"){
//                     return "Nail-Biter";
//                 } else {
//                     return key;
//                 }
//             }
//         }
//     }
//     return "No Type Found"
// }

// functin for getting the average ratings of books that the user read in the past year
// function getAvgRatings(books: Book[]): number {

//     // use the reduce function to get the accumulation of the totalRating field in Book (the 10 means the input string should be parsed as a base-10 (decimal) number)
//     const totalRatingsOfBooks = books.reduce((sum, book) => sum + parseFloat(book.bookTotalRating.replace(/,/g, '')), 0);

//     // divide by the total length of books found
//     const avgRatings = totalRatingsOfBooks / books.length

//     return avgRatings
// }

// function to get the user's profile name
async function getUserInfo(username: string): Promise<string>  {
    
    // define the url for the profile
    const userUrl = `https://www.goodreads.com/user/show/${username}`

    try {
        // get and load the response data
        const response = await axios.get(userUrl);
        const $ = cheerio.load(response.data);

        const emojiRegex = /[\p{Emoji}]/gu;

        // get the user's profile name
        //const userProfileName = $('.userProfileName').text().trim()
        const userProfileName = $('#profileNameTopHeading').text().trim()

        const cleanUserProfileName = userProfileName.replace(emojiRegex, '')

        let finalUserName = ''

        // if the profile name exists, return the name
        if (cleanUserProfileName !== null ) {
            finalUserName = cleanUserProfileName
        } 

        return finalUserName
        
    } catch (error) {
        throw (error)
    }
}

// get the description based on the reader type
// function getTypeDesc(type: string): string {

//     const typeDescriptions: { [key: string]: string} = {
//         'Aesthete': "Your eye for greatness extends beyond the written word. You can find beautiful prose in anything creative, and can see things differently than those around you.",
//         'Protagonist': "You have a unique ability to imagine yourself in the shoes of the main character. You love to use that ability to explore different worlds and dream about amazing things.",
//         'Romantic': "You know how to show those around you how much you love them. You take the beauty of the relationships you read and put that into your own relationships, making them stronger.",
//         'Fun-Lover': "You know that books aren't only meant to make you cry - they can also be insight into how to make life better and more enjoyable. You have a talent for bringing the beauty of written word and fun together.",
//         'Nail-Biter': "Just because something is done with written word doesn't mean it is always spelled out for you. You have a unique mind for deciphering and discovering things that others inherently don't or can't.",
//         'Logophile': "You have a love for words unlike anyone else. You value prose so much in your reading habits, and it can heavily skew your opinion on a book overall, and it's why people trust your reading opinions most.",
//         'Mind-Expander': "Everything you touch gets better, and that is learned through the words you read on the page. You love discovering new things and gaining insight into worlds unknown before.",
//     };

//     // Return the description if it exists, otherwise an empty string
//     return typeDescriptions[type] || "";

// }

// function to export
export async function GET(request: NextRequest) {
    
    // get the username from the url
    const username = request.nextUrl.searchParams.get("username");
    const displayName = request.nextUrl.searchParams.get("displayName");
    const fontColor = request.nextUrl.searchParams.get("fontColor");
    const background = request.nextUrl.searchParams.get("background");

    //console.log(displayName, fontColor, background)
    
    try {


        // get the user's profile name
        const userInfo = await getUserInfo(username as string);
        
        // get the max page of read books
        const maxPage = await getMaxPage(username as string)

        // initialize variables and arrays
        let totalBooks: Book[] = [] // will hold all the books found per page
        //let currentPage = 1 // set the current page to 1

        for (let i = 1; i <= maxPage; i ++) {
            // make the call for getting the books on the current page, accepting a username and page number
            const booksFromPage = await getBooksPerPage(username as string, i)

            // if there are no more books found on the page, stop the loop by setting hasMoreBooks to false
            // otherwise, concat the books to the totalBooks array
            if (booksFromPage.length == 0){

            } else {
                totalBooks = totalBooks.concat(booksFromPage)
            }
        }


        // return top authors
        const topAuthorsRead = getTopAuthors(totalBooks)
        
        // return top 5 books from user
        const topFiveBooks = getTopBooks(totalBooks)

        // return total read books for the user
        const topGenre = getTopGenre(totalBooks)

        // get the count of books the user read over the past year
        const totalYTDBooks = totalBooks.length

        console.log(totalBooks)

        // return the user's type based on their most popular genre
        //const userType = getReaderType(topGenre, readerTypes)

        // return the average ratings of books the user read in the last year
        //const avgRatingForUser = getAvgRatings(totalBooks)

        // // get the first word 
        // let firstWordType: string = ""
        // let firstWordDesc: string = ""

        // // anything less than 100,000 ratings is considered "Underground"
        // if (avgRatingForUser < 600000)
        // {
        //     firstWordType = "Underground"
        //     firstWordDesc = "You know how to find a lost book in a crowded library. You pay less attention to hype and more attention to whether it has captivated you at first glance."

        // } else {

        //     firstWordType = "Vogue"
        //     firstWordDesc = "You are the most trusting type of reader. Your sixth sense is knowing when a new and amazing book is on the rise. Discussing, sharing, and trading thoughts with others is the best part about reading."

        // }

        // const secondWordDesc = getTypeDesc(userType || "")

        const resultInfo: ResultInfo = {
            username: userInfo,
            totalBooks: totalYTDBooks,
            topAuthors: topAuthorsRead.map((author) => author.author),
            topBooks: topFiveBooks.map((book) => book.title),
            topGenres: topGenre,
            displayName: displayName ? displayName: userInfo,
            fontColor: fontColor ? fontColor: "",
            background: background ? background: ""
            // firstWord: firstWordType,
            // secondWord: userType,
            // avgRatings: avgRatingForUser,
            // topGenreRead: topGenre,
            // firstDesc: firstWordDesc,
            // secondDesc: secondWordDesc
        }

        return NextResponse.json(resultInfo)

    } catch (error) {
        
        return NextResponse.json(error)
        
    }
}

