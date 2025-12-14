import {Center, Box, Text} from '@chakra-ui/react'

export default function TitleMessage() {
  return (
    <Center>
      <Box id='titleMessageBox' width='75%' textAlign='center'>
        <Text className='homeText'>
          Welcome to Read Receipts! Enter your GoodReads profile link below to get 
          your yearly reading statistics!
        </Text>
      </Box>
    </Center>
  )
}