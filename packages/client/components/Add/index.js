
import Files from "@/components/Add/Files" 
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '@/hooks/useAuth' 
import MarkdownDisplay from '../Markdown'


const Add = () => {

  const { getContext, session } = useContext(AuthContext)

  const [select, setSelect] = useState()
  const [context, setContext] = useState([])



  return (
    <div className=" grid grid-cols-10  ">
      <div className="col-span-2 bg-neutral-900 min-h-screen   pt-[29px]  border-r border-neutral-600 ">
        <Files 
          setSelect={setSelect}
          selected={select}
        />
      </div>
      <div className={`col-span-8 bg-neutral-900 pt-[29px] border-r border-neutral-600`}>
        <MarkdownDisplay
          content={select}
          close={() => setSelect()}
          setSelect={setSelect}
        />
      </div>
    </div>
  )
}

export default Add