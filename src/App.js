import React, { Component } from 'react';
import './App.css';
import MainScreen from "./Components/MainScreen";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
import Login from "./Components/Login";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainScreen: false
        }
    }

    componentDidMount(){
        let username = localStorage.getItem('username');
        if(username){
            this.toMainScreen(true, {name: username, jobTitle: 'Developer'})
        }
    }

    toMainScreen = (value, user) =>{
        this.setState({
            mainScreen: value,
            user: user,

        })
    };

    toLoginScreen = () =>{
        localStorage.setItem('username', '');
        this.setState({
            mainScreen: false,
        })
    };

    render() {
        return (
            <div style={styles.app}>
                <ToastContainer autoClose={2000}/>
                {this.state.mainScreen ?
                    <MainScreen user={this.state.user} toast={toast} logout={this.toLoginScreen.bind(this)}/> :
                    <Login callback={this.toMainScreen} toast={toast}/>}
            </div>
        );
    }
}

let styles = {
  app: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
  }
};

export default App;
