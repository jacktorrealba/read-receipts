import { Box, Heading } from "@chakra-ui/react"

export default function Title(){
  
  return (
    <>
    
      <Box id="titleBox" display='flex' alignItems='center' justifyContent='center'   mt='10rem'>
        <Heading className="title" >
          Read
        </Heading>
        <Heading ml='1rem' className="title" >
          Receipts
        </Heading>
      </Box>

    </>
      
  )
}