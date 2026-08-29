/**
 * PipDeck Kindle 1-Click Installer Helper
 * Uses modern Browser File System Access API (showDirectoryPicker)
 * to automatically detect the Kindle drive and install pipdeck.koplugin
 * directly into koreader/plugins/ with zero technical knowledge required.
 */
export async function installToKindleDrive(): Promise<{ success: boolean; message: string }> {
  if (!('showDirectoryPicker' in window)) {
    return {
      success: false,
      message: 'Web File System API is not supported in this browser. Please use Chrome, Edge, or Brave.',
    };
  }

  try {
    // 1. Prompt user to select their Kindle drive root (e.g. E:\ or /Volumes/Kindle)
    const dirHandle = await (window as unknown as {
      showDirectoryPicker: (opts: { mode: string }) => Promise<FileSystemDirectoryHandle>;
    }).showDirectoryPicker({ mode: 'readwrite' });

    // 2. Locate or create koreader directory
    let koreaderHandle: FileSystemDirectoryHandle;
    try {
      koreaderHandle = await dirHandle.getDirectoryHandle('koreader', { create: true });
    } catch {
      // Fallback for hidden .koreader on some Linux/Android devices
      koreaderHandle = await dirHandle.getDirectoryHandle('.koreader', { create: true });
    }

    // 3. Locate or create plugins directory
    const pluginsHandle = await koreaderHandle.getDirectoryHandle('plugins', { create: true });

    // 4. Create pipdeck.koplugin directory
    const pipdeckHandle = await pluginsHandle.getDirectoryHandle('pipdeck.koplugin', { create: true });

    // 5. Fetch and write _meta.lua and main.lua
    const metaRes = await fetch('koreader/plugins/pipdeck.koplugin/_meta.lua');
    const metaContent = await metaRes.text();
    const metaFile = await pipdeckHandle.getFileHandle('_meta.lua', { create: true });
    const metaWritable = await (metaFile as unknown as { createWritable: () => Promise<FileSystemWritableFileStream> }).createWritable();
    await metaWritable.write(metaContent);
    await metaWritable.close();

    const mainRes = await fetch('koreader/plugins/pipdeck.koplugin/main.lua');
    const mainContent = await mainRes.text();
    const mainFile = await pipdeckHandle.getFileHandle('main.lua', { create: true });
    const mainWritable = await (mainFile as unknown as { createWritable: () => Promise<FileSystemWritableFileStream> }).createWritable();
    await mainWritable.write(mainContent);
    await mainWritable.close();

    return {
      success: true,
      message: 'PipDeck successfully installed to your Kindle! You can now safely eject your Kindle and open KOReader or ZenOS.',
    };
  } catch (err: unknown) {
    const error = err as Error;
    if (error.name === 'AbortError') {
      return { success: false, message: 'Installation cancelled by user.' };
    }
    return {
      success: false,
      message: `Installation failed: ${error.message || 'Unknown error'}`,
    };
  }
}
