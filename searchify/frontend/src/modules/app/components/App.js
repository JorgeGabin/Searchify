import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
const theme = createMuiTheme({
    typography: {
      // Use the system font.
      fontFamily:
        '-apple-system,system-ui,BlinkMacSystemFont,' +
        '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    },
    palette: {
        primary: {
            main: '#1db954',
            dark: '#08171f',
            light: '#dbf4ff',
            button: '#7ee9f1'
        },
        secondary: {
            main: '#7ee9f1'
        },
    },
  })
const App = () => {

    return (
        <ThemeProvider theme={theme}>
            <div className="body">
                <Router>
                    <div>
                        <Header/>
                        <Body/>
                    </div>
                </Router>
                <Footer/>
            </div>
        </ThemeProvider>
    );

}
    
export default App;