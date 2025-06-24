interface Torrent {
  quality?: string;
  [key: string]: unknown;
}

export function is3DTorrent(torrent: Torrent | null | undefined): boolean {
  if (!torrent || !torrent.quality) {
    return false;
  }

  const quality = torrent.quality.toLowerCase();
  
  const threeDIndicators = [
    '3d',
    'sbs',
    'hsbs',
    'tab', 
    'htab',
    'ou',  
    'anaglyph',
    'stereoscopic',
    '3-d',
    '.3d.',
    ' 3d ',
    '[3d]',
    '(3d)',
    'imax.3d',
    'hsou',
  ];

  for (const indicator of threeDIndicators) {
    if (quality.includes(indicator)) {
      // console.log(`🚫 Filtered out 3D torrent: Quality "${torrent.quality}" contains "${indicator}"`);
      return true;
    }
  }

  return false;
}

export function getFirstNon3DTorrent(torrents: Torrent[]): Torrent | null {
  if (!torrents || !Array.isArray(torrents)) {
    return null;
  }

  for (const torrent of torrents) {
    if (!is3DTorrent(torrent)) {
      // console.log(`✅ Selected non-3D torrent: Quality "${torrent.quality}"`);
      return torrent;
    }
  }

  console.warn('⚠️ No non-3D torrents found in the list');
  return null;
}

export function filterOut3DTorrents(torrents: Torrent[]): Torrent[] {
  if (!torrents || !Array.isArray(torrents)) {
    return [];
  }

  const non3DTorrents = torrents.filter(torrent => !is3DTorrent(torrent));
  
  // console.log(`Filtered ${torrents.length - non3DTorrents.length} 3D torrents, ${non3DTorrents.length} non-3D torrents remaining`);
  
  return non3DTorrents;
}
