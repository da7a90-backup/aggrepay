'use client'

import { Box, useColorModeValue, Container, Stack, SimpleGrid,Text, Image, Heading, Flex, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

const Footer:React.FC = () => {    
    return (
        <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
        >
        <Container as={Stack} maxW={'10xl'} py={10} px={10} >
            <SimpleGrid
            templateColumns={{ sm: '1fr', md: '2fr 1fr 1fr 1fr 1fr' }}
            spacing={8} >
            <Stack spacing={6} align={{base:'center' ,md:'flex-start'}}>
            <Text className="float-left bg-emerald-500 px-48 hover:text-gray">Aggrepay</Text>
                <Box w='80%'>
                    <Text fontSize={'sm'}>
                    Aggrepay est un service offert par El Bidaye S.A.R.L
                    </Text>
                </Box>

            </Stack>
            </SimpleGrid>
        </Container>
        </Box>
    )
}
export default Footer;