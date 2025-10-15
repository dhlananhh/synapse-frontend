'use client';

import React, {
  useEffect,
  useState
} from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  UserPreferences,
  UpdateUserPreferencesPayload
} from '@/types/services/user';
import { userService } from '@/modules/services/user-service';
import { PreferencesForm } from '@/components/features/settings/PreferencesForm';
import { Skeleton } from '@/components/ui/skeleton';
import { savePreferencesToSession, getPreferencesFromSession } from '@/libs/sessionStorageManager';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { user: currentUser } = useAuth();
  const [ preferences, setPreferences ] = useState<UserPreferences | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  useEffect(() => {
    // Chỉ thực hiện khi đã xác định được người dùng
    if (currentUser?.id) {
      const loadPreferences = async () => {
        setIsLoading(true);
        // Ưu tiên đọc từ session storage để load nhanh
        const sessionPrefs = getPreferencesFromSession();
        if (sessionPrefs) {
          setPreferences(sessionPrefs);
          setIsLoading(false); // Hiển thị UI ngay lập tức
        }

        // Dù có dữ liệu từ session, vẫn fetch từ server để đồng bộ hóa
        try {
          const serverPrefs = await userService.getUserPreferences(currentUser.id);
          setPreferences(serverPrefs); // Cập nhật state với dữ liệu mới nhất
          savePreferencesToSession(serverPrefs); // Cập nhật lại session storage
        } catch (error) {
          toast.error("Could not load settings from server.");
          // Nếu không có dữ liệu session và API lỗi, set trạng thái lỗi
          if (!sessionPrefs) setPreferences(null);
        } finally {
          if (isLoading) setIsLoading(false);
        }
      };
      loadPreferences();
    }
  }, [ currentUser?.id, isLoading ]);

  const handleUpdatePreferences = async (data: UpdateUserPreferencesPayload) => {
    if (!currentUser?.id)
      return;
    setIsSubmitting(true);
    try {
      const updatedPrefs = await userService.updateUserPreferences(currentUser.id, data);
      setPreferences(updatedPrefs);
      savePreferencesToSession(updatedPrefs); // Lưu vào session sau khi thành công
      toast.success("Preferences updated successfully!");
    } catch (error) {
      toast.error("Failed to save preferences.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-8 max-w-2xl"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-12 w-full" /></div>
      );
    }

    if (!preferences) {
      return <div>Could not load your preferences. Please try refreshing the page.</div>;
    }

    return (
      <PreferencesForm
        initialData={ preferences }
        onSave={ handleUpdatePreferences }
        isSubmitting={ isSubmitting }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Preferences</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings.</p>
      </div>
      <Separator />
      { renderContent() }
    </div>
  );
}
