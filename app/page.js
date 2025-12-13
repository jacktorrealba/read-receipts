'use client'
import { ChakraProvider, Box, defaultSystem} from "@chakra-ui/react"
import Title from './components/title';
import TitleMessage from './components/titleMessage';
import InputProfile from './components/input';
import LinkToForm from './components/linkToForm';
import theme from "./components/theme";

export default function Home() {
  return (
    <>
      
    <ChakraProvider value={theme}>
      <Box className="homePage">
        <Box pb="25%">
          <Title></Title>
          <TitleMessage></TitleMessage>
          <InputProfile></InputProfile>
          <LinkToForm></LinkToForm>
        </Box>
      </Box>
    </ChakraProvider >
        
        
      
    </>
  )
}
