'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MyCommunity } from '@/types/services/community';
import { communityService } from '@/modules/services/community-service';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, LogOut, Check, Settings } from 'lucide-react';

interface MyCommunityRowProps {
  community: MyCommunity;
  onLeave: (communityId: string) => void;
}

export function MyCommunityRow({ community, onLeave }: MyCommunityRowProps) {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isJoined, setIsJoined ] = useState(true);

  const handleLeave = async (e: React.MouseEvent) => {
    // Không cần preventDefault nữa vì nút này nằm ngoài Link
    setIsLoading(true);
    try {
      await communityService.leaveCommunity(community.communityId);
      toast.success(`You have left r/${community.name}.`);
      setIsJoined(false);
      onLeave(community.communityId);
    } catch (error: any) {
      toast.error("Failed to leave community.", { description: error.response?.data?.message });
    } finally {
      setIsLoading(false);
    }
  }

  const isOwner = community.role === 'OWNER';
  const isModerator = community.role === 'MODERATOR';

  return (
    <div className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between p-4">

        <Link
          href={ `/c/${community.name}` }
          className="flex items-center gap-4 flex-1 overflow-hidden group"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={ community.avatarUrl ?? '' } />
            <AvatarFallback>{ community.name.charAt(0).toUpperCase() }</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate group-hover:underline">
                c/{ community.name }
              </h3>
              {
                isOwner && (
                  <Badge variant="destructive">
                    Owner
                  </Badge>
                )
              }
              {
                isModerator && (
                  <Badge variant="secondary">
                    Moderator
                  </Badge>
                )
              }
            </div>
            <p className="text-sm text-muted-foreground truncate">{ community.description }</p>
          </div>
        </Link>

        {/* Phần hành động, nằm tách biệt */ }
        <div className="flex items-center gap-2 pl-4">
          { (isOwner || isModerator) && (
            <Button variant="outline" size="sm" asChild>
              <Link href={ `/c/${community.name}/manage` }>
                <Settings className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Manage</span>
              </Link>
            </Button>
          ) }

          { isJoined ? (
            <Button
              variant="secondary"
              onClick={ handleLeave }
              disabled={ isLoading || isOwner }
              title={ isOwner ? "Owner cannot leave their community" : "Leave community" }
            >
              <Check className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Joined</span>
            </Button>
          ) : (
            <Button variant="default" disabled>
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Left</span>
            </Button>
          ) }
        </div>
      </div>
    </div>
  );
}
