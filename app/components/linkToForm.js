import { Center, Text, Link, Span } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'

export default function LinkToForm() {
    return (
        <> 
            <Center mt='3rem' textAlign='center'>
                <Text className="homeText" fontSize='medium'>
                    If you have any questions, comments, or trouble viewing your results please fill out this form{" "} <Link href='https://docs.google.com/forms/d/e/1FAIpQLSe8LCSgoUnmsBxgIL8F6B-JmfvRD-7Nvg1nrAhnl4Mr_qzQ0w/viewform' isExternal fontWeight='bold'> here<ExternalLinkIcon mx='1px'/></Link>
                </Text>
            </Center>
        </>
    )
}