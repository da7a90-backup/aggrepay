'use client'

import {CreerDemandeBouton} from "@/components/CreerDemandeBouton";
import { DemandesList } from "@/components/DemandesList";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Container, Stack, Heading, useColorModeValue, Button, Flex, Text, Link, useBreakpointValue, } from '@chakra-ui/react';


export default function SidebarContentUser() {
    const [loaded, setLoaded] = useState<boolean>(false)

    const session = useSession()

  return (
    <>
      { session.data?.user.role === 'admin' ? (<DemandesList loaded={loaded} setLoaded={setLoaded} />) : 
      (<>

    <Container width="100%" h='calc(100vh)'>
          <Stack
            textAlign={'center'}
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}>
            <Heading fontSize={{ base: '3xl', md: '5xl', lg: '7xl' }} w='calc(80vw)'>
            <Text
              as={'span'}
              position={'relative'}
              color={useColorModeValue('gray.900', 'gray.100')}
              _after={{
                content: "''",
                width: 'full',
                height: useBreakpointValue({ base: '20%', md: '30%' }),
                position: 'absolute',
                bottom: -1,
                left: 0,
                bg: '#d4ff1e',
                zIndex: -1,
              }}>
              Bienvenue à 
            </Text>
            <br />{' '}
              <Text as={'span'} color={'#d4ff1e'}>
              Aggrepay
              </Text>
            </Heading>
            <Text color={'gray.500'} maxW={'3xl'} fontSize='20px'>
            votre moyen sûr pour echanger de l'argent à travers les differents Wallets en Mauritanie.
            pour créer une demande d'echange cliquer sur le bouton si dessous.
            </Text>
            <Stack spacing={8} direction={{ base: 'column', md: 'row' }}>
              <Button rounded={'full'} px={9} border="2px" borderColor="#d4ff1e">
              <CreerDemandeBouton setLoaded={setLoaded} />
              </Button>
            </Stack>
          </Stack>
        </Container>
      
      </>)}
    </>
  );
}
