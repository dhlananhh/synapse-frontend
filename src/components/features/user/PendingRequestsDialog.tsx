'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { userService } from '@/modules/services/user-service'
import { PendingFollowRequest } from '@/types/services/user'
import { PendingRequestItem } from './PendingRequestItem'

export function PendingRequestsDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [requests, setRequests] = useState<PendingFollowRequest[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      userService
        .getPendingFollowRequests()
        .then((res) => setRequests(res.requests))
        .catch(() => setRequests([]))
        .finally(() => setLoading(false))
    }
  }, [isOpen])

  const handleAccept = async (requestId: string) => {
    await userService.acceptFollowRequest(requestId)
    setRequests((reqs) => reqs.filter((r) => r.id !== requestId))
  }

  const handleReject = async (requestId: string) => {
    await userService.rejectFollowRequest(requestId)
    setRequests((reqs) => reqs.filter((r) => r.id !== requestId))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Pending Requests</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pending Follow Requests</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>Loading...</div>
        ) : requests.length === 0 ? (
          <div>No pending requests.</div>
        ) : (
          <ul className='space-y-4'>
            {requests.map((req) => (
              <li key={req.id}>
                <PendingRequestItem
                  requester={req.requester}
                  onAccept={() => handleAccept(req.id)}
                  onReject={() => handleReject(req.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
