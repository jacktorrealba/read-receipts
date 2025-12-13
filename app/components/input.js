import { ArrowForwardIcon } from "@chakra-ui/icons"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Center, Box, RadioCard, Input, Button, Field, Text, FormControl, Heading, FormLabel, RadioGroup, HStack,Radio, FormErrorMessage, Container } from "@chakra-ui/react";
import theme from './theme';
import { CircularProgress } from "@chakra-ui/react";
import html2canvas from "html2canvas";



export default function InputProfile(){

  // define useStates
  const [pageInfo, setPageInfo] = useState(null)
  const [profileLink, setProfileLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [showButton, setShowButton] = useState(false)

  // define colors for background and text
  const backgroundColors = [
    {  value: "#B4C8FF" },
    {  value: "#F6E594" },
    {  value: "#BDDC7E" },
    {  value: "#F7CBB9" },
  ]

  const fontColors = [
    { value : "#f25596"},
    { value : "#7e4b58"},
    { value : "#3c4526"},
    { value : "#3a6f73"},
  ]

  // get the profile link from the input
  const handleInputChange = (e) => {
    setProfileLink(e.target.value);
  };

  // validate the url that the user inputted
  const isUrlValid = () => {
    const urlRegex = /^https:\/\/www\.goodreads\.com\/user\/show\/\d+$/;
    return urlRegex.test(profileLink);
  };

  // get the current date in specific format (ex: 15 January 2024) (this is for the output png result)
  useEffect(() => {
    const currentDateObj = new Date();
    const day = currentDateObj.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDateObj);
    const year = currentDateObj.getFullYear();
    const formattedDate = `${day} ${month} ${year}`
    setCurrentDate(formattedDate)
  }, [])
  
  // make the api call to web scrape goodreads
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true); // show the loading icon
    setShowButton(false) // hide the download png result button

    // initialize username string
    let username = ''

    // check for if the IsUrlValid function returned true to run api call
    if (isUrlValid){
      // get the user id from the valid url
      username = profileLink.match(/\/user\/show\/([^/]+)/)[1];
      
      try {
        // start api call 
        const response = await axios.get('/api/scrapeBooks', {
          params: {
            username: username,
          },
        });
        
        // on a successful return, remove the loading icon
        setLoading(false)
        
        // populate the result png template with data
        setPageInfo(response.data)
        
        // show the button to download png result
        setShowButton(true)
  
      } catch (error) {
        alert('Error fetching your data. Please try again.')
        console.log("Something went wrong", error);
        setLoading(false);
      }
    } 
  }

  const handleDownloadImage = () => {
    const resultDiv = document.getElementById('result');

    if (resultDiv) {

      // Save the current styles
      const originalStyles = {
        display: resultDiv.style.display,
        left: resultDiv.style.left,
        top: resultDiv.style.top,
        position: resultDiv.style.position,
      };

      // Make the div temporarily visible and move it off-screen
      resultDiv.style.display = 'block';
      resultDiv.style.left = '-9999px';
      resultDiv.style.top = '-9999px';
      resultDiv.style.position = 'absolute';


      html2canvas(resultDiv).then((canvas) => {
        
        const imageDataURL = canvas.toDataURL('image/png');

        // Create a link element to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = imageDataURL;
        downloadLink.download = `${pageInfo.username}_ReadReceipt.png`;
        downloadLink.click();

        // Revert the styles to their original values
        resultDiv.style.display = originalStyles.display;
        resultDiv.style.left = originalStyles.left;
        resultDiv.style.top = originalStyles.top;
        resultDiv.style.position = originalStyles.position;

      });
    }
  };

  
    
  return (
    <>
      
        <Box w="50%" mx="auto" mt="2rem">
          <Field.Root required>
            <Field.Label>
              Your Name <Field.RequiredIndicator />
            </Field.Label>
            <Input />
          </Field.Root>
          <RadioCard.Root  my="1rem">
            <RadioCard.Label>Pick a background color</RadioCard.Label>
            <HStack align="stretch">
              {backgroundColors.map((item) => (
                <RadioCard.Item key={item.value} value={item.value} background={item.value} h="40px">
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl/>
                </RadioCard.Item>
              ))}
            </HStack>
          </RadioCard.Root>
          <RadioCard.Root  my="1rem">
            <RadioCard.Label>Pick a font color</RadioCard.Label>
            <HStack align="stretch">
              {fontColors.map((item) => (
                <RadioCard.Item key={item.value} value={item.value} background={item.value} h="40px">
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl/>
                </RadioCard.Item>
              ))}
            </HStack>
          </RadioCard.Root>
        </Box>
        <Box id='inputBox' display='flex' justifyContent='center' alignItems='center' mt='3rem'>
          <Box className="inputBox" width='50%'>
            <Input
              id="submitInput"
              onChange={handleInputChange} 
              variant='outline'
              placeholder="https://www.goodreads.com/user/show/123456789"
              _placeholder={{color: 'offWhite'}}
              bg='customBlue'
              border='none'
              fontFamily='Karla, sans-serif'
            /> 
          </Box> 
          <Box className="btnBox" pl='1rem'>
            <Button id="submitBtn" onClick={handleSubmit} bg='customBlue' color='offWhite' isDisabled={!isUrlValid()}> 
              <ArrowForwardIcon/> 
            </Button>
          </Box>
        </Box>
        
          
        <Center id="loadingIconBox" mt='2rem'>
          {loading ? <CircularProgress isIndeterminate color="customYellow"></CircularProgress>: null}
        </Center>

        <Center id="downloadBtnBox" mt='2rem'>
          {showButton ? <Button bg="customYellow" onClick={handleDownloadImage}>Download PNG</Button>: null}
        </Center>

        {pageInfo ? (

          <Box fontFamily='Noto Serif, serif' className="result" id="result" display='none' >

            <Box textAlign='right' pr='5rem'>
              <Text fontSize='49px'>{pageInfo.username}&apos;s Read Receipt</Text>
              <Text mt='-0.5rem' fontSize='30px'>{currentDate}</Text>
            </Box>

            <Center mt='8rem'>
              <Text fontSize='40px'>Based on {pageInfo.totalBooks} books for the past year, you are the</Text>
            </Center>

            <Center>
              <Text fontSize='120px'>{pageInfo.firstWord}</Text>
            </Center>

            <Center mt='-4.5rem'>
              <Text fontSize='120px'>{pageInfo.secondWord}</Text>
            </Center>

            <Box width='100%' mt='8rem'>
              <Box textAlign='center' ml='600px'>
                <Text fontSize='30px'>Average popularity of books read:</Text>
                <Text mt='-1rem' fontSize='50px'>{Math.round(pageInfo.avgRatings).toLocaleString()} ratings</Text>
              </Box>
            </Box>

            <Box width='100%'>
              <Box textAlign='center' mr='650px'>
                <Text textAlign='center' fontSize='30px'>Most read genre:</Text>
                <Text mt='-1.5rem' textAlign='center' fontSize='50px'>{pageInfo.topGenreRead}</Text>
              </Box>
            </Box>

            <Center mt='30rem'>
              <Text lineHeight='1' width='80%' textAlign='center' fontSize='35px'>{pageInfo.firstDesc}</Text>
            </Center>
            
            <Center mt='2rem'>
              <Text lineHeight='1' width='80%' textAlign='center' fontSize='35px'>{pageInfo.secondDesc}</Text>
            </Center>

            <Center className="url" fontSize='25px' mt='8rem'>
              <Text >read-receipts.com</Text>
            </Center>

          </Box>
        ) : (
          <Box></Box>
        )}
        
      
    </>
  
  )
}