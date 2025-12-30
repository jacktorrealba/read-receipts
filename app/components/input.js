
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Center, Box, RadioCard, Span, Input, Button, Field, Text, HStack, FieldHelperText } from "@chakra-ui/react";
import { ProgressCircle } from "@chakra-ui/react";
import html2canvas from "html2canvas";
import Result from '../result/page';


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

  

export default function InputProfile() {
  // define useStates
  const [pageInfo, setPageInfo] = useState(null)
  const [displayName, setDisplayName] = useState(null)
  const [fontColor, setFontColor] = useState(null)
  const [background, setBackground] = useState(null)
  const [profileLink, setProfileLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [showButton, setShowButton] = useState(false)
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  

  // get the profile link from the input
  const handleInputChange = (e) => {
    setProfileLink(e.target.value);
  };

  const getDisplayName = (e) => {
    setDisplayName(e.target.value)
  };

  const getFontColor = (e) => {
    setFontColor(e.value)
  }

  const getBackgroundColor = (e) => {
    setBackground(e.value)
  }


  // validate the url that the user inputted
  const isUrlValid = () => {
    //const urlRegex = /^https:\/\/www\.goodreads\.com\/user\/show\/\d+$/;
    const urlRegex = /^https:\/\/www\.goodreads\.com\/user\/show\/.+$/;
    
    return urlRegex.test(profileLink);

  };

  // validate form 
  const validateForm = () => {
    // if any of the form elements are empty, return false
    if (displayName == null || fontColor == null || background == null) {
      return false
    }
    return true
  }


  useEffect(() => {
    const currentDateObj = new Date();
    const day = currentDateObj.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDateObj);
    const year = currentDateObj.getFullYear();
    const formattedDate = `${day} ${month} ${year}`
    setCurrentDate(formattedDate)

    const controller =  new AbortController()
    
    getReadReceipt().catch((error) => {
      return () => {
        controller.abort()
      }
    })
    
  }, [])

  async function getReadReceipt() {

      // get the username from the profile link provided
      const username = profileLink.match(/(?!.*\/).+/)[0]
      try {
        // start api call 
        const response = await axios.get('/api/scrapeBooks', {
          params: {
            username: username,
            displayName: displayName,
            fontColor: fontColor,
            background: background
          },
        });
        
        // on a successful return, remove the loading icon
        setLoading(false)
        
        // populate the result png template with data
        setPageInfo(response.data)
        
        // show the button to download png result
        setShowButton(true)
  
      } catch (error) {
        alert(error)
        setLoading(false);
      }
  }

  
  // make the api call to web scrape goodreads
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true) // show the loading icon
    setShowSubmitButton(false) // hide the submit button
    setShowButton(false) // hide the download png result button
    if (validateForm() && isUrlValid()) {
      getReadReceipt() // api call
    } else {
      // alert user when form is incomplete
      setLoading(false)
      alert("Invalid form! Please double check your profile link and make sure all fields are provided")
      setShowSubmitButton(true)
    }

    // // check for if the IsUrlValid function returned true to run api call
    // if (isUrlValid) {
      
    //   // check if all other form elements are filled
      
    //   if (!validateForm()) {
        
    //     alert('All fields are required')
    //     return
    //   }
    //   // get the user id from the valid url
    //   //const username = profileLink.match([/\/user\/show\/([^/]+)/])[1];
    //   const username = profileLink.match(/(?!.*\/).+/)[0]
  
    //   try {
    //     // start api call 
    //     const response = await axios.get('/api/scrapeBooks', {
    //       params: {
    //         username: username,
    //         displayName: displayName,
    //         fontColor: fontColor,
    //         background: background
    //       },
    //     });
        
    //     // on a successful return, remove the loading icon
    //     setLoading(false)
        
    //     // populate the result png template with data
    //     setPageInfo(response.data)
        
    //     // show the button to download png result
    //     setShowButton(true)
  
    //   } catch (error) {
    //     alert('Error fetching your data. Please try again.')
    //     //console.log("Something went wrong", error);
    //     setLoading(false);
    //   }
    // } 
    
  }

  // function for converting html into a pdf for final result
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
        downloadLink.download = `ReadReceipt_${pageInfo.displayName}.png`;
        downloadLink.click();

        // Revert the styles to their original values
        resultDiv.style.display = originalStyles.display;
        resultDiv.style.left = originalStyles.left;
        resultDiv.style.top = originalStyles.top;
        resultDiv.style.position = originalStyles.position;

      });
    }
  };

  function LoadingIcon({isLoading}) {
    if (isLoading) {
      return (
        <Center id="loadingIconBox" mt='2rem'>
          <ProgressCircle.Root value={null}>
            <ProgressCircle.Circle>
              <ProgressCircle.Track/>
              <ProgressCircle.Range strokeLinecap="round" stroke="customYellow"/>
            </ProgressCircle.Circle>
          </ProgressCircle.Root>
      </Center>
      )
    }
  }

  
    
  return (
    <>
      <Box id="formBox" w="50%" mx="auto" mt="2rem">
        <Field.Root required>
          <Field.Label>
            Your Name <Field.RequiredIndicator />
          </Field.Label>
          <Input onChange={getDisplayName} bg="customBlue" p="8px" />
        </Field.Root>
        <RadioCard.Root onValueChange={getBackgroundColor}  my="1rem">
          <RadioCard.Label>Pick a background color:</RadioCard.Label>
          <HStack align="stretch">
            {backgroundColors.map((item) => (
              <RadioCard.Item key={item.value} value={item.value} background={item.value} h="40px">
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl/>
              </RadioCard.Item>
            ))}
          </HStack>
        </RadioCard.Root>
        <RadioCard.Root onValueChange={getFontColor}  my="1rem">
          <RadioCard.Label>Pick a font color:</RadioCard.Label>
          <HStack align="stretch">
            {fontColors.map((item) => (
              <RadioCard.Item key={item.value} value={item.value} background={item.value} h="40px">
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl/>
              </RadioCard.Item>
            ))}
          </HStack>
        </RadioCard.Root>
        <Field.Root required>
          <Field.Label>
            Goodreads Profile Link <Field.RequiredIndicator />
          </Field.Label>
          <Input id="submitInput" onChange={handleInputChange} bg="customBlue" p="8px"/>
          <FieldHelperText color="black" >
            Your profile link should look like: <Span whiteSpace="pre" className='homeTextLink' color="customYellow">https://www.goodreads.com/user/show/123456789</Span>
          </FieldHelperText>
        </Field.Root>
        <Center>
          {showSubmitButton ? (
            <Button my="1.5rem" p="8px" id="submitBtn" onClick={handleSubmit} bg='customBlue' color='offWhite' disabled={!isUrlValid()}> 
              Get Read Receipt
            </Button>
          ): <Box></Box>}
        </Center>
      </Box>
        
      {loading ? <LoadingIcon isLoading={true}/> : <Box></Box>}

      <Center id="downloadBtnBox" mt='2rem'>
        {showButton ? <Button my="1.5rem" p="8px" w="25%" bg="customYellow" onClick={handleDownloadImage}>Download PNG</Button>: null}
      </Center>

      {pageInfo ? (
        <Result resultInfo={pageInfo}></Result>
      ) : (
        <Box></Box>
      )}
    </>
  )
}