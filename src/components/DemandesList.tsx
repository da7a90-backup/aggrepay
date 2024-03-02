'use client'

import { Demande } from "@/app/models/demande"
import { Button, CircularProgress } from "@chakra-ui/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import  *  as  Realm  from  "realm-web";
const  app = new  Realm.App({ id:  "data-qqmmq"});

type DemandesListProps = {
    loaded: boolean
    setLoaded:  Dispatch<SetStateAction<boolean>>
}

export function DemandesList({loaded, setLoaded}:DemandesListProps) {
    const [list, setList] = useState<Demande[]>()
    const [counter, setCounter] = useState<number>(0)

    useEffect(()=>{
        const  login = async () => {

  
            // Authenticate anonymously
            const  user = await  app.logIn(Realm.Credentials.anonymous());
                        
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
  
            const changeStream = demandes.watch()
  
            
            // Everytime a change happens in the stream, add it to the list of events
            for  await (const change  of  changeStream) {
  
                if(change.operationType == "insert" || change.operationType == "update") {
                      const { documentKey, fullDocument } = change;
                      console.log(`new document with _id: ${documentKey}`, fullDocument);
  
                     setLoaded(false)
                }
                }
            }
            login();
    },[])
  

    useEffect(()=>{
        fetch('/api/demandes/liste').then((res)=>{
            res.json().then((demandes: Demande[])=>{
                setList(demandes)
                setLoaded(true)
            })
        })
    },[loaded])

    const returnStatut = (statut: number)=>{
        switch(statut){
            case 0: 
            return <div className="text-orange-900"> en attente </div>
            case 1:
            return <div className="text-emerald-900"> validée </div>
        }
    }

    const valider = (id: string | undefined)=>{
         fetch('/api/demandes/validation?id='+id,{method:'POST', body:JSON.stringify({statut:1})}).then((res)=>{
            res.json().then((json)=>{
                console.log(json)
            })
         })
    }

    const cloturer = (id: string | undefined)=>{
        fetch('/api/demandes/validation?id='+id,{method:'POST', body:JSON.stringify({statut:2})}).then((res)=>{
           res.json().then((json)=>{
               console.log(json)
           })
        })
   }

    return (
        <ul>
        {loaded ? list?.map(
            (demande: Demande)=><li key={demande.nom_emetteur} className="py-8 hover:text-white">
                <b>{returnStatut(demande.statut)} </b>{demande.nom_emetteur}: ({demande.service_emetteur}){demande.numero_emetteur} {"=>"} {demande.nom_destinataire}: ({demande.service_destinataire}){demande.numero_destinataire}, Montant: {demande.montant}
                <div className="px-5"> {demande.statut === 0 ? <><Button onClick={()=>valider(demande._id)} colorScheme={"green"}>Valider</Button> <Button onClick={()=>cloturer(demande._id)} colorScheme={"red"}>Rejeter</Button> </> : demande.statut === 1 ? <Button onClick={()=>cloturer(demande._id)} colorScheme={"blue"}>Confirmer</Button> : <>Archive</> } </div>
                 </li>
                ) : <CircularProgress isIndeterminate color="blue.400" />}
        </ul>
    )
}