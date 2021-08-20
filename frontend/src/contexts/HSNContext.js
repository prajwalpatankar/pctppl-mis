import React, { createContext, Component } from 'react';

export const HSNContext = createContext();

class HSNContextProvider extends Component {
    state = {
        isAuthenticated: false,
    }
}