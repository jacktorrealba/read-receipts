'use client'
import { ChakraProvider, Box, defaultSystem} from "@chakra-ui/react"
import Title from './components/title';
import TitleMessage from './components/titleMessage';
import HelperText from './components/helperText';
import InputProfile from './components/input';
import LinkToForm from './components/linkToForm';
import theme from "./components/theme";

export default function Home() {
  return (
    <>
      
    <ChakraProvider value={theme}>
      <Box className="homePage">
        <Title></Title>
        <TitleMessage></TitleMessage>
        <InputProfile></InputProfile>
        <HelperText></HelperText>
        {/* <LinkToForm></LinkToForm> */}
      </Box>
    </ChakraProvider >
        
        
      
    </>
  )
}
