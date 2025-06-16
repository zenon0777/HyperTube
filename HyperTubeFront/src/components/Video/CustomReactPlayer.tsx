'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';

interface Track {
  kind: string;
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
}

interface CustomReactPlayerProps {
  streamUrl: string;
  tracks: Track[];
  movieId: string;
}

const CustomReactPlayer: React.FC<CustomReactPlayerProps> = ({ streamUrl, tracks, movieId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const locale = useLocale();
  const [isClient, setIsClient] = useState(false);
  const [loadingSubtitles, setLoadingSubtitles] = useState(true);
  const [selectedSubtitleLang, setSelectedSubtitleLang] = useState<string | null>(null);
  const lastAppliedLang = useRef<string | null>(null);
  
  const sessionStorageKey = `subtitle_pref_${movieId}`;
  
  const getSessionSubtitlePref = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(sessionStorageKey);
    }
    return null;
  };
  
  const getUserPreferredLanguage = (): string => {
    if (locale && (locale === 'en' || locale === 'fr')) {
      // console.log(`[CustomReactPlayer] Using locale from useLocale(): ${locale}`);
      return locale;
    }
    
    if (typeof window !== 'undefined') {
      const nextLocale = localStorage.getItem('NEXT_LOCALE');
      if (nextLocale && (nextLocale === 'en' || nextLocale === 'fr')) {
        // console.log(`[CustomReactPlayer] Using locale from localStorage: ${nextLocale}`);
        return nextLocale;
      }
      
      const cookies = document.cookie.split(';');
      const localeCookie = cookies.find(cookie => cookie.trim().startsWith('NEXT_LOCALE='));
      if (localeCookie) {
        const cookieLocale = localeCookie.split('=')[1];
        if (cookieLocale === 'en' || cookieLocale === 'fr') {
          // console.log(`[CustomReactPlayer] Using locale from cookie: ${cookieLocale}`);
          return cookieLocale;
        }
      }
    }
    // console.log(`[CustomReactPlayer] Falling back to default locale: en`);
    return 'en';
  };
  
  const setSessionSubtitlePref = (lang: string | null) => {
    if (typeof window !== 'undefined') {
      if (lang === null) {
        sessionStorage.setItem(sessionStorageKey, 'null');
      } else {
        sessionStorage.setItem(sessionStorageKey, lang);
      }
    }
  };

  const forceSubtitleApplication = (targetLang: string) => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const textTracks = video.textTracks;
    
    for (let i = 0; i < textTracks.length; i++) {
      if (textTracks[i].mode !== 'disabled') {
        textTracks[i].mode = 'disabled';
      }
    }
    
    for (let i = 0; i < textTracks.length; i++) {
      const track = textTracks[i];
      if (track.kind === 'subtitles' && track.language === targetLang) {
        track.mode = 'showing';
        lastAppliedLang.current = targetLang;
        return true;
      }
    }
    
    return false;
  };

  useEffect(() => {
    if (isClient) {
      const savedLang = getSessionSubtitlePref();
      if (savedLang && savedLang !== 'null') {
        setSelectedSubtitleLang(savedLang);
      }
    }
  }, [isClient, movieId]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (tracks.length > 0) {
      setLoadingSubtitles(false);
    }
  }, [tracks]);

  useEffect(() => {
    if (videoRef.current && isClient && !loadingSubtitles) {
      const video = videoRef.current;
      
      const enableSubtitles = () => {
        const textTracks = video.textTracks;
        
        const currentLang = selectedSubtitleLang || getSessionSubtitlePref();
        
        if (currentLang === 'null' || currentLang === null) {
          for (let i = 0; i < textTracks.length; i++) {
            textTracks[i].mode = 'disabled';
          }
          return;
        }
        
        if (currentLang && currentLang !== 'null') {
          const applied = forceSubtitleApplication(currentLang);
          if (applied) {
            if (selectedSubtitleLang !== currentLang) {
              setSelectedSubtitleLang(currentLang);
            }
            return;
          }
          
          const isInitialLoad = !selectedSubtitleLang;
          if (!isInitialLoad) {
            console.warn(`Preferred subtitle language ${currentLang} not available for movie ${movieId}, maintaining current state`);
            return;
          }
        }
        
        if (!selectedSubtitleLang) {
          const preferredLang = getUserPreferredLanguage();
          // console.log(`[CustomReactPlayer] No subtitle selected, trying to auto-select. Preferred language: ${preferredLang}`);
          // console.log(`[CustomReactPlayer] Available tracks:`, tracks.map(t => ({ lang: t.srcLang, label: t.label, default: t.default })));
          
          for (let i = 0; i < textTracks.length; i++) {
            const track = textTracks[i];
            
            if (track.kind === 'subtitles' && 
                (tracks[i]?.default || track.language === preferredLang || i === 0)) {
              // console.log(`[CustomReactPlayer] Auto-selecting track: ${track.language} (reason: ${tracks[i]?.default ? 'default' : track.language === preferredLang ? 'preferred language' : 'first available'})`);
              track.mode = 'showing';
              setSelectedSubtitleLang(track.language);
              setSessionSubtitlePref(track.language);
              lastAppliedLang.current = track.language;
              break;
            }
          }
        }
      };

      const trackChangeHandler = () => {
        const currentLang = selectedSubtitleLang || getSessionSubtitlePref();
        
        if (currentLang && currentLang !== 'null' && currentLang !== lastAppliedLang.current) {
          setTimeout(() => {
            forceSubtitleApplication(currentLang);
          }, 100);
        }
      };

      video.addEventListener('loadedmetadata', enableSubtitles);
      video.addEventListener('canplay', enableSubtitles);
      video.addEventListener('loadeddata', enableSubtitles);
      video.addEventListener('seeked', enableSubtitles);
      video.addEventListener('play', enableSubtitles);
      
      for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].addEventListener('cuechange', trackChangeHandler);
      }
      
      const nativeTrackChangeHandler = () => {
        const textTracks = video.textTracks;
        let activeTrack = null;
        
        for (let i = 0; i < textTracks.length; i++) {
          if (textTracks[i].mode === 'showing') {
            activeTrack = textTracks[i];
            break;
          }
        }
        
        if (activeTrack) {
          const newLang = activeTrack.language;
          if (newLang !== selectedSubtitleLang) {
            setSelectedSubtitleLang(newLang);
            setSessionSubtitlePref(newLang);
            lastAppliedLang.current = newLang;
          }
        } else {
          if (selectedSubtitleLang !== null) {
            setSelectedSubtitleLang(null);
            setSessionSubtitlePref(null);
            lastAppliedLang.current = null;
          }
        }
      };
      
      video.textTracks.addEventListener('change', nativeTrackChangeHandler);
      
      const intervalId = setInterval(() => {
        if (!video.paused) {
          trackChangeHandler();
        }
      }, 2000);
      
      setTimeout(enableSubtitles, 1000);

      return () => {
        video.removeEventListener('loadedmetadata', enableSubtitles);
        video.removeEventListener('canplay', enableSubtitles);
        video.removeEventListener('loadeddata', enableSubtitles);
        video.removeEventListener('seeked', enableSubtitles);
        video.removeEventListener('play', enableSubtitles);
        
        for (let i = 0; i < video.textTracks.length; i++) {
          video.textTracks[i].removeEventListener('cuechange', trackChangeHandler);
        }
        
        video.textTracks.removeEventListener('change', nativeTrackChangeHandler);
        
        clearInterval(intervalId);
      };
    }
  }, [isClient, loadingSubtitles, tracks, selectedSubtitleLang]);



  if (!isClient) {
    return null;
  }

  return (
    <div className="relative w-full max-w-4xl h-auto">
      {loadingSubtitles && (
        <div className="text-white text-center mb-4">
          <p>Loading subtitles...</p>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        crossOrigin="anonymous"
        className="w-full h-auto"
        style={{ maxHeight: '80vh' }}
        onError={(e) => console.log('Video Error:', e)}
        onLoadedData={() => console.log('Video loaded data')}
        onLoadStart={() => console.log('Video load started')}
        onWaiting={() => console.log('Video waiting for data')}
        onCanPlay={() => console.log('Video can play')}
      >
        <source src={streamUrl} type="video/mp4" />
        {tracks.map((track, index) => (
          <track
            key={`${track.srcLang}-${track.label}-${index}`}
            kind={track.kind as any}
            src={track.src}
            srcLang={track.srcLang}
            label={track.label}
            default={track.default}
            onLoad={() => console.log(`Subtitle track loaded: ${track.label}`)}
            onError={(e) => console.error(`Failed to load subtitle track: ${track.label}`, e)}
          />
        ))}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default CustomReactPlayer;
