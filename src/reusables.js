import React from 'react';
import styled from 'styled-components';


export const Input = styled.input`
    padding: 1%;
    height: 10%;
    width: 75%;
    color: #a51e72;
    background: #EFEFEF;
    border: none;
    border-radius: 3px;
    margin-bottom: 2%;
    font-size: 40px;
    text-align: center;
    outline-color: #a51e72;
    outline-width: thick;
`

export const Button = styled.button`
    height: 10%;
    width: 30%;
    border: none;
    border-bottom: 5px solid #e683af;
    border-radius: 9px;
    background-color: #a51e72;
    color: white;
    font-size: 40px;
`

export const UploaderDiv = styled.div`
    width: 100%;
    height: 450px;
    position: absolute;
    margin-top: 110px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background-color: rgba(55, 23, 88, 0.9);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow: 0px 2px 3px 3px black;

`
