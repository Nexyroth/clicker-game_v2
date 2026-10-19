import { GameState } from '../types/game';

export interface DriveFileInfo {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
}

const SAVE_FILENAME = 'nexyroth_clicker_save.json';

/**
 * Searches for existing Nexyroth Clicker save files in the user's Google Drive
 */
export async function listSaveFiles(accessToken: string): Promise<DriveFileInfo[]> {
  const query = encodeURIComponent(`name = '${SAVE_FILENAME}' and trashed = false`);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,size)&orderBy=modifiedTime desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to list Google Drive files: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return (data.files || []) as DriveFileInfo[];
}

/**
 * Uploads current game state to Google Drive.
 * If file already exists, updates it. Otherwise creates new.
 */
export async function saveGameToDrive(
  accessToken: string,
  state: GameState
): Promise<{ id: string; modifiedTime: string }> {
  const existingFiles = await listSaveFiles(accessToken);
  const saveJson = JSON.stringify(state, null, 2);

  if (existingFiles.length > 0) {
    // Update existing file content
    const fileId = existingFiles[0].id;
    const updateRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: saveJson,
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.text();
      throw new Error(`Failed to update save file in Drive: ${err}`);
    }

    const updatedData = await updateRes.json();
    return {
      id: updatedData.id,
      modifiedTime: new Date().toISOString(),
    };
  } else {
    // Create new file using multipart upload
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: SAVE_FILENAME,
      mimeType: 'application/json',
      description: 'Nexyroth Clicker Cloud Save File',
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      saveJson +
      closeDelimiter;

    const createRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Failed to create save file in Drive: ${err}`);
    }

    const createdData = await createRes.json();
    return {
      id: createdData.id,
      modifiedTime: new Date().toISOString(),
    };
  }
}

/**
 * Downloads game save state from Google Drive
 */
export async function loadGameFromDrive(
  accessToken: string,
  fileId: string
): Promise<GameState> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to load save from Drive: ${err}`);
  }

  const data = await response.json();
  return data as GameState;
}

/**
 * Deletes save file from Google Drive (after explicit user confirmation)
 */
export async function deleteSaveFromDrive(
  accessToken: string,
  fileId: string
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to delete save from Drive: ${err}`);
  }
}
