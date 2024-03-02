'use client'

import {
    Button,
    CircularProgress,
    Flex,
    FormControl,
    FormErrorMessage,
    Heading,
    Input,
    VStack,
  } from '@chakra-ui/react';
  import React, { useState } from 'react';
  import { signIn, useSession } from 'next-auth/react';
  import { useRouter } from 'next/navigation';
  
  export default function SignIn() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loggingIn, setLoggingIn] = useState<boolean>(false);
  
    const { data: session } = useSession();
    console.log('Session: ', session);
  
    const router = useRouter();
  
    const handleSignIn = async (e: React.SyntheticEvent) => {
      e.preventDefault();
  
      setLoggingIn(true)
      console.log('Username: ', username);
      await signIn('credentials', {
        redirect: false,
        username,
        password,
      })
        .then((response) => {
          console.log(response);
          router.replace('/dashboard');
          setLoggingIn(false)
        })
        .catch((error) => {
          console.log(error);
        });
    };
    return (
      <Flex h={'100%'} justifyContent={'center'} alignItems={'center'}>
        {(
          <VStack w={'100%'} spacing={5}>
            <Heading as="h2" color={'white'} fontFamily={'monospace'} fontWeight={'bolder'}>
              Sign In
            </Heading>
            <form onSubmit={handleSignIn} style={{ width: '75%' }}>
              <VStack spacing={5} w={'100%'}>
                <FormControl isRequired={true}>
                  <Input
                    type={'text'}
                    color={'white'}
                    placeholder={'Username'}
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <FormErrorMessage>
                    {username === '' ? 'Username is required' : 'Invalid username'}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired={true}>
                  <Input
                    type={'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormErrorMessage>
                    Password cannot be less than 8 characters
                  </FormErrorMessage>
                </FormControl>
              </VStack>
              <Flex paddingTop={5} justifyContent={'center'}>
                {loggingIn ? 
                <CircularProgress isIndeterminate color='blue.400' />
                : <Button
                  type="submit"
                  borderRadius={'full'}
                  bgColor={'black'}
                  fontFamily={'monospace'}
                  color={'white'}
                  _hover={{
                    bgColor: 'transparent',
                    color: 'black',
                    border: '2px solid black',
                  }}
                  w={'60%'}
                >
                  SIGN IN
                </Button>}
              </Flex>
            </form>
          </VStack>
        ) }
      </Flex>
    );
  }