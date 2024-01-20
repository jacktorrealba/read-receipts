'use client'
import { ChakraProvider, Box} from "@chakra-ui/react"
import Title from './components/title';
import TitleMessage from './components/titleMessage';
import InputProfile from './components/input';
import LinkToForm from './components/linkToForm';
import Link from "next/link";

export default function Home() {
  return (
    <>
      <ChakraProvider>

      <Box className="homePage">
        <Title></Title>
        <TitleMessage></TitleMessage>
        <InputProfile></InputProfile>
        <LinkToForm></LinkToForm>
      </Box>
        
        
      </ChakraProvider>
    </>
  )
}
