'use client'

import { useColorMode, Box, useColorModeValue, Flex, Stack, Text, Button, Menu, MenuButton, Avatar, MenuList, Center, MenuDivider, MenuItem, HStack, Link, Image } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React, { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import SignOutButton from "@/components/SignOutButton";


const NavLink = ({ children }: { children: ReactNode }) => (
    <Link
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Link>
  );

const Navbar:React.FC = () => {

    const session = useSession()

    const Links = session.data?.user.role === 'admin' ? [{Key: "Déconnexion", component: SignOutButton}] : []

    const { colorMode, toggleColorMode } = useColorMode();
    return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
          <Text className="float-left bg-emerald-500 px-48 hover:text-gray">Aggrepay</Text>
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={8}>
            <HStack spacing={8} alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={6}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.Key}>{link.component()}</NavLink>
              ))}
            </HStack>
          </HStack>
            
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
      </>
    )
}
export default Navbar;