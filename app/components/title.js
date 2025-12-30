import { Box, Heading , Text} from "@chakra-ui/react"

export default function Title(){
  
  return (
    <>
      <Box id="titleBox" display='flex' alignItems='center' justifyContent='center'   mt='10rem'>
        <Text className="title" >
          Read
        </Text>
        <Text ml='1rem' className="title" >
          Receipts
        </Text>
      </Box>

    </>
      
  )
}