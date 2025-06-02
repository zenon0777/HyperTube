import { NextRequest, NextResponse } from 'next/server';
import { openSubtitlesService } from '@/api/subtitles/opensubtitles';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('file_id') || searchParams.get('fileId');

    // console.log(`Subtitle download request for file_id: ${fileId}`);

    if (!fileId) {
      console.error('Missing file_id or fileId parameter in subtitle download request');
      return NextResponse.json({ error: 'Missing file_id parameter' }, { status: 400 });
    }

    const downloadLink = await openSubtitlesService.downloadSubtitle(fileId);
    
    // console.log(`Got download link from OpenSubtitles: ${downloadLink}`);
    
    const subtitleResponse = await axios.get(downloadLink, {
      responseType: 'text',
      headers: {
        'User-Agent': 'HyperTube v1.0',
      },
      timeout: 30000,
    });

    let subtitleContent = subtitleResponse.data;

    // console.log(`Downloaded subtitle content, length: ${subtitleContent.length} characters`);

    if (subtitleContent.includes('-->') && !subtitleContent.startsWith('WEBVTT')) {
      // console.log('Converting SRT to VTT format');
      subtitleContent = convertSrtToVtt(subtitleContent);
    }

    const acceptHeader = request.headers.get('accept');
    if (acceptHeader && acceptHeader.includes('application/json')) {
      return NextResponse.json({
        success: true,
        vttContent: subtitleContent,
        format: 'vtt',
        size: subtitleContent.length
      });
    }

    return new NextResponse(subtitleContent, {
      headers: {
        'Content-Type': 'text/vtt',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error downloading subtitle:', error);
    
    let errorMessage = 'Failed to download subtitle';
    let statusCode = 500;
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      
      if (error.response?.status === 404) {
        errorMessage = 'Subtitle not found';
        statusCode = 404;
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied to subtitle';
        statusCode = 403;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Download timeout';
        statusCode = 408;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: statusCode }
    );
  }
}

function convertSrtToVtt(srtContent: string): string {
  // console.log('Converting SRT to VTT format');
  
  let vttContent = 'WEBVTT\n\n';
  
  vttContent += srtContent
    .replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4')
    .replace(/^\d+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  // console.log(`Converted SRT to VTT, final length: ${vttContent.length} characters`);
  
  return vttContent;
}
