import React from 'react';
import './App.css';

class WeatherWebsite extends React.Component{
    render(){
        return(
            <div>
                <WeatherHeader />
                <CityList />
            </div>

        );
    }
}
class WeatherHeader extends React.Component{
    render(){
        return(
            <header>
                Please Click a City Below to See a Full Weather Report
            </header>
        );
    }
}
class CityList extends React.Component{
    componentDidMount() {
        this.setState({
            isLoading: true
        });
        fetch("http://api.openweathermap.org/data/2.5/group?id=5263045,5037649,4887398,4684888&APPID=07df4cb7dd53c7d702e04e5c3f659e13&units=imperial")
            .then(response => response.json())
            .then(data => this.setState({ city: data.list, isLoading: false }));
    }

    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            city: []
        }

    }
    render(){
        if(this.state.isLoading){
            return(
                <h1>Loading...</h1>
            )
        }
        let cityObject = {
            name: " ",
            temperatureData: 0,
            iconCode: " ",
        };
        let Milwaukee = Object.create(cityObject);
        let Minneapolis = Object.create(cityObject);
        let Chicago = Object.create(cityObject);
        let Dallas = Object.create(cityObject);
        if(this.state.city.length > 0) {
            Milwaukee.name = this.state.city[0].name;
            Milwaukee.temperatureData = Math.round(this.state.city[0].main.temp);
            Milwaukee.iconCode = fetchIcon(this.state.city[0].weather[0].icon);

            Minneapolis.name = this.state.city[1].name;
            Minneapolis.temperatureData = Math.round(this.state.city[1].main.temp);
            Minneapolis.iconCode = fetchIcon(this.state.city[1].weather[0].icon);

            Chicago.name = this.state.city[2].name;
            Chicago.temperatureData = Math.round(this.state.city[2].main.temp);
            Chicago.iconCode = fetchIcon(this.state.city[2].weather[0].icon);

            Dallas.name = this.state.city[3].name;
            Dallas.temperatureData = Math.round(this.state.city[3].main.temp);
            Dallas.iconCode = fetchIcon(this.state.city[3].weather[0].icon);
        }

        return(
            <div>
                {this.renderCity(Milwaukee)}
                {this.renderCity(Minneapolis)}
                {this.renderCity(Chicago)}
                {this.renderCity(Dallas)}
            </div>
        )
    };//end of render

    renderCity(city){
        return(
            <div>
                <City
                    name = {city.name}
                    temp = {city.temperatureData}
                    icon = {city.iconCode}
                />
            </div>
        )
    }
}
function fetchIcon(value){
    let iconURL;
    iconURL = "http://openweathermap.org/img/w/";
    iconURL += value;
    iconURL += ".png";
    return iconURL;
}
class City extends React.Component{
    constructor(props){
        super(props);
        this.name = props.name;
        this.icon = props.icon;
        this.state = {
            celsius: false,
            units: "°F",
            temperature: props.temp,
            expanded: false,
            extra: null,
        };
    }
    render(){
        return(
            <div className={"city"} >
                <h1 onClick={()=> this.expandCity()}>{this.name} </h1>
                <p onClick={()=>this.changeUnits()}
                   title={"Click to Change Units"}
                    className={"temp"}>
                        {this.state.temperature}{this.state.units} </p>

                <img src={this.icon} alt={"icon"}/>
                <p>{this.state.extra}</p>
            </div>
        );
    }
    expandCity(){
        if(!this.state.expanded){
            this.setState({
                extra: "Here is additional information",
                expanded: !this.state.expanded,
            })
        }
        else{
            this.setState({
                extra: null,
                expanded: !this.state.expanded,
            })
        }
    }
    changeUnits(){
        let newTemperature = 0;
        let newUnits = " ";
        if(this.state.celsius){
            newTemperature = ((this.state.temperature * 9/5)+ 32).toFixed(0);
            newUnits = " °F";
        }
        else{
            newTemperature = ((this.state.temperature - 32) * 5/9).toFixed(1);
            newUnits = " °C";
        }
        this.setState({
            temperature: newTemperature,
            celsius: !this.state.celsius,
            units: newUnits,
        })
    }
}
export default WeatherWebsite;