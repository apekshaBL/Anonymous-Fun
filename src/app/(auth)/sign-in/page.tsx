'use client';
import { useSession,signIn,signOut } from 'next-auth/react';
import React from 'react'

export default function Component(){
  const {data:session}=useSession()
  if(session){
    return(
        <>
        signed in as {session.user.email}
        <br />
        <button onClick={()=>signOut()}>Sign Out</button>
        </>
    )
  }
}

