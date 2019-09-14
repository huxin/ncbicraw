
# SDP Encryptor

## Overview
This is an simple cipher tool that encrypt any strings using [Caesar Cipher](https://en.wikipedia.org/wiki/Caesar_cipher). It allows user to specify key number and increment numbers to encrypt input message. 

## How to use
### Input
The application takes 3 input:

1. *Message*: The message to encrypt. It should be a non-empty string and must contain at least one letter.

2. *Key Number*: number of basic shifts. It should be an integer >= 1 and < 26.


3. *Increment number* the number of increments for each subsequent letter. It should be an integer >= 1 and < 26.

### Output
The output is the cipher text, resulting from using the specified key letter and skip number to encrypt the input string using following encryption algorithm

1. The first letter in the message (a-z, A-Z) will be shifted by the number of characters specified by the Key Number. 

2. Each following letter in the message will be shifted by a new key number, provided by adding the Increment Number and preceding key number. 

3. All non-alphabetic characters remain unchanged..  Capitalization from the original message is preserved.  


### Example
“Cat & Dog” shifted according to the Key Number 3 and Increment Number 2 would be “Ffa & Mzt” (C+3, a+5, t+7, ‘ ‘, &, ‘ ‘, D+9, o+11, g+13).

"Up with the White And Gold!" shifted according to Key Number 1 and Increment Number 1 would be "Vr zmyn apn Gsugs Pdu Yhfy!"
