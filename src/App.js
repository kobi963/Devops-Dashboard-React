import React, { Component } from 'react';
import './App.css';
import MainScreen from "./Components/MainScreen";

import Login from "./Components/Login";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainScreen: false
        }
    }

    async toMainScreen(value, user){
        await this.setState({
            mainScreen: value,
            user: user,

        })
    };

    render() {
        let user = {name: 'Srulik',jobTitle: 'Likes pop music'};

        return (
            <div style={styles.app}>
                {/*{this.state.mainScreen ? <MainScreen user={this.state.user}/> : <Login callback={this.toMainScreen.bind(this)}/>}*/}
                <MainScreen user={user}/>
            </div>
        );
    }
}



let styles = {
  app: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      height: 600

  }
};

export default App;
