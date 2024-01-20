import {Center, Box, Text, Code, ChakraProvider} from '@chakra-ui/react'
import theme from './theme';

export default function TitleMessage(){
    return (
      <ChakraProvider theme={theme}>
        <Center>

          <Box id='titleMessageBox' width='600px' textAlign='center'>

            <Text className='homeText'>
              Welcome to Read Receipts! Enter your GoodReads profile link below to get 
              your reading habits classification!
            </Text>

            <Text className='homeText' mt='3rem'>
              Your profile link should look like: 
            </Text>

            <Center mt='0.5rem'>
              <Text className='homeTextLink' color={'customYellow'}>https://www.goodreads.com/user/show/123456789</Text>
            </Center>
          </Box>

        </Center>
      </ChakraProvider>
          
    )
}