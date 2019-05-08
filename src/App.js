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
    constructor(props){
        super(props);
        this.state = {
            weatherTimer: 0
        }

    }
    render(){

        let cityObject = {
            name: "",
            temperatureData: 15,
            iconCode: "http://openweathermap.org/img/w/01d.png",
        };
        let Milwaukee = Object.create(cityObject);
        Milwaukee.name = "Milwaukee";
        Milwaukee.temperatureData = 20;
        let Minneapolis = Object.create(cityObject);
        Minneapolis.name = "Minneapolis";
        Minneapolis.temperatureData = 40;
        let Chicago = Object.create(cityObject);
        Chicago.name = "Chicago";
        Chicago.temperatureData = 15;
        let Dallas = Object.create(cityObject);
        Dallas.name = "Dallas";
        Dallas.temperatureData = 60;
        let weather_data = new XMLHttpRequest();
        const api_url = "http://api.openweathermap.org/data/2.5/group?id=5263045,5037649,4887398,4684888&APPID=07df4cb7dd53c7d702e04e5c3f659e13&units=imperial";
        weather_data.open('GET', api_url, true);
        weather_data.send();

        weather_data.onload = function(){
            let cityData = JSON.parse(weather_data.response);
            Milwaukee.name = cityData.list[0].name;
            Milwaukee.temperatureData = cityData.list[0].main.temp;
            console.log(Milwaukee.temperatureData);

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
    getData(){
        this.renderCity()
    }
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
            celsius: false,
            units: "°F",
            temperature: props.temp,
            icon: props.icon,
        };
    }
    render(){
        return(
            <div className={"city"} onClick={()=> this.expandCity()} title={"Click for more Weather Info"}>
                <h1 onClick={()=> this.updateName()}
                    title={"Click to Change Name"}>
                        {this.state.name} </h1>

                <p onClick={()=>this.changeUnits()}
                   title={"Click to Change Units"}>
                        {this.state.temperature}{this.state.units} </p>

                <img src={this.state.icon} alt={"icon"}/>
            </div>
        );
    }
    expandCity(){

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
    updateName() {
        let cityName = this.state.name;
        let odds = Math.ceil(Math.random()*100);
        if(odds<50){
            cityName = cityName.toUpperCase();
        }
        else{
            cityName = cityName.toLowerCase();
        }
        this.setState({
            name: cityName
        });
    }
}
export default WeatherWebsite;