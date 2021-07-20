import React from 'react';
import './App.css';
import 'bulma/css/bulma.min.css';
import TabsContent from "./components/TabsContent";


function App() {
    return (
        <div className="App">
            <div className="box">
                <div className="row header">
                    <section className="hero">
                        <div className="hero-body">
                            <div className="container has-text-centered">
                                <p className="title">AFK Arena Helper</p>
                                <p className="subtitle"><span role="img" aria-label="Thunderbolt">⚡</span> Electron App</p>
                            </div>
                        </div>
                    </section>
                </div>


                <div className="row content">
                    <div id="tabs-with-content" style={{ height: "100%", paddingRight: "3em" }} >
                        <TabsContent></TabsContent>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
