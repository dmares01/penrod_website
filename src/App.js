import React from 'react';
import './App.css';

class WeatherWebsite extends React.Component{
    render(){
        return(
            <div>
                <WeatherHeader />
                <CityList/>
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
    componentWillMount() {
    }

    render(){

        let cityObject = {
            name: "",
            temperatureData: 15,
            iconCode: "bitch",
        };
        let Milwaukee = Object.create(cityObject);
        Milwaukee.name = "Milwaukee";
        Milwaukee.temperatureData = "20 °F";
        Milwaukee.iconCode = "01D";
        let Minneapolis = Object.create(cityObject);
        Minneapolis.name = "Minneapolis";
        Minneapolis.temperatureData = "20 °F";
        Minneapolis.iconCode = "01D";
        let Chicago = Object.create(cityObject);
        Chicago.name = "Chicago";
        Chicago.temperatureData = "20 °F";
        Chicago.iconCode = "01D";
        let Dallas = Object.create(cityObject);
        Dallas.name = "Dallas";
        Dallas.temperatureData = "20 °F";
        Dallas.iconCode = "01D";
        let weather_data = new XMLHttpRequest();
        const api_url = "http://api.openweathermap.org/data/2.5/group?id=5263045,5037649,4887398,4684888&APPID=07df4cb7dd53c7d702e04e5c3f659e13&units=imperial";
        weather_data.open('GET', api_url, true);
        weather_data.send();
        weather_data.onload = function(){
            let cityData = JSON.parse(weather_data.response);
            Milwaukee.name = cityData.list[0].name;
            Milwaukee.temperatureData = cityData.list[0].main.temp;
        };

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
class City extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: props.name,
            temperature: props.temp,
            icon: props.icon,
        };
    }
    render(){
        return(
            <div className={"city"}>
                <h1>{this.state.name} </h1>
                <p>{this.state.temperature}</p>
                <p>{this.state.icon}</p>
                <button onClick={()=> this.updateCity()}> Change Name</button>
            </div>
        );
    }
    updateCity() {
        this.setState({
            name: "butt"
        });
    }
}
export default WeatherWebsite;