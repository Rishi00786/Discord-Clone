"use client"
import { Plus } from 'lucide-react'
import React from 'react'
import { ActionTooltip } from '../ActionTooltip'
import { useModal } from '@/hooks/useModalStore'

const Navigation_Action = () => {

    const {onOpen} = useModal()

    return (
        <div>
            <ActionTooltip side='right' align='center' label='Add a Server'>
                <button onClick={()=>onOpen("createServer")} className='group flex items-center'>
                    <div className='flex mx-3 rounded-[24px] w-[48px] h-[48px] items-center justify-center group-hover:rounded-[16px] transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
                        <Plus className=' group-hover:text-white transition text-emerald-500 size={25}' />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}

export default Navigation_Action
