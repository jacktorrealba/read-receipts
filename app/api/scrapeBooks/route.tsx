import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';


// define Book object
interface Book {
    username?: string,
    title?: string;
    userRating?: string,
    bookTotalRating: string,
    bookAvgRating?: string,
    genres: string[]
}

// define GenreCount object
interface GenreCount {
    name: string;
    count: number;
}

// define the resulting object to pass to the view
interface ResultInfo {
    username: string,
    totalBooks: number,
    firstWord: string,
    secondWord?: string,
    avgRatings: number,
    topGenreRead: string,
    firstDesc: string,
    secondDesc: string
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
    "Chick Lit",
    "Christian",
    "Religion",
    "Spirituality",
    "Contemporary",
    "Literary",
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
    "YA",
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
    "Dystopia"
]

// define the different reader types and their related genres
const readerTypes = {
    Aesthete: ["Art", "Music", "Poetry", "Comic", "Manga", "Graphic Novel"],
    Romantic: ["Romance", "Chick Lit"],
    Logophile: ["Contemporary", "Literary", "Classics"],
    MindExpander: ["Queer", "Historical Fiction", "History", "Nonfiction", "Philosophy", "Psychology", "Science", "Sci-Fi", "Self Help", "LGBT", "Feminism" ,"Mental Health", "Christian", "Religion", "Spirituality"],
    Protagonist: ["Biography", "Memoir", "Fantasy" ,"Dystopia"],
    FunLover: ["Children", "YA", "Young Adult", "Sports", "Humor", "Comedy"],
    NailBiter: ["Crime", "Horror", "Thriller", "Mystery", "Paranormal", "Suspense"]
}

// define reader type object
interface ReaderTypesObj {
    [key: string]: string[]
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
    
    try {
        const response = await axios.get(readBooksURL);
        const $ = cheerio.load(response.data);
        const books: Book[] = [];

        // get today's date
        const last12Months = new Date()

        // from today's date, look back 12 months
        last12Months.setMonth(last12Months.getMonth() - 12)

        // format into ISO (yyyy-MM-dd)
        const stringLast12Months = last12Months.toISOString().split('T')[0]
        

        // get the elements that hold the book review information
        const elements = $('.bookalike.review')
        
        // check if elements exist
        if (elements.length > 0) {

            try {

                await Promise.all(elements.map(async (index, element) => {
                    
                    // get the date that the book was read from the page
                    const dateRead = $(element).find('.date_read_value').first().text().trim()

                    // check if we have 
                    if (isValidDateString(dateRead)){

                        // convert to date object
                        const dateReadObject = new Date(dateRead)
    
                        // format into ISO
                        const formattedDateReadObj = dateReadObject.toISOString().split('T')[0]
        
                        // check if the book is read within the last 12 months
                        if (formattedDateReadObj >= stringLast12Months)
                        {
                            
                            const titleUrl = $(element).find('.title').find('a').attr('href')
                            const bookGenre = await getBookGenres(titleUrl as string)
        
                            const book: Book = {
                                title: $(element).find('.title').find('.value').text().trim(),
                                userRating: $(element).find('.rating').find('.value').text().trim(),
                                bookTotalRating: $(element).find('.num_ratings').find('.value').text().trim(),
                                bookAvgRating: $(element).find('.avg_rating').find('.value').text().trim(),
                                genres: bookGenre
                            }
                            
                            books.push(book)
                        }
                    }
                }));

            } catch (error) {

                //console.error('Error in Promise.all:', error);
                throw error;
            }
            
            return books;
        } 

        //console.log('No books found on the page');
        return [];

    } catch (error) {
        throw(error)
    }
}

// function for getting the top genre of a user
async function getTopGenre(books: Book[]): Promise<string> {
    
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
    const genreArr: GenreCount[] = Object.keys(genreCounts).map(name => ({
        name,
        count: genreCounts[name],
    }));

    // sort the array based on count in descending order
    genreArr.sort((a, b) => b.count - a.count);

    // get the genre name with the most counts
    const userTopGenre = genreArr[0].name

    return userTopGenre
}

// function to loop through an object to match the top genre of a user to a reading type
function getReaderType(searchGenre: string, readerTypeArr: ReaderTypesObj): string | "" {

    for (const key in readerTypeArr) {

        if (readerTypeArr.hasOwnProperty(key)) {

            const array = readerTypeArr[key];

            if (array.includes(searchGenre)) {
            
                if (key == "MindExpander"){
                    return "Mind-Expander";
                } else if (key == "FunLover"){
                    return "Fun-Lover";
                } else if (key == "NailBiter"){
                    return "Nail-Biter";
                } else {
                    return key;
                }
            }
        }
    }
    return "No Type Found"
}

// functin for getting the average ratings of books that the user read in the past year
function getAvgRatings(books: Book[]): number {

    // use the reduce function to get the accumulation of the totalRating field in Book (the 10 means the input string should be parsed as a base-10 (decimal) number)
    const totalRatingsOfBooks = books.reduce((sum, book) => sum + parseFloat(book.bookTotalRating.replace(/,/g, '')), 0);

    // divide by the total length of books found
    const avgRatings = totalRatingsOfBooks / books.length

    return avgRatings
}

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
function getTypeDesc(type: string): string {

    let typeDescription: string = ""

    if (type == "Aesthete") 
    {
        typeDescription = "Your eye for greatness extends beyond the written word. You can find beautiful prose in anything creative, and can see things differently than those around you."

    } else if (type == "Protagonist") {

        typeDescription = "You have a unique ability to imagine yourself in the shoes of the main character. You love to use that ability to explore different worlds and dream about amazing things."

    } else if (type == "Romantic") {

        typeDescription = "You know how to show those around you how much you love them. You take the beauty of the relationships you read and put that into your own relationships, making them stronger."

    } else if (type == "FunLover") {

        typeDescription = "You know that books aren\'t only meant to make you cry - they can also be insight into how to make life better and more enjoyable. You have a talent for bringing the beauty of written word and fun together."

    } else if (type == "NailBiter") {

        typeDescription = "Just because something is done with written word doesn\'t mean it is always spelled out for you. You have a unique mind for deciphering and discovering things that others inherently don\'t or can\'t."

    } else if (type == "Logophile") {

        typeDescription = "You have a love for words unlike anyone else. You value prose so much in your reading habits, and it can heavily skew your opinion on a book overall, and it's why people trust your reading opinions most."

    } else if (type == "MindExpander") {

        typeDescription = "Everything you touch gets better, and that is learned through the words you read on the page. You love discovering new things and gaining insight into worlds unknown before."

    } else {
        typeDescription = ""
    }

    return typeDescription

}

// function to export
export async function GET(request: NextRequest) {
    
    // get the username from the url
    const username = request.nextUrl.searchParams.get("username");
    
    try {

        // get the user's profile name
        const userInfo = await getUserInfo(username as string);

        // initialize variables and arrays
        let totalBooks: Book[] = [] // will hold all the books found per page
        let currentPage = 1 // set the current page to 1
        let hasMoreBooks = true; // by default set to true

        while (hasMoreBooks){
            
            // make the call for getting the books on the current page, accepting a username and page number
            const booksFromPage = await getBooksPerPage(username as string, currentPage)
            
            // if there are no more books found on the page, stop the loop by setting hasMoreBooks to false
            // otherwise, concat the books to the totalBooks array
            if (booksFromPage.length === 0){
                hasMoreBooks = false
            } else {
                totalBooks = totalBooks.concat(booksFromPage)
                currentPage++
            }
        }

        // return total read books for the user
        const topGenre = await getTopGenre(totalBooks)

        // get the count of books the user read over the past year
        const totalYTDBooks = totalBooks.length

        // return the user's type based on their most popular genre
        const userType = getReaderType(topGenre, readerTypes)

        // return the average ratings of books the user read in the last year
        const avgRatingForUser = getAvgRatings(totalBooks)

        // get the first word 
        let firstWordType: string = ""
        let firstWordDesc: string = ""

        // anything less than 100,000 ratings is considered "Underground"
        if (avgRatingForUser < 600000)
        {
            firstWordType = "Underground"
            firstWordDesc = "You know how to find a lost book in a crowded library. You pay less attention to hype and more attention to whether it has captivated you at first glance."

        } else {

            firstWordType = "Vogue"
            firstWordDesc = "You are the most trusting type of reader. Your sixth sense is knowing when a new and amazing book is on the rise. Discussing, sharing, and trading thoughts with others is the best part about reading."

        }

        const secondWordDesc = getTypeDesc(userType || "")

        const resultInfo: ResultInfo = {
            username: userInfo,
            totalBooks: totalYTDBooks,
            firstWord: firstWordType,
            secondWord: userType,
            avgRatings: avgRatingForUser,
            topGenreRead: topGenre,
            firstDesc: firstWordDesc,
            secondDesc: secondWordDesc
        }

        return NextResponse.json(resultInfo)

    } catch (error) {
        
        return NextResponse.json(error)
        
    }
}

