'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/libs/utils'
import { toast } from 'sonner'

interface VoteClientProps {
  itemId: string
  initialVotes: number
}

export default function VoteClient({ itemId, initialVotes }: VoteClientProps) {
  // const { user, getVoteStatus, handleVote } = useAuth();
  let getVoteStatus, user, handleVote

  const [voteCount, setVoteCount] = useState(initialVotes)
  const initialVote = getVoteStatus(itemId)
  const [currentVote, setCurrentVote] = useState(initialVote)

  useEffect(() => {
    setCurrentVote(getVoteStatus(itemId))
  }, [getVoteStatus, itemId])

  const performVote = (newVote: 'UP' | 'DOWN') => {
    if (!user) {
      toast.error('Please log in to vote.')
      return
    }

    const oldVote = currentVote
    let voteChange = 0

    if (oldVote === newVote) {
      setCurrentVote(null)
      voteChange = newVote === 'UP' ? -1 : 1
    } else if (oldVote === 'UP' && newVote === 'DOWN') {
      setCurrentVote('DOWN')
      voteChange = -2
    } else if (oldVote === 'DOWN' && newVote === 'UP') {
      setCurrentVote('UP')
      voteChange = 2
    } else {
      setCurrentVote(newVote)
      voteChange = newVote === 'UP' ? 1 : -1
    }

    setVoteCount((prevCount) => prevCount + voteChange)
    handleVote(itemId, newVote)
  }

  return (
    <div className='flex flex-row items-center gap-1 bg-secondary p-1 rounded-full'>
      <Button
        onClick={() => performVote('UP')}
        variant='ghost'
        size='sm'
        className='rounded-full h-8 w-8 p-1'
      >
        <ArrowBigUp
          className={cn('h-5 w-5', currentVote === 'UP' && 'fill-primary text-primary')}
        />
      </Button>

      <span className='text-sm font-bold w-6 text-center'>{voteCount}</span>

      <Button
        onClick={() => performVote('DOWN')}
        variant='ghost'
        size='sm'
        className='rounded-full h-8 w-8 p-1'
      >
        <ArrowBigDown
          className={cn('h-5 w-5', currentVote === 'DOWN' && 'fill-red-500 text-red-500')}
        />
      </Button>
    </div>
  )
}
