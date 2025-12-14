'use client'
import { Center, Box, Text } from "@chakra-ui/react"


export default function ResultPage() {
    return (
        <>

            <Box className="result" id="result" display='none' >

                <Box textAlign='right' pr='5rem'>
                    <Text fontSize='49px'>dnl Read Receipt</Text>
                    <Text mt='-0.5rem' fontSize='30px'>13 January 2024</Text>
                </Box>

                <Center mt='8rem'>
                    <Text fontSize='40px'>Based on 38 books for the past year, you are the</Text>
                </Center>

                <Center>
                    <Text fontSize='120px'>Underground</Text>
                </Center>

                <Center mt='-4.5rem'>
                    <Text fontSize='120px'>Logophile</Text>
                </Center>

                <Box width='100%' mt='8rem'>
                    <Box textAlign='center' ml='600px'>
                        <Text fontSize='30px'>Average popularity of books read:</Text>
                        <Text mt='-1rem' fontSize='50px'>120,000 ratings</Text>
                    </Box>
                </Box>

                <Box width='100%'>
                    <Box textAlign='center' mr='650px'>
                        <Text textAlign='center' fontSize='30px'>Most read genre:</Text>
                        <Text mt='-1.5rem' textAlign='center' fontSize='50px'>Contemporary</Text>
                    </Box>
                </Box>

                <Center  mt='30rem'>
                    <Text width='80%' textAlign='center' fontSize='35px'>fasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfLorema;sdlkfajsl;dkfjals;kdjfla;skjdf;lakdsjflaksjd</Text>
                </Center>
                
                <Center mt='2rem'>
                    <Text width='80%' textAlign='center' fontSize='35px'>df asd fasdfasdf ad fasdf adf adsf ad af sdLorema;sdlkfajsl;dkfjals;kdjfla;skjdf;lakdsjflaksjd</Text>
                </Center>

            </Box>

        </>
    )
}

