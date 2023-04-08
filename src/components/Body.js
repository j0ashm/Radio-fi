import { Button, Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Spacer, Text, Select } from '@chakra-ui/react'

import React, { useEffect, useState, useRef } from 'react'
import lofi1 from '../music/1.mp3'
import lofi2 from '../music/2.mp3'
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

    const [stream, setStream] = useState(`${streams['KORD App (10R/28C)'].stream}${formattedDate}`);
    const [streamVolume, setStreamVolume] = useState(0.5);
    const [lofiVolume, setLofiVolume] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [buttonText, setButtonText] = useState('Start Mix');
    const [buttonColor, setButtonColor] = useState('#9ae6b4');

    const atcRef = useRef(new Audio(stream));
    const lofiRef = useRef(new Audio(lofi1));
    atcRef.current.volume = streamVolume;
    lofiRef.current.volume = lofiVolume;

    useEffect(() => {
        atcRef.current.volume = streamVolume;
    }, [streamVolume]);

    useEffect(() => {
        lofiRef.current.volume = lofiVolume;
    }, [lofiVolume]);

    useEffect(() => {
        atcRef.current.src = stream;
        atcRef.current.load();
    }, [stream]);

    useEffect(() => {
        let button = document.getElementById('btn');
        button.textContent = buttonText;
    }, [buttonText]);

    useEffect(() => {
        let button = document.getElementById('btn');
        button.style.backgroundColor = buttonColor;
    }, [buttonColor]);

    function changeStream() {
        let select = document.getElementById('stream-select');
        let stream = select.options[select.selectedIndex].value;

        setStream(stream);
    }

    function startMix() {
        if (isPlaying) {
            // TODO: investigate why pausing doesn't work
            // atcRef.current.pause(); 
            // lofiRef.current.pause();

            setLofiVolume(0);
            setStreamVolume(0);
            setIsPlaying(false);
            setButtonText('Start Mix');
            setButtonColor('#9ae6b4');
        }

        if (stream === null) return;
        atcRef.current.play();
        lofiRef.current.play();
        setIsPlaying(true);
        setButtonText('Stop Mix');
        setButtonColor('#feb2b2');
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
        </Box>
    )
}

export default Body