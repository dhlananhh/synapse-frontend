import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Settings, CirclePlus, MoreHorizontal } from 'lucide-react'

interface Community {
  id: string
  name: string
  avatarUrl: string
}

interface CommunitySectionProps {
  title: string
  communities: Community[]
  showManageOptions?: boolean // Flag to include "Manage Communities" and "Create Community"
  showMoreOption?: boolean // Flag to include "Show More" option
}

export default function CommunitySection({
  title,
  communities,
  showManageOptions = false, // Default to false
  showMoreOption = false, // Default to false
}: CommunitySectionProps) {
  return (
    <>
      {' '}
      <Accordion type='single' collapsible defaultValue={title}>
        <AccordionItem value={title}>
          <AccordionTrigger>{title.toUpperCase()}</AccordionTrigger>
          <AccordionContent>
            <ul className='space-y-3'>
              {/* Include "Manage Communities" and "Create Community" if the flag is true */}
              {showManageOptions && (
                <>
                  <li>
                    <a
                      href='/me/communities'
                      className='flex items-center gap-4 hover:text-primary'
                    >
                      <Settings className='h-6 w-6' />
                      <span className='text-sm font-medium italic'>Manage Communities</span>
                    </a>
                  </li>
                  <li>
                    <a href='/c/create' className='flex items-center gap-4 hover:text-primary mb-6'>
                      <CirclePlus className='h-6 w-6' />
                      <span className='text-sm font-medium italic'>Create Community</span>
                    </a>
                  </li>
                </>
              )}
              {communities.map((community) => (
                <li key={community.id}>
                  <a
                    href={`/c/${community.name}`}
                    className='flex items-center gap-2 hover:text-primary'
                  >
                    <Avatar className='w-8 h-8 border border-gray-400'>
                      <AvatarImage src={community.avatarUrl} alt={community.name} />
                      <AvatarFallback>{community.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className='text-sm font-medium'>c/{community.name}</span>
                  </a>
                </li>
              ))}
              {/* Include "Show More" option if the flag is true */}
              {showMoreOption && (
                <li>
                  <a
                    href='/communities/show-more' // Replace with the actual route later
                    className='flex items-center gap-4 hover:text-primary'
                  >
                    <MoreHorizontal className='h-6 w-6' />
                    <span className='text-sm font-medium italic'>Show More</span>
                  </a>
                </li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <hr />
    </>
  )
}
