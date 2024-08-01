import React from 'react'

const Meetings = ({
    params
}: { params: { id : string } }) => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'> 
        <h1 className='text-3xl font-bold'>
          Meetings
        </h1>

    </section>
  )
}

export default Meetings