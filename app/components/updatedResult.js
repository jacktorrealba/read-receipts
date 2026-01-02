
import { Box, Heading, Span, Text, Flex } from "@chakra-ui/react"
//import { fontFamily } from "html2canvas/dist/types/css/property-descriptors/font-family"


export default function Result({resultInfo}) {
    //console.log("resultinfo: ", resultInfo)
    // mapping the hex to string color
    const backgroundColorMap = {
        BDDC7E: "green.jpeg",
        F7CBB9: "peach.jpeg",
        F6E594: "yellow.jpeg",
        B4C8FF: "blue.jpeg"
    }

    const backgroundAsString = backgroundColorMap[resultInfo.background.substring(1)]
    const backgroundImage = `url("/resultTemplates/${backgroundAsString}")`

    const styleResultTitle = {
        //lineHeight: "100%",
        fontFamily: "var(--result-font)",
        margin: "0 4rem 0 0",
        fontWeight: "bolder",
        //padding: "10px",
        textAlign: "end",
        color: resultInfo.fontColor
    }

    const styleResultList = {
        fontFamily: "var(--result-font)",
        fontSize: "54px",
        fontWeight: "bold",
        //padding: "10px",
        textAlign: "start",
        margin: "0 0 6rem 4rem",
        color: resultInfo.fontColor,
        lineHeight: "100%",
        textTransform: "uppercase"
    }

    const styleResultCategory = {
        fontFamily: "var(--result-font)",
        fontSize: "36px",
        fontWeight: "bold",
        //padding: "10px",
        textAlign: "start",
        margin: "0 0 0 4rem",
        color: resultInfo.fontColor,
        lineHeight: "100%",
    }

    //const authorLastNameRegex = /^\w+,/

    //const authorFirstNameRegex = /,\s+\w+\s+([A-Z]?)+/

    // // variables to hold first and last name of author
    // let lastName = ''
    // let firstName = ''
    // const formattedAuthors = [];

    // // loop through each author and extract the first and last name with the comma
    // resultInfo.topAuthors.forEach(author => {

    //     //console.log('Author: ', author)
    //     lastName = author.match(/^\w+,/)

    //     const names = author.match(/^([^,]+\b)/)
    //     firstName = author.match(/,\s+\w+\s+\w+/)

    //     console.log('names: ',names)
    //     if (firstName != null && firstName.length > 1) {
    //         firstName = firstName[0]
    //     }

    //     //console.log("Last Name: ", lastName[0].substring(lastName.length-1))
    //     //console.log("First Name: ", firstName)

    //     formattedAuthors.push(`${firstName}, ${lastName[0].substring(lastName.length-1)}`)

    //     //lastName = lastName.substring(lastName.length - 1, 1)

    //     //firstName = firstName.substring(2)

    //     //formattedAuthors.push(firstName+' '+lastName)
    // });

    //console.log(formattedAuthors)    

    return (
        <>
            <Box className="result-template" backgroundImage={backgroundImage} id="result" display='none'>
                <Box width="100%" mx="auto" py="4rem" display="block">
                    <Heading style={styleResultTitle} lineHeight="50px" fontSize="96px">
                        {`${resultInfo.displayName.toUpperCase()}'S`}
                    </Heading>
                    <Heading style={styleResultTitle} lineHeight="150px" fontSize="200px">
                        READ RECEIPT
                    </Heading>
                    <Heading style={styleResultTitle} lineHeight="120px" fontSize="64px" pt="2rem">
                        2025
                    </Heading>
                </Box>
                <Box width="100%" mx="auto" mt="2rem" >
                    <Heading style={styleResultCategory}>
                        TOP BOOKS:
                    </Heading>
                    <Heading style={styleResultList}>
                        {resultInfo.topBooks.map((book) => (
                            <Text my="8px" key={book}>{book}</Text>
                        ))}
                    </Heading>

                    <Heading style={styleResultCategory}>
                        TOP AUTHORS:
                    </Heading>
                    <Heading style={styleResultList}>
                        {resultInfo.topAuthors.map((author) => (
                            <Text my="8px" key={author}>{author}</Text>
                        ))} 
                    </Heading>

                    <Heading style={styleResultCategory}>
                        TOP GENRES:
                    </Heading>
                    <Heading style={styleResultList}>
                        {resultInfo.topGenres.map((genre) => (
                            <Text my="8px" key={genre}>{genre}</Text>
                        ))}
                    </Heading>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading style={styleResultCategory}>
                            BOOKS READ: <Span color={resultInfo.fontColor} fontSize="64px">{resultInfo.totalBooks}</Span>
                        </Heading>
                        <Heading textAlign="end" fontSize="42px" color={resultInfo.fontColor} mr="4rem" fontFamily="var(--result-font)"  fontWeight="bold">yourreadreceipt.vercel.app</Heading>
                    </Flex>
                </Box>
                {/* <Box width="100%" mx="auto" mt="4rem" mb="0.5rem">
                    <Heading textAlign="end" fontSize="42px" color={resultInfo.fontColor} mr="4rem" fontFamily="Roboto" fontWeight="bold">readreceipts.vercel.app</Heading>
                </Box> */}
            </Box>
        </>
    )
}