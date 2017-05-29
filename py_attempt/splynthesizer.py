# -*- coding: utf-8 -*-
"""
Used to generate wav files which can be put into a sampler and used as synths.
Last edit: 2017 May 28
"""

import wave
import struct
from random import randint
from math import floor
from math import sin
from math import pi

'''
SYNTH FILE PARAMS
'''
duration_sec  = 3
root_pitch_hz = 440 # use a whole number for now

'''
CREATE A NEW WAV FILE
'''
# basic params
print('Name of the sample (exclude file extensions):')
name = input()
write_wav = wave.open('D:/GIT/splynthesizer/py_attempt/output/'+name+'.wav', 'w')
nchannels = 2
sampwidth = 2
framerate = 44100
comptype  = 'NONE'
compname  = 'not compressed'

# duration is cropped to fit exactly a whole number of periods
len_period = floor(framerate/root_pitch_hz)
num_period = floor(duration_sec*framerate/len_period)
nframes    = len_period*num_period

params = (nchannels, sampwidth, framerate, nframes, comptype, compname)
write_wav.setparams(params)

'''
OTHER USEFUL VARIABLES
'''
int_value_range = 2**(8*sampwidth)
# NOTE: for sampwidth == 2, each frame (per channel) is an unsigned short in little endian ('<H'),
# which has a range of 0 to 65,535.

'''
MOD GLOBALS
'''
phase_offset_frames = 0 #len_period/2


'''
FUNCTIONS
'''
# converts a value from -1 (lowest amplitude) to 1 (highest amplitude) to the corresponding short value 
def convert(value):
    if value >= 0:
        return (value/2)*(int_value_range-1)
    else:
        return ((value/2)+1)*(int_value_range)

# LEFT EAR and RIGHT EAR functions, currently only used to phase RIGHT EAR
def left_ear(frame_number):
    return frame_number  
def right_ear(frame_number):
    return frame_number+phase_offset_frames

# Pidgeon holes values to sample domain and deals with values that overflow sample range    
def clean_sample(raw_value):
    return(int(floor(raw_value)) % int_value_range)    
 
# RAMP: generate one cycle   
def ramp_p():
    byte_stream_period = b''
    for i in range(0,len_period):
        # LEFT EAR writes before RIGHT EAR, interleaved
        byte_stream_period += struct.pack('<H', clean_sample(left_ear(i) *int_value_range/len_period))
        byte_stream_period += struct.pack('<H', clean_sample(right_ear(i)*int_value_range/len_period))
    return byte_stream_period
    
# SINE: generate one cycle
def sine_p():
    byte_stream_period = b''
    for i in range(0,len_period):
        # LEFT EAR writes before RIGHT EAR, interleaved
        EAR_L = sin(2*pi*  left_ear(i)/len_period)
        EAR_R = sin(2*pi* right_ear(i)/len_period)
        EAR_L = convert(EAR_L)
        EAR_R = convert(EAR_R)
        byte_stream_period += struct.pack('<H', clean_sample(EAR_L))
        byte_stream_period += struct.pack('<H', clean_sample(EAR_R))
    return byte_stream_period
    
# TRIANGLE: generate one cycle
def triangle_p():
    byte_stream_period = b''
    for i in range(0,len_period):
        # LEFT EAR writes before RIGHT EAR, interleaved
        EAR_L = (left_ear(i) %len_period)/(len_period-1)*4
        EAR_R = (right_ear(i)%len_period)/(len_period-1)*4
        
        # TODO: clean this up
        if EAR_L > 3:
            EAR_L = (EAR_L-3)-1
        elif EAR_L > 2:
            EAR_L = -(EAR_L-2)
        elif EAR_L > 1:
            EAR_L = 1-(EAR_L-1)
            
        if EAR_R > 3:
            EAR_R = (EAR_R-3)-1
        elif EAR_R > 2:
            EAR_R = -(EAR_R-2)
        elif EAR_R > 1:
            EAR_R = 1-(EAR_R-1)
        
        EAR_L = convert(EAR_L)
        EAR_R = convert(EAR_R)
        byte_stream_period += struct.pack('<H', clean_sample(EAR_L))
        byte_stream_period += struct.pack('<H', clean_sample(EAR_R))
    return byte_stream_period

# SQUARE: generate one cycle   
def square_p():
    byte_stream_period = b''
    for i in range(0,len_period):
        if left_ear(i)%len_period < (len_period/2)-1:
            byte_stream_period += struct.pack('<H', clean_sample(convert(1)))
        else:
            byte_stream_period += struct.pack('<H', clean_sample(convert(-1)))
            
        if right_ear(i)%len_period < (len_period/2)-1:
            byte_stream_period += struct.pack('<H', clean_sample(convert(1)))
        else:
            byte_stream_period += struct.pack('<H', clean_sample(convert(-1)))
    return byte_stream_period
            
# reads input and determines what type of waveform to get
def get_period(synth_mode):
    if synth_mode == 0:
        return sine_p()
    elif synth_mode == 1:
        return triangle_p()
    elif synth_mode == 2:
        return square_p()
    elif synth_mode == 3:
        return ramp_p()



'''
MAIN
'''
byte_stream = b''
for i in range(1,num_period):
    phase_offset_frames = 0
    byte_stream += get_period(randint(0,1))
    
write_wav.writeframes(byte_stream)
write_wav.close()