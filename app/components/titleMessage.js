import {Center, Box, Text, ChakraProvider} from '@chakra-ui/react'


export default function TitleMessage(){
  return (
    <Center>
      <Box id='titleMessageBox' width='75%' textAlign='center'>
        <Text className='homeText'>
          Welcome to Read Receipts! Enter your GoodReads profile link below to get 
          your reading habits classification!
        </Text>
      </Box>
    </Center>
  )
}