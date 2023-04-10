import { Button, Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Spacer, Text, Select, useToast, useColorModeValue } from '@chakra-ui/react'

import React, { useEffect, useState, useRef } from 'react'
import streams from './streams.json'

function Body() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
    
    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    const redColor = useColorModeValue('#E53E3E', '#feb2b2');
    const greenColor = useColorModeValue('#38A169', '#9ae6b4');

    const [stream, setStream] = useState();
    const [streamVolume, setStreamVolume] = useState(0.5);
    const [nowPlaying, setNowPlaying] = useState('Nothing!');
    const [nowPlayingSrc, setNowPlayingSrc] = useState();
    const [lofiVolume, setLofiVolume] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [buttonText, setButtonText] = useState('Start Mix');
    const [buttonColor, setButtonColor] = useState(greenColor);
    const [initialActivation, setInitialActivation] = useState(false);

    const toast = useToast();

    const audioRef = useRef([]);
    const musicContext = require.context('../../public/assets/music', true);

    useEffect(() => {
        if (!initialActivation) return;
        audioRef.current[0].volume = streamVolume;
    }, [streamVolume, initialActivation]);

    useEffect(() => {
        if (!initialActivation) return;
        audioRef.current[1].volume = lofiVolume;
    }, [lofiVolume, initialActivation]);

    useEffect(() => {
        if (!initialActivation) return;
        audioRef.current[0].src = stream;
        audioRef.current[0].load();
        audioRef.current[0].play(); // Play forces the audio to start the new source stream
    }, [stream, initialActivation]);

    useEffect(() => {
        let button = document.getElementById('btn');
        button.textContent = buttonText;
    }, [buttonText]);

    useEffect(() => {
        let button = document.getElementById('btn');
        button.style.backgroundColor = buttonColor;
    }, [buttonColor]);

    useEffect(() => {
        let musicContent = document.getElementById('music-name');
        musicContent.textContent = nowPlaying;
    }, [nowPlaying]);

    useEffect(() => {
        if (audioRef && audioRef.current[1]) {
            audioRef.current[1].src = nowPlayingSrc;
            audioRef.current[1].load();
            audioRef.current[1].play();
        }
    }, [nowPlayingSrc]);

    function changeStream() {
        let select = document.getElementById('stream-select');
        let stream = select.options[select.selectedIndex].value;

        setStream(stream);
    }

    function changeMusic() {
        let assetPaths = musicContext.keys();
        let found = false;

        while (!found) {
            let randomIndex = Math.floor(Math.random() * assetPaths.length);
            let assetPath = assetPaths[randomIndex].substring(2);

            if (nowPlayingSrc && nowPlayingSrc.includes(assetPath)) {
                continue;
            }

            let publicURL = (process.env.PUBLIC_URL === '') ? 'http://localhost:3000' : `${process.env.PUBLIC_URL}`;

            setNowPlaying(assetPath.slice(0, -4));
            setNowPlayingSrc(`${publicURL}/assets/music/${encodeURIComponent(assetPath)}`);
            found = true;
        }
    }

    function startMix() {
        if (isPlaying) {
            audioRef.current[0].pause(); 
            audioRef.current[1].pause();

            setIsPlaying(false);
            setButtonText('Start Mix');
            setButtonColor(greenColor);
        } else {
            if (!stream) {
                return toast({
                    title: 'No stream selected',
                    description: 'Please select a stream from the dropdown menu',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            
            if (!initialActivation) {
                let feed = new Audio(stream);
                feed.volume = streamVolume;
                feed.load();
                audioRef.current.push(feed);
                
                changeMusic();
                let music = new Audio();
                music.src = nowPlayingSrc;
                music.volume = lofiVolume;
                music.load();
                audioRef.current.push(music);

                audioRef.current[1].addEventListener('ended', () => {
                    changeMusic();
                    audioRef.current[1].src = nowPlayingSrc;
                    audioRef.current[1].load();
                    audioRef.current[1].play();
                });

                setInitialActivation(true);
            }

            audioRef.current[0].load(); // Loading is necessary to take the audio back to the currently live content, failure to do this results in resuming of audio from wherever it was paused
            audioRef.current[0].play().catch(() => {});
            audioRef.current[1].play().catch(() => {});
            setIsPlaying(true);
            setButtonText('Stop Mix');
            setButtonColor(redColor);
        }
    }

    return (
        <Box mt={'15%'}>
            <Button id="btn" onClick={startMix} colorScheme={buttonColor} width={'100%'}>{buttonText}</Button>
            <Spacer mb={'15%'}/>
            <Text>ATC Stream</Text>
            <Select id="stream-select" placeholder='Choose a stream...' defaultValue={stream} onChange={() => changeStream()} variant={'filled'} mb={'15%'}>
                {Object.keys(streams).map((key) => {
                    return (
                        <option key={key} value={`${streams[key].stream}${formattedDate}`}>{streams[key].name}</option>
                    )
                })}
            </Select>
            <Text>Stream Volume</Text>
            <Slider aria-label='stream-vol' defaultValue={streamVolume} min={0} max={1} step={0.05} onChange={(v) => setStreamVolume(v)} mb={'15%'}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>

            <Text>Music Volume</Text>
            <Slider aria-label='music-vol' defaultValue={lofiVolume} min={0} max={1} step={0.05} onChange={(v) => setLofiVolume(v)}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
            <Spacer mb={'15%'}/>
            <Text><b>Now Playing: </b><span id="music-name">{nowPlaying}</span></Text>
        </Box>
    )
}

export default Body