'use client'

import { Box, Flex } from '@chakra-ui/react';
import SignIn from '@/components/SignIn';

export default function Form() {
  return (
    <Flex
      flexDirection={{ base: 'column', md: 'row' }}
      w={{ base: '500px', md: '900px' }}
      h={{ base: '900px', md: '600px' }}
      boxShadow={'0 0 5px 5px #aaa'}
      borderRadius={'10px !important'}
    >
      <Box
        w={{ base: '100%', md: '50%' }}
        h={'100%'}
        bgColor={'#1338BE'}
        borderLeftRadius={'10px'}
        borderBottomLeftRadius={{ base: '0', md: '10px', lg: '10px' }}
        borderTopRadius={'10px'}
        borderTopRightRadius={{ base: '10px', md: '0', lg: '0' }}
        transition={'0.5s ease-in'}
      >
        <SignIn />
      </Box>
    </Flex>
  );
}