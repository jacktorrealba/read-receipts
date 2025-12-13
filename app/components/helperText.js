import { Box, Text, Center, Span } from "@chakra-ui/react"

export default function HelperText() {
    return (
        <>
            <Box width='75%' textAlign='center' mx="auto">
                <Text className='homeText'>
                    Your profile link should look like: <Span className='homeTextLink' color="customYellow">https://www.goodreads.com/user/show/123456789</Span>
                </Text>
            </Box>
        </>
    )
}