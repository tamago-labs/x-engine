
import dynamic from 'next/dynamic'
import Files from "@/components/Add/Files" 
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '@/hooks/useAuth'
import SubNavbar from '@/layouts/SubNavbar'
import MarkdownDisplay from '../Markdown'


const Add = () => {

  const { getContext, session } = useContext(AuthContext)


  const [select, setSelect] = useState()
  const [context, setContext] = useState([])

  useEffect(() => {
    session && getContext(session).then(setContext)
  }, [session])


  return (
    <div className=" grid grid-cols-10  ">
      <div className="col-span-2 bg-neutral-900 min-h-screen   pt-[29px]  border-r border-neutral-600 ">
        <Files 
          setSelect={setSelect}
          selected={select}
        />
      </div>
      <div className={`col-span-6 bg-neutral-900 pt-[29px] border-r border-neutral-600`}>
        <MarkdownDisplay
          content={select}
          close={() => setSelect()}
          setSelect={setSelect}
        />
      </div>
      <div className={`col-span-2 bg-neutral-900 pt-[29px]  `}>
        <SubNavbar
          title="Context"
          select={select}
          setSelect={setSelect}
          list={context}
          isContext={true}
        />
      </div>
    </div>
  )
}

export default Add