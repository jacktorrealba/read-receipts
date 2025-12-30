
import { Box, Flex, Heading, Span, Text } from "@chakra-ui/react"


export default function Result() {

    // mapping the hex to string color
    const backgroundColorMap = {
        BDDC7E: "green.jpeg",
        F7CBB9: "peach.jpeg",
        F6E594: "yellow.jpeg",
        B4C8FF: "blue.jpeg"
    }

    // const backgroundAsString = backgroundColorMap[resultInfo.background.substring(1)]
    // const backgroundImage = `url("/resultTemplates/${backgroundAsString}")`

    const styleResultTitle = {
        fontFamily: "Livvic, sans serif",
        //lineHeight: "120px",
        margin: "0 4rem 0 0",
        fontWeight: "bolder",
        //padding: "10px",
        textAlign: "end",
        color: "#B4C8FF",
    }

    const styleResultList = {
        fontFamily: "Livvic, sans-serif",
        fontSize: "54px",
        fontWeight: "bold",
        //padding: "10px",
        textAlign: "start",
        margin: "0 0 6rem 4rem",
        color: "#B4C8FF",
        lineHeight: "100%",
        textTransform: "uppercase"
    }

    const styleResultCategory = {
        fontFamily: "Livvic, sans-serif",
        fontSize: "36px",
        fontWeight: "bold",
        //padding: "10px",
        textAlign: "start",
        margin: "0 0 0 4rem",
        color: "#B4C8FF",
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

    //     console.log('Author: ', author)
    //     lastName = author.match(/^\w+,/)
    //     firstName = author.match(/,\s+\w+\s+(\w?.?)+/)

    //     if (firstName != null && firstName.length > 1) {
    //         firstName = firstName[0]
    //     }

    //     console.log("Last Name: ", lastName)
    //     console.log("First Name: ", firstName)

    //     //lastName = lastName.substring(lastName.length - 1, 1)

    //     //firstName = firstName.substring(2)

    //     //formattedAuthors.push(firstName+' '+lastName)
    // });

    //console.log(formattedAuthors)    

    return (
        <>
            <Box className="result-template" backgroundImage="url(/resultTemplates/yellow.jpeg)" id="result" display="block">
                <Box width="100%" pt="4rem" display="block">
                    <Heading style={styleResultTitle}  fontSize="96px" lineHeight="80px">
                        JACK
                    </Heading>
                    <Heading style={styleResultTitle}  fontSize="200px" lineHeight="150px">
                        READ RECEIPT
                    </Heading>
                    <Heading style={styleResultTitle} pt="2rem"  fontSize="64px" lineHeight="100px">
                        2025
                    </Heading>
                </Box>
                <Box width="100%" mx="auto" mt="2rem">
                    <Heading style={styleResultCategory}>
                        TOP BOOKS:
                    </Heading>
                    <Heading style={styleResultList}>
                            <Text my="8px">THE EVERLASTING</Text>
                            <Text my="8px">BUNNY</Text>
                            <Text my="8px">NORMAL PEOPLE</Text>
                            <Text my="8px">A BEAST SLINKS TOWARDS BEIJING</Text>
                            <Text my="8px">book 5</Text>
                    </Heading>

                    <Heading style={styleResultCategory}>
                        TOP AUTHORS:
                    </Heading>
                    <Heading style={styleResultList}>
                        
                            <Text my="8px">author 1</Text>
                            <Text my="8px">author 2</Text>
                            <Text my="8px">author 3</Text>

                         
                    </Heading>

                    <Heading style={styleResultCategory}>
                        TOP GENRES:
                    </Heading>
                    <Heading style={styleResultList}>
                        <Text my="8px">genre 1</Text>
                        <Text my="8px">genre 2</Text>
                        <Text my="8px">genre 3</Text>
                    </Heading>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading style={styleResultCategory}>
                            BOOKS READ: <Span color="#B4C8FF" fontFamily="Livvic" fontSize="64px">62</Span>
                        </Heading>
                        <Heading textAlign="end" fontSize="42px" color="#B4C8FF" mr="4rem" fontFamily="Livvic" fontWeight="bold">readreceipts.vercel.app</Heading>
                    </Flex>
                </Box>
                {/* <Box width="100%" mx="auto" mt="4rem" mb="0.5rem">
                    <Heading textAlign="end" fontSize="42px" color="#B4C8FF" mr="4rem" fontFamily="Livvic" fontWeight="bold">readreceipts.vercel.app</Heading>
                </Box> */}
            </Box>
        </>
    )
}