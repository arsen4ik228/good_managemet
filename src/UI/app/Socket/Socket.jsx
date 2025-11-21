import React from 'react';
import {
    useSocket,
} from '@hooks';


export default function SocketComponent() {

    const response = useSocket('convertCreationEvent', (data) => {
        //('Data received:', data);
    });

    return (
        <div>
            <h1>Socket Component</h1>
            <p>Response: {JSON.stringify(response)}</p>
        </div>
    );
}