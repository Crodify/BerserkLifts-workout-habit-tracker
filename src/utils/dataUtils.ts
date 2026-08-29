import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

const STORAGE_KEY = 'arise-storage-v2';

export interface BackupData {
  version: string;
  exportedAt: string;
  appName: string;
  data: any;
}

/**
 * Export all app data as a JSON file and share it
 */
export async function exportData(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('No data to export');

    const parsed = JSON.parse(raw);
    const backup: BackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'BerserkLifts',
      data: parsed.state || parsed,
    };

    const jsonStr = JSON.stringify(backup, null, 2);
    const fileName = `berserklifts-backup-${new Date().toISOString().split('T')[0]}.json`;
    const fileUri = Paths.document + '/' + fileName;

    const file = new File(fileUri);
    file.write(jsonStr as string);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export BerserkLifts Data',
        UTI: 'public.json',
      });
    }

    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

/**
 * Import data from a JSON backup file
 */
export async function importData(): Promise<{ success: boolean; message: string }> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.[0]) {
      return { success: false, message: 'Import cancelled' };
    }

    const fileUri = result.assets[0].uri;
    const file = new File(fileUri);
    const content = await file.text();

    const backup: BackupData = JSON.parse(content);

    // Validate backup format
    if (!backup.appName || !backup.data) {
      return { success: false, message: 'Invalid backup file format' };
    }

    if (backup.appName !== 'BerserkLifts') {
      return { success: false, message: 'This is not a BerserkLifts backup file' };
    }

    // Restore data to AsyncStorage
    const storageData = {
      state: backup.data,
      version: 0,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));

    return {
      success: true,
      message: `Data restored from ${new Date(backup.exportedAt).toLocaleDateString()}`,
    };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, message: 'Failed to import data. File may be corrupted.' };
  }
}

/**
 * Clear all app data (factory reset)
 */
export async function clearAllData(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Clear failed:', error);
    return false;
  }
}

/**
 * Get backup info (last export date, data size)
 */
export async function getBackupInfo(): Promise<{ hasData: boolean; size: string }> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { hasData: false, size: '0 KB' };

    const bytes = new TextEncoder().encode(raw).length;
    const kb = (bytes / 1024).toFixed(1);
    const mb = (bytes / (1024 * 1024)).toFixed(1);

    return {
      hasData: true,
      size: bytes > 1024 * 1024 ? `${mb} MB` : `${kb} KB`,
    };
  } catch {
    return { hasData: false, size: '0 KB' };
  }
}
