'use client'

import { Demande, Service } from "@/app/models/demande";
import { Flex, FormControl, FormErrorMessage, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, VStack, CircularProgress, useToast, Select, FormLabel } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import  *  as  Realm  from  "realm-web";
const  app = new  Realm.App({ id:  "data-qqmmq"});


type CreerDemandeBoutonProps = {
  setLoaded:  Dispatch<SetStateAction<boolean>>
}


export function CreerDemandeBouton({setLoaded}:CreerDemandeBoutonProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [nom_emetteur, setNom_emetteur] = useState<string>('')
    const [numero_emetteur, setNumero_emetteur] = useState<string>('')

    const [nom_destinataire, setNom_destinataire] = useState<string>('')

    const [numero_destinataire, setNumero_destinataire] = useState<string>('')

    const numdest = useRef<string>()

    const [service_emetteur, setService_emetteur] = useState<Service>()

    const [service_destinataire, setService_destinataire] = useState<Service>()

    const [montant, setMontant] = useState<number>(0)

    const montantReq = useRef<number>()

    const [submitting, setSubmitting] = useState<boolean>(false)

    const [user, setUser] = useState<Realm.User>()

    const [demandes, setDemandes] = useState<globalThis.Realm.Services.MongoDB.MongoDBCollection<any>>()

    const [numero_reception, setNumero_reception] = useState<any>()

    const [demandeEnvoyee, setDemandeEnvoyee] = useState(false)

    const [demandeCloture, setDemandeCloture] = useState(false)

    const validationMessage = useRef<string>('')

    const [showReceptionNumber, setShowReceptionNumber] = useState<boolean>(false)

    const insertedId  = useRef<string>()

    const demandePrecedente = useRef<any>()

    const toast = useToast()

    useEffect(()=>{
      const  login = async () => {
        if(localStorage.getItem('statut_demande') === '1'){
          setShowReceptionNumber(true)
        }

          // Authenticate anonymously
          const  user = await  app.logIn(Realm.Credentials.anonymous());
          setUser(user);
                      
          if(!app.currentUser){
              console.log('MongoDB Realm: current user not set properly')
              return
          }
          // Connect to the database
          const  mongodb = app.currentUser.mongoClient("Cluster0");
          

    /*       if(!process.env.MONGODB_DATABASE){
              console.log('MongoDB Realm: no database set in env')
              return
          } */

          const  demandes = mongodb.db('aggrepay').collection('demandes');
          
          const previousInsertedId = localStorage.getItem('insertedId')


          const numeros_reception_collection = mongodb.db('aggrepay').collection('numeros_reception')

          const numeros_reception = await numeros_reception_collection.find()

          setDemandes(demandes)

          setNumero_reception(numeros_reception[0])

          if(previousInsertedId){
            insertedId.current = previousInsertedId

            const previousRequest = await demandes.findOne({_id: {$oid: insertedId.current}})

            if(previousRequest){
              console.log("previous request exists!", previousRequest)
              demandePrecedente.current = previousRequest
              if(previousRequest.statut === 1){
                setShowReceptionNumber(true)
                const mntReq = montantReq.current ? montantReq.current : demandePrecedente.current.montant
                const numdestin = numdest.current ? numdest.current : demandePrecedente.current.numero_destinataire
                const servEmetteur = service_emetteur ? service_emetteur : demandePrecedente.current.service_emetteur
                console.log(servEmetteur)
                const servDest = service_destinataire ? service_destinataire : demandePrecedente.current.service_destinataire
                const msg = `Demande validée par l'administrateur veuillez envoyez ${mntReq} MRU au numero ${servEmetteur} suivant ${numeros_reception[0][servEmetteur]}
                Après avoir confirmé la reception l'administrateur va envoyer ${ mntReq - (mntReq*0.02)} MRU à ${numdestin} sur son Wallet ${servDest}`
                
                validationMessage.current = msg
                localStorage.setItem('statut_demande','1')
                localStorage.setItem('message_demande',msg)
              }
            }
          }

          const changeStream = demandes.watch()

          
          // Everytime a change happens in the stream, add it to the list of events
          for  await (const change  of  changeStream) {

              if(change.operationType == "update") {
                    const { documentKey, fullDocument } = change;
                    console.log(`new document with _id: ${documentKey}`, fullDocument);

                    console.log(fullDocument._id.toString())
                    console.log(insertedId)

                    if(fullDocument._id.toString() == insertedId.current){
                    if(fullDocument.statut === 2){
                      setShowReceptionNumber(false)
                      validationMessage.current = fullDocument.message
                      setDemandeCloture(true)
                      setTimeout(()=>{
                        insertedId.current = undefined
                        setDemandeEnvoyee(false)
                        setDemandeCloture(false)
                      },5000)
                      localStorage.removeItem('statut_demande')
                      localStorage.removeItem('message_demande')
                      localStorage.removeItem('insertedId')
                    }

                    if(fullDocument.statut === 1){

                      const previousRequest = await demandes.findOne({_id: {$oid: insertedId.current}})
                      demandePrecedente.current = previousRequest

                      const mntReq = montantReq.current ? montantReq.current : demandePrecedente.current.montant
                      const numdestin = numdest.current ? numdest.current : demandePrecedente.current.numero_destinataire
                      const servEmetteur = service_emetteur ? service_emetteur : demandePrecedente.current.service_emetteur
                      console.log(servEmetteur)
                      const servDest = service_destinataire ? service_destinataire : demandePrecedente.current.service_destinataire
                      const msg = `Demande validée par l'administrateur veuillez envoyez ${mntReq} MRU au numero ${servEmetteur} suivant ${numeros_reception[0][servEmetteur]}
                      Après avoir confirmé la reception l'administrateur va envoyer ${ mntReq - (mntReq*0.02)} MRU à ${numdestin} sur son Wallet ${servDest}`
                      
                      validationMessage.current = msg
                      localStorage.setItem('statut_demande','1')
                      localStorage.setItem('message_demande',msg)

                      setShowReceptionNumber(true)
                    }
                }
              }
              }
          }
          login();
  },[])


    const handleSubmit = (e: any)=>{

      e.preventDefault()

      setSubmitting(true)

      const createPromise = new Promise((resolve, reject) => {
        try{
        const demande: Demande = {
          nom_emetteur: nom_emetteur,
          nom_destinataire: nom_destinataire,
          numero_emetteur: numero_emetteur,
          numero_destinataire: numero_destinataire,
          service_emetteur: service_emetteur || 'Massrivi',
          service_destinataire: service_destinataire || 'Bankily',
          montant: montant,
          statut: 0
        }
        numdest.current = numero_destinataire
        montantReq.current = montant
  
        fetch('/api/demandes/nouvelle',
        {
          method:'POST',
          body: JSON.stringify(demande)
        }
        ).then((res)=>{
          res.json().then((saved)=>{
            console.log(saved)
            insertedId.current = saved.insertedId
            console.log(insertedId.current)
            const savedId = insertedId.current
            if(savedId){
            localStorage.setItem('insertedId', savedId)
          }
            setSubmitting(false)
            onClose()
            setLoaded(false)
            resolve(true)
            setDemandeEnvoyee(true)
          })
        })
      } catch (e) {
        reject(e)
      }
    })

    toast.promise(createPromise, {
      success: { title: 'Votre demande a été crée avec succès.', description: 'Très bien!', colorScheme:'gray' },
      error: { title: 'Erreur contactez le support technique.', description: 'Creation echoué' },
      loading: { title: 'Création de votre demande en cours...', description: 'Attendez svp...' },
    })

    }

    const onCloseEnvoyee = ()=>{
      setDemandeEnvoyee(false)
    }

    const getModalIsOpen = (modal: string)=>{
      if (typeof window !== "undefined") {

      const statut_demande = window.localStorage.getItem('statut_demande')
      if(modal === 'ajout'){
        if(statut_demande === '1' || insertedId.current){
          return false
        }
        return isOpen
      }
      if(modal === 'statut'){
        if(statut_demande === '1' || insertedId.current){
          const message_demande = window.localStorage.getItem('message_demande')
          if(message_demande){
          validationMessage.current = message_demande
        }
          return true
        }
        return demandeEnvoyee
      }    
    }
      return false

    }


    return (
        <>
        <button onClick={onOpen} className="py-5">créer une demande</button>
        <Modal isOpen={getModalIsOpen('ajout')} onClose={onClose}>
        <ModalOverlay 
          bg='none'
          backdropFilter='auto'
          backdropInvert='85%'
          backdropBlur='5px'
        />
         <ModalContent className="w-max font-mono font-bold" bgColor={'black'}>
          <ModalHeader color={'white'}>Créer une nouvelle demande </ModalHeader>
          <ModalCloseButton color={'white'} className="float-right" />
          <ModalBody bgColor={'black'} textColor={'#A0AEC0'}>
      
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={5} w={'100%'}>
                <FormControl className="grid grid-cols-2 gap-4"  isRequired={true}>
                <FormLabel>Nom emetteur</FormLabel>
                  <Input
                    className="col-span-1"
                    type={'text'}
                    color={'white'}
                    name="nom_emetteur"
                    value={nom_emetteur}
                    onChange={(e) => setNom_emetteur(e.target.value)}
                  />
                  <FormErrorMessage>
                    {'Nom Invalide'}
                  </FormErrorMessage>
                </FormControl>

                <FormControl className="grid grid-cols-2 gap-4"  isRequired={true}>
                <FormLabel>Nom destinataire</FormLabel>
                  <Input
                    className="col-span-1"
                    type={'text'}
                    color={'white'}
                    name="nom_destinataire"
                    value={nom_destinataire}
                    onChange={(e) => setNom_destinataire(e.target.value)}
                  />
                  <FormErrorMessage>
                    {'Nom Invalide'}
                  </FormErrorMessage>
                </FormControl>

                <FormControl className="grid grid-cols-2 gap-4"  isRequired={true}>
                <FormLabel>Numero emetteur</FormLabel>
                  <Input
                    className="col-span-1"
                    type={'text'}
                    color={'white'}
                    name="numero_emetteur"
                    value={numero_emetteur}
                    onChange={(e) => setNumero_emetteur(e.target.value)}
                  />
                  <FormErrorMessage>
                    {'Numero Invalide'}
                  </FormErrorMessage>
                </FormControl>

                <FormControl className="grid grid-cols-2 gap-4"  isRequired={true}>
                <FormLabel>Numero destinataire</FormLabel>
                  <Input
                    className="col-span-1"
                    type={'text'}
                    color={'white'}
                    name="numero_destinataire"
                    value={numero_destinataire}
                    onChange={(e) => setNumero_destinataire(e.target.value)}
                  />
                  <FormErrorMessage>
                    {'Numero Invalide'}
                  </FormErrorMessage>
                </FormControl>
                <FormControl className="grid grid-cols-2 gap-4"  isRequired={true}>
                <FormLabel>Service emetteur</FormLabel>
                  <Select
                  className="col-span-3"
                  color={'white'}
                  name="service_emetteur"
                  value={service_emetteur}
                  onChange={(e) => setService_emetteur(e.target.value as Service)}>
                    <option value={"Bankily"}>Bankily</option>
                    <option value={"Massrivi"}>Massrivi</option>
                  </Select>
                  <FormErrorMessage>
                    {'Service Invalide'}
                  </FormErrorMessage>
                </FormControl>

                <FormControl className="grid grid-cols-2 gap-4"  isRequired={true}>
                <FormLabel>Service destinataire</FormLabel>
                <Select
                  className="col-span-3"
                  color={'white'}
                  name="service_destinataire"
                  value={service_destinataire}
                  onChange={(e) => setService_destinataire(e.target.value as Service)}>
                    <option value={"Bankily"}>Bankily</option>
                    <option value={"Massrivi"}>Massrivi</option>
                  </Select>
                  <FormErrorMessage>
                    {'Service Invalide'}
                  </FormErrorMessage>
                </FormControl>

                <FormControl className="grid grid-cols-2 gap-4"  isRequired={true}>
                <FormLabel>Montant</FormLabel>
                  <Input
                    className="col-span-1"
                    type={'number'}
                    color={'white'}
                    placeholder={'Montant'}
                    name="montant"
                    value={montant}
                    onChange={(e) => setMontant(parseInt(e.target.value))}
                  />
                  <FormErrorMessage>
                    {'Service Invalide'}
                  </FormErrorMessage>
                </FormControl>

              </VStack>
              <Flex paddingTop={5} justifyContent={'center'}>
              {submitting ? 
              <CircularProgress isIndeterminate color='blue.400' />
              : <button type="submit" className="w-full px-2 py-2 bg-neutral-600 text-white hover:bg-neutral-400">
              Créer Demande
            </button>}
              </Flex>
            </form>
          </ModalBody>
      
          <ModalFooter>
           
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={getModalIsOpen('statut')} onClose={onCloseEnvoyee}>
        <ModalOverlay 
          bg='none'
          backdropFilter='auto'
          backdropInvert='85%'
          backdropBlur='5px'
        />
         <ModalContent className="w-max font-mono font-bold" bgColor={'black'}>
          <ModalHeader color={'white'}>{
          (!showReceptionNumber && !demandeCloture) && (<>En attente de validation veuillez ne pas fermer cette fenetre...</>)
           } 
           {showReceptionNumber && (<>Demande Validée!</>)}
           {demandeCloture && (<>Demande Clôturée fermer ce modal pour créer une autre!</>)}
           </ModalHeader>
          <ModalCloseButton color={'white'} className="float-right" />
          <ModalBody bgColor={'black'} textColor={'#A0AEC0'}>
          {demandeCloture && (<b>
            <h2>{validationMessage.current}</h2>
          </b>)}
              
          {showReceptionNumber && (<>
          <h2>{validationMessage.current}</h2>
          <br/>
          
          </>)}
          </ModalBody>
      
          <ModalFooter>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
    )
}